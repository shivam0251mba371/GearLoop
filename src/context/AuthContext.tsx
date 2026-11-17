import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebaseConfig';
import { UserProfile, PlanType } from '../types';
import { DEFAULT_USER } from '../data/seedData';

export interface AuthActionResult {
  success: boolean;
  error?: string;
  code?: string;
  needsEmailVerification?: boolean;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isDemoSession: boolean;
  loading: boolean;
  authBusy: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithGoogle: () => Promise<AuthActionResult>;
  loginWithEmail: (email: string, password: string) => Promise<AuthActionResult>;
  registerWithEmail: (
    email: string,
    password: string,
    displayName: string,
    hostelHub: string
  ) => Promise<AuthActionResult>;
  sendPasswordReset: (email: string) => Promise<AuthActionResult>;
  resendVerificationEmail: () => Promise<AuthActionResult>;
  refreshVerificationStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  subscribeToPlan: (plan: PlanType, durationDays: number, upiRef: string) => void;
  switchDemoProfile: (type: 'verified-dgu' | 'monthly-dgu' | 'unverified-guest') => void;
  verifyStudentDomain: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseAuthError(error: unknown): { message: string; code: string } {
  const errObj = error as { code?: string; message?: string };
  const code = errObj?.code || 'auth/unknown';
  switch (code) {
    case 'auth/operation-not-allowed':
      return {
        code,
        message:
          'Email/Password sign-in is not yet enabled in your Firebase Console (Authentication → Sign-in method → Email/Password). You can enable it there or use "Continue with Google" below with your email ID.'
      };
    case 'auth/invalid-email':
      return { code, message: 'Please enter a valid email address.' };
    case 'auth/user-disabled':
      return { code, message: 'This account has been disabled. Contact campus support.' };
    case 'auth/user-not-found':
      return { code, message: 'No account found with this email ID. Switch to "Create Account" to register.' };
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return { code, message: 'Incorrect email ID or password. Please check your credentials and try again.' };
    case 'auth/email-already-in-use':
      return { code, message: 'An account with this email ID already exists. Please sign in instead.' };
    case 'auth/weak-password':
      return { code, message: 'Password must be at least 6 characters long.' };
    case 'auth/popup-closed-by-user':
      return { code, message: 'Google Sign-In popup was closed before completing login.' };
    case 'auth/popup-blocked':
      return { code, message: 'Sign-in popup was blocked by your browser. Please allow popups and try again.' };
    case 'auth/unauthorized-domain':
      return {
        code,
        message: 'This domain is not authorized in Firebase Auth settings. Check Firebase Console → Authentication → Settings → Authorized domains.'
      };
    case 'auth/too-many-requests':
      return { code, message: 'Too many login attempts. Please wait a moment and try again.' };
    default:
      return { code, message: errObj?.message || 'Authentication failed. Please try again.' };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const loggedOut = localStorage.getItem('gearloop_explicit_logout') === 'true';
    if (loggedOut) return null;
    const saved = localStorage.getItem('gearloop_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authBusy, setAuthBusy] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const isDemoSession = !firebaseUser && currentUser !== null;

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gearloop_current_user', JSON.stringify(currentUser));
      localStorage.removeItem('gearloop_explicit_logout');
    } else {
      localStorage.removeItem('gearloop_current_user');
    }
  }, [currentUser]);

  const verifyStudentDomain = useCallback((email: string): boolean => {
    if (!email) return false;
    const lower = email.toLowerCase().trim();
    return lower.endsWith('@dgu.ac.in') || lower.endsWith('.edu') || lower.endsWith('.ac.in');
  }, []);

  const syncFirebaseUserToProfile = useCallback(
    async (user: FirebaseUser, preferredHub?: string): Promise<UserProfile> => {
      const email = (user.email || '').trim();
      const isVerifiedStudent = verifyStudentDomain(email);
      const fallbackName = user.displayName?.trim() || email.split('@')[0] || 'GearLoop User';
      const fallbackPhoto =
        user.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=10b981&color=0f172a&bold=true`;

      // Try loading existing Firestore profile if user's email is verified
      const userDocPath = `users/${user.uid}`;
      if (user.emailVerified) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            const data = snap.data();
            const loaded: UserProfile = {
              uid: user.uid,
              displayName: String(data.displayName || fallbackName),
              email: String(data.email || email),
              photoURL: String(data.photoURL || fallbackPhoto),
              isVerifiedStudent: Boolean(data.isVerifiedStudent ?? isVerifiedStudent),
              hostelHub: String(data.hostelHub || preferredHub || 'Main Campus Gate Dock'),
              activePlan: (data.activePlan as PlanType) || 'NONE',
              planExpiryDate: data.planExpiryDate ? String(data.planExpiryDate) : undefined,
              walletBalance: typeof data.walletBalance === 'number' ? data.walletBalance : 300,
              phone: data.phone ? String(data.phone) : '',
              upiId: data.upiId ? String(data.upiId) : `${email.split('@')[0] || 'student'}@okaxis`,
              studentId: data.studentId ? String(data.studentId) : undefined,
              department: data.department ? String(data.department) : undefined,
              createdAt:
                typeof data.createdAt === 'string'
                  ? data.createdAt
                  : data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString()
            };
            return loaded;
          }

          // Create fresh Firestore profile adhering strictly to firebase-blueprint.json & firestore.rules
          const newDocPayload = {
            uid: user.uid,
            displayName: fallbackName.slice(0, 100),
            email: email.slice(0, 150),
            photoURL: fallbackPhoto.slice(0, 500),
            isVerifiedStudent,
            hostelHub: (preferredHub || 'Main Campus Gate Dock').slice(0, 100),
            activePlan: isVerifiedStudent ? 'TRIAL_3DAY' : 'NONE',
            planExpiryDate: isVerifiedStudent
              ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
              : null,
            walletBalance: 300,
            phone: '',
            upiId: `${email.split('@')[0] || 'student'}@okaxis`.slice(0, 100),
            studentId: isVerifiedStudent ? 'DGU-VERIFIED' : 'PENDING_VERIFICATION',
            department: isVerifiedStudent ? 'DBS Global University' : 'Campus Member',
            createdAt: serverTimestamp()
          };
          await setDoc(doc(db, 'users', user.uid), newDocPayload);
          return {
            uid: user.uid,
            displayName: newDocPayload.displayName,
            email: newDocPayload.email,
            photoURL: newDocPayload.photoURL,
            isVerifiedStudent: newDocPayload.isVerifiedStudent,
            hostelHub: newDocPayload.hostelHub,
            activePlan: newDocPayload.activePlan as PlanType,
            planExpiryDate: newDocPayload.planExpiryDate || undefined,
            walletBalance: newDocPayload.walletBalance,
            phone: newDocPayload.phone,
            upiId: newDocPayload.upiId,
            studentId: newDocPayload.studentId,
            department: newDocPayload.department,
            createdAt: new Date().toISOString()
          };
        } catch (err) {
          if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
            handleFirestoreError(err, OperationType.WRITE, userDocPath);
          }
          console.warn('Firestore profile sync skipped, using authenticated Auth profile:', err);
        }
      }

      // Fresh profile from Auth user (never inherit DEFAULT_USER fields!)
      return {
        uid: user.uid,
        displayName: fallbackName,
        email,
        photoURL: fallbackPhoto,
        isVerifiedStudent,
        hostelHub: preferredHub || 'Main Campus Gate Dock',
        activePlan: isVerifiedStudent ? 'TRIAL_3DAY' : 'NONE',
        planExpiryDate: isVerifiedStudent
          ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        walletBalance: 300,
        phone: '',
        upiId: `${email.split('@')[0] || 'student'}@okaxis`,
        studentId: isVerifiedStudent ? 'DGU-VERIFIED' : 'EMAIL_MEMBER',
        department: isVerifiedStudent ? 'DBS Global University' : 'Registered Email Account',
        createdAt: new Date().toISOString()
      };
    },
    [verifyStudentDomain]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        localStorage.removeItem('gearloop_explicit_logout');
        const profile = await syncFirebaseUserToProfile(user);
        setCurrentUser(profile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncFirebaseUserToProfile]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const loginWithGoogle = async (): Promise<AuthActionResult> => {
    try {
      setAuthBusy(true);
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await syncFirebaseUserToProfile(result.user);
      setFirebaseUser(result.user);
      setCurrentUser(profile);
      setIsLoginModalOpen(false);
      return { success: true };
    } catch (error) {
      const mapped = mapFirebaseAuthError(error);
      return { success: false, error: mapped.message, code: mapped.code };
    } finally {
      setAuthBusy(false);
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<AuthActionResult> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email ID.', code: 'auth/invalid-email' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.', code: 'auth/missing-password' };
    }
    try {
      setAuthBusy(true);
      const result = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const profile = await syncFirebaseUserToProfile(result.user);
      setFirebaseUser(result.user);
      setCurrentUser(profile);
      setIsLoginModalOpen(false);
      return {
        success: true,
        needsEmailVerification: !result.user.emailVerified
      };
    } catch (error) {
      const mapped = mapFirebaseAuthError(error);
      return { success: false, error: mapped.message, code: mapped.code };
    } finally {
      setAuthBusy(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    hostelHub: string
  ): Promise<AuthActionResult> => {
    const trimmedEmail = email.trim();
    const trimmedName = displayName.trim() || trimmedEmail.split('@')[0] || 'Student';
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email ID.', code: 'auth/invalid-email' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.', code: 'auth/weak-password' };
    }
    try {
      setAuthBusy(true);
      const result = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      await updateProfile(result.user, { displayName: trimmedName.slice(0, 100) });
      try {
        await sendEmailVerification(result.user);
      } catch (verifyErr) {
        console.warn('Could not send verification email automatically:', verifyErr);
      }
      const profile = await syncFirebaseUserToProfile(result.user, hostelHub);
      setFirebaseUser(result.user);
      setCurrentUser({ ...profile, displayName: trimmedName, hostelHub });
      setIsLoginModalOpen(false);
      return {
        success: true,
        needsEmailVerification: !result.user.emailVerified
      };
    } catch (error) {
      const mapped = mapFirebaseAuthError(error);
      return { success: false, error: mapped.message, code: mapped.code };
    } finally {
      setAuthBusy(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<AuthActionResult> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Enter your email ID first to receive a reset link.' };
    }
    try {
      setAuthBusy(true);
      await sendPasswordResetEmail(auth, trimmedEmail);
      return { success: true };
    } catch (error) {
      const mapped = mapFirebaseAuthError(error);
      return { success: false, error: mapped.message, code: mapped.code };
    } finally {
      setAuthBusy(false);
    }
  };

  const resendVerificationEmail = async (): Promise<AuthActionResult> => {
    if (!auth.currentUser) {
      return { success: false, error: 'No active email session found.' };
    }
    try {
      setAuthBusy(true);
      await sendEmailVerification(auth.currentUser);
      return { success: true };
    } catch (error) {
      const mapped = mapFirebaseAuthError(error);
      return { success: false, error: mapped.message, code: mapped.code };
    } finally {
      setAuthBusy(false);
    }
  };

  const refreshVerificationStatus = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    setFirebaseUser(auth.currentUser);
    if (auth.currentUser.emailVerified) {
      const profile = await syncFirebaseUserToProfile(auth.currentUser);
      setCurrentUser(profile);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem('gearloop_explicit_logout', 'true');
    setFirebaseUser(null);
    setCurrentUser(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));

    if (auth.currentUser && auth.currentUser.emailVerified) {
      const userPath = `users/${auth.currentUser.uid}`;
      try {
        const sanitizedUpdates: Record<string, unknown> = {
          updatedAt: serverTimestamp()
        };
        if (updates.displayName !== undefined) sanitizedUpdates.displayName = updates.displayName.slice(0, 100);
        if (updates.photoURL !== undefined) sanitizedUpdates.photoURL = updates.photoURL.slice(0, 500);
        if (updates.hostelHub !== undefined) sanitizedUpdates.hostelHub = updates.hostelHub.slice(0, 100);
        if (updates.activePlan !== undefined) sanitizedUpdates.activePlan = updates.activePlan;
        if (updates.planExpiryDate !== undefined) sanitizedUpdates.planExpiryDate = updates.planExpiryDate;
        if (updates.walletBalance !== undefined) sanitizedUpdates.walletBalance = updates.walletBalance;
        if (updates.phone !== undefined) sanitizedUpdates.phone = updates.phone.slice(0, 30);
        if (updates.upiId !== undefined) sanitizedUpdates.upiId = updates.upiId.slice(0, 100);
        if (updates.studentId !== undefined) sanitizedUpdates.studentId = updates.studentId.slice(0, 64);
        if (updates.department !== undefined) sanitizedUpdates.department = updates.department.slice(0, 100);
        if (updates.isVerifiedStudent !== undefined) sanitizedUpdates.isVerifiedStudent = updates.isVerifiedStudent;

        await updateDoc(doc(db, 'users', auth.currentUser.uid), sanitizedUpdates);
      } catch (err) {
        if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
          handleFirestoreError(err, OperationType.UPDATE, userPath);
        }
        console.warn('Could not persist profile update to Firestore:', err);
      }
    }
  };

  const subscribeToPlan = (plan: PlanType, durationDays: number, _upiRef: string) => {
    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    void updateUserProfile({
      activePlan: plan,
      planExpiryDate: expiryDate
    });
  };

  const switchDemoProfile = (type: 'verified-dgu' | 'monthly-dgu' | 'unverified-guest') => {
    // If switching to a demo profile while signed in with Firebase, sign out of Firebase cleanly first
    if (auth.currentUser) {
      void signOut(auth);
      setFirebaseUser(null);
    }
    localStorage.removeItem('gearloop_explicit_logout');

    if (type === 'verified-dgu') {
      setCurrentUser({
        uid: 'demo-student-dgu',
        displayName: 'Karan Singhania',
        email: 'karan.singh@dgu.ac.in',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isVerifiedStudent: true,
        hostelHub: 'Selaqui PG Hub A (Green Valley)',
        activePlan: 'TRIAL_3DAY',
        planExpiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        walletBalance: 450,
        phone: '+91 98765 43210',
        upiId: 'karan.dgu@okaxis',
        studentId: 'DGU-2023-CS-049',
        department: 'Computer Science & Engineering',
        createdAt: '2026-10-01T12:00:00.000Z'
      });
    } else if (type === 'monthly-dgu') {
      setCurrentUser({
        uid: 'user-priya-dgu',
        displayName: 'Priya Verma',
        email: 'priya.verma@dgu.ac.in',
        photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        isVerifiedStudent: true,
        hostelHub: 'Hostel Block C Yard',
        activePlan: 'MONTHLY_PASS',
        planExpiryDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString(),
        walletBalance: 1250,
        phone: '+91 91234 56789',
        upiId: 'priya.verma@okhdfcbank',
        studentId: 'DGU-2024-BBA-112',
        department: 'School of Management',
        createdAt: '2026-09-15T09:00:00.000Z'
      });
    } else {
      setCurrentUser({
        uid: 'user-guest-extern',
        displayName: 'Guest Visitor',
        email: 'visitor.student@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        isVerifiedStudent: false,
        hostelHub: 'Selaqui Chowk Market Hub',
        activePlan: 'NONE',
        walletBalance: 100,
        phone: '+91 99887 76655',
        upiId: 'guest.pay@paytm',
        studentId: 'PENDING_VERIFICATION',
        department: 'External Exchange',
        createdAt: '2026-10-08T18:00:00.000Z'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isDemoSession,
        loading,
        authBusy,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        resendVerificationEmail,
        refreshVerificationStatus,
        logout,
        updateUserProfile,
        subscribeToPlan,
        switchDemoProfile,
        verifyStudentDomain
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
