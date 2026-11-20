import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebaseConfig';
import {
  Vehicle,
  MarketplaceItem,
  Rental,
  CampusHub
} from '../types';
import {
  CAMPUS_HUBS,
  INITIAL_VEHICLES,
  INITIAL_MARKETPLACE_ITEMS,
  INITIAL_RENTALS
} from '../data/seedData';
import { useAuth } from './AuthContext';

interface AppContextType {
  hubs: CampusHub[];
  selectedHub: CampusHub;
  setSelectedHub: (hub: CampusHub) => void;
  vehicles: Vehicle[];
  marketplaceItems: MarketplaceItem[];
  rentals: Rental[];
  activeRide: Rental | null;
  activeRideElapsedSeconds: number;
  activeVehicle: Vehicle | null;

  // Mobility Actions
  startRide: (vehicleId: string, planType: 'TRIAL_99' | 'MONTHLY_899' | 'PAY_PER_RIDE') => boolean;
  endRide: (dropHubName: string) => Rental | null;
  unlockVehicleByQr: (qrCode: string) => { success: boolean; vehicle?: Vehicle; message: string };

  // Marketplace Actions
  createMarketplaceItem: (item: Omit<MarketplaceItem, 'itemId' | 'createdAt' | 'status' | 'isEscrowHeld'>) => void;
  lockEscrowForItem: (itemId: string, upiTxnRef: string) => boolean;
  completeEscrowPickup: (itemId: string) => boolean;
  cancelEscrowHold: (itemId: string) => boolean;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;

  // UI helpers
  openQrScannerModal: boolean;
  setOpenQrScannerModal: (open: boolean) => void;
  openPostItemModal: boolean;
  setOpenPostItemModal: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, firebaseUser } = useAuth();

  const [hubs] = useState<CampusHub[]>(CAMPUS_HUBS);
  const [selectedHub, setSelectedHub] = useState<CampusHub>(CAMPUS_HUBS[0]);

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('gearloop_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('gearloop_marketplace');
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE_ITEMS;
  });

  const [rentals, setRentals] = useState<Rental[]>(() => {
    const saved = localStorage.getItem('gearloop_rentals');
    return saved ? JSON.parse(saved) : INITIAL_RENTALS;
  });

  const [activeRide, setActiveRide] = useState<Rental | null>(() => {
    const saved = localStorage.getItem('gearloop_active_ride');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRideElapsedSeconds, setActiveRideElapsedSeconds] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openQrScannerModal, setOpenQrScannerModal] = useState<boolean>(false);
  const [openPostItemModal, setOpenPostItemModal] = useState<boolean>(false);

  // Sync Firestore collections when authenticated & email verified
  useEffect(() => {
    if (!firebaseUser || !firebaseUser.emailVerified) return;

    const vehiclesPath = 'vehicles';
    const unsubVehicles = onSnapshot(
      collection(db, vehiclesPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((d) => d.data() as Vehicle);
          setVehicles(loaded);
        }
      },
      (error) => {
        if (error.message.includes('Missing or insufficient permissions')) {
          handleFirestoreError(error, OperationType.LIST, vehiclesPath);
        }
      }
    );

    const marketPath = 'marketplace_items';
    const unsubMarket = onSnapshot(
      collection(db, marketPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((d) => d.data() as MarketplaceItem);
          setMarketplaceItems(loaded);
        }
      },
      (error) => {
        if (error.message.includes('Missing or insufficient permissions')) {
          handleFirestoreError(error, OperationType.LIST, marketPath);
        }
      }
    );

    const rentalsPath = 'rentals';
    const rentalsQuery = query(
      collection(db, rentalsPath),
      where('userId', '==', firebaseUser.uid)
    );
    const unsubRentals = onSnapshot(
      rentalsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((d) => d.data() as Rental);
          setRentals(loaded.sort((a, b) => b.startTime.localeCompare(a.startTime)));
        }
      },
      (error) => {
        if (error.message.includes('Missing or insufficient permissions')) {
          handleFirestoreError(error, OperationType.LIST, rentalsPath);
        }
      }
    );

    return () => {
      unsubVehicles();
      unsubMarket();
      unsubRentals();
    };
  }, [firebaseUser]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('gearloop_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('gearloop_marketplace', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    localStorage.setItem('gearloop_rentals', JSON.stringify(rentals));
  }, [rentals]);

  useEffect(() => {
    if (activeRide) {
      localStorage.setItem('gearloop_active_ride', JSON.stringify(activeRide));
    } else {
      localStorage.removeItem('gearloop_active_ride');
    }
  }, [activeRide]);

  // Active ride timer increment
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeRide) {
      const startMs = new Date(activeRide.startTime).getTime();
      const initialElapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      setActiveRideElapsedSeconds(initialElapsed);

      interval = setInterval(() => {
        const currentElapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
        setActiveRideElapsedSeconds(currentElapsed);
      }, 1000);
    } else {
      setActiveRideElapsedSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeRide]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const clearToast = () => setToastMessage(null);

  const activeVehicle = activeRide
    ? vehicles.find((v) => v.vehicleId === activeRide.vehicleId) || null
    : null;

  const canWriteToFirestore = Boolean(firebaseUser && firebaseUser.emailVerified);

  const startRide = (
    vehicleId: string,
    planType: 'TRIAL_99' | 'MONTHLY_899' | 'PAY_PER_RIDE'
  ): boolean => {
    const vehicle = vehicles.find((v) => v.vehicleId === vehicleId);
    if (!vehicle) {
      showToast('Error: Vehicle not found.');
      return false;
    }
    if (vehicle.status !== 'AVAILABLE') {
      showToast(`Vehicle ${vehicleId} is currently ${vehicle.status.toLowerCase()}.`);
      return false;
    }

    const rentalId = `rent-${Date.now().toString().slice(-6)}`;
    const newRental: Rental = {
      rentalId,
      userId: currentUser?.uid || 'guest-user',
      userName: (currentUser?.displayName || 'Campus Scholar').slice(0, 100),
      vehicleId: vehicle.vehicleId,
      vehicleType: vehicle.type,
      vehicleModel: vehicle.modelName.slice(0, 120),
      planType,
      startTime: new Date().toISOString(),
      endTime: null,
      pickupHub: vehicle.currentHub.slice(0, 100),
      dropHub: null,
      paymentStatus: 'PAID',
      upiTxnRef: `UPI/DGU/${Date.now().toString().slice(-8)}/RIDE`,
      distanceKm: 0,
      carbonSavedKg: 0,
      durationMinutes: 0
    };

    // Update vehicle to IN_USE locally
    setVehicles((prev) =>
      prev.map((v) => (v.vehicleId === vehicleId ? { ...v, status: 'IN_USE' } : v))
    );

    if (canWriteToFirestore && firebaseUser) {
      const vehiclePath = `vehicles/${vehicleId}`;
      const rentalPath = `rentals/${rentalId}`;
      void (async () => {
        try {
          const vehicleRef = doc(db, 'vehicles', vehicleId);
          const vSnap = await getDoc(vehicleRef);
          if (vSnap.exists()) {
            await updateDoc(vehicleRef, {
              status: 'IN_USE',
              currentHub: vehicle.currentHub.slice(0, 100),
              batteryPercent: vehicle.batteryPercent
            });
          } else {
            await setDoc(vehicleRef, {
              vehicleId: vehicle.vehicleId,
              type: vehicle.type,
              modelName: vehicle.modelName.slice(0, 120),
              currentHub: vehicle.currentHub.slice(0, 100),
              status: 'IN_USE',
              batteryPercent: vehicle.batteryPercent,
              qrCodeKey: vehicle.qrCodeKey
            });
          }
          await setDoc(doc(db, 'rentals', rentalId), {
            ...newRental,
            userId: firebaseUser.uid
          });
        } catch (err) {
          if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
            handleFirestoreError(err, OperationType.WRITE, `${vehiclePath} | ${rentalPath}`);
          }
        }
      })();
    }

    setActiveRide(newRental);
    showToast(`Trip started! ${vehicle.modelName} unlocked at ${vehicle.currentHub}`);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {}

    return true;
  };

  const endRide = (dropHubName: string): Rental | null => {
    if (!activeRide) return null;

    const endTime = new Date().toISOString();
    const durationMinutes = Math.max(1, Math.round(activeRideElapsedSeconds / 60));
    const speedKmh = activeRide.vehicleType === 'E_SCOOTER' ? 18 : 12;
    const distanceKm = Number(((durationMinutes / 60) * speedKmh).toFixed(2));
    const carbonSavedKg = Number((distanceKm * 0.192).toFixed(2));
    const totalCost = activeRide.planType === 'PAY_PER_RIDE' ? Math.round(durationMinutes * 2) : 0;

    const completedRental: Rental = {
      ...activeRide,
      endTime,
      dropHub: dropHubName.slice(0, 100),
      durationMinutes,
      distanceKm,
      carbonSavedKg,
      totalCost
    };

    const currentVeh = vehicles.find((v) => v.vehicleId === activeRide.vehicleId);
    const nextBattery =
      currentVeh && currentVeh.type === 'E_SCOOTER' && currentVeh.batteryPercent !== null
        ? Math.max(15, currentVeh.batteryPercent - Math.min(currentVeh.batteryPercent, Math.round(distanceKm * 2)))
        : null;

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.vehicleId === activeRide.vehicleId) {
          return {
            ...v,
            status: 'AVAILABLE',
            currentHub: dropHubName,
            batteryPercent: nextBattery
          };
        }
        return v;
      })
    );

    if (canWriteToFirestore && firebaseUser) {
      void (async () => {
        try {
          const vehicleRef = doc(db, 'vehicles', activeRide.vehicleId);
          const vSnap = await getDoc(vehicleRef);
          if (vSnap.exists()) {
            await updateDoc(vehicleRef, {
              status: 'AVAILABLE',
              currentHub: dropHubName.slice(0, 100),
              batteryPercent: nextBattery
            });
          }
          const rentalRef = doc(db, 'rentals', activeRide.rentalId);
          const rSnap = await getDoc(rentalRef);
          if (
            rSnap.exists() &&
            rSnap.data().userId === firebaseUser.uid &&
            rSnap.data().endTime === null
          ) {
            await updateDoc(rentalRef, {
              endTime,
              dropHub: dropHubName.slice(0, 100),
              durationMinutes,
              distanceKm,
              carbonSavedKg,
              totalCost
            });
          }
        } catch (err) {
          if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
            handleFirestoreError(err, OperationType.UPDATE, `rentals/${activeRide.rentalId}`);
          }
        }
      })();
    }

    setRentals((prev) => [completedRental, ...prev]);
    setActiveRide(null);
    showToast(`Ride ended successfully! Locked at ${dropHubName}. Saved ${carbonSavedKg} kg CO₂.`);

    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    return completedRental;
  };

  const unlockVehicleByQr = (
    qrCode: string
  ): { success: boolean; vehicle?: Vehicle; message: string } => {
    const cleaned = qrCode.trim().toUpperCase();
    const vehicle = vehicles.find(
      (v) => v.qrCodeKey.toUpperCase() === cleaned || v.vehicleId.toUpperCase() === cleaned
    );

    if (!vehicle) {
      return { success: false, message: `No vehicle found with QR tag: ${cleaned}` };
    }

    if (vehicle.status !== 'AVAILABLE') {
      return {
        success: false,
        vehicle,
        message: `Vehicle is currently ${vehicle.status}. Please pick an available one.`
      };
    }

    if (vehicle.type === 'E_SCOOTER' && (vehicle.batteryPercent ?? 0) < 15) {
      return {
        success: false,
        vehicle,
        message: `Battery too low (${vehicle.batteryPercent}%). Choose another docked EV.`
      };
    }

    return {
      success: true,
      vehicle,
      message: `Found ${vehicle.modelName} at ${vehicle.currentHub}`
    };
  };

  const createMarketplaceItem = (
    itemData: Omit<MarketplaceItem, 'itemId' | 'createdAt' | 'status' | 'isEscrowHeld'>
  ) => {
    const itemId = `item-${Date.now().toString().slice(-6)}`;
    const newItem: MarketplaceItem = {
      ...itemData,
      itemId,
      sellerId: firebaseUser?.uid || itemData.sellerId,
      sellerName: itemData.sellerName.slice(0, 100),
      title: itemData.title.slice(0, 150),
      description: itemData.description.slice(0, 1000),
      hubLocation: itemData.hubLocation.slice(0, 100),
      images: itemData.images.slice(0, 5),
      createdAt: new Date().toISOString(),
      status: 'AVAILABLE',
      isEscrowHeld: false
    };

    setMarketplaceItems((prev) => [newItem, ...prev]);

    if (canWriteToFirestore && firebaseUser) {
      // Strip sellerEmail from public marketplace listing to comply with PII isolation
      const { sellerEmail: _omittedEmail, ...publicDoc } = newItem;
      void setDoc(doc(db, 'marketplace_items', itemId), {
        ...publicDoc,
        sellerId: firebaseUser.uid
      }).catch((err) => {
        if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
          handleFirestoreError(err, OperationType.CREATE, `marketplace_items/${itemId}`);
        }
      });
    }

    showToast(`Your asset "${newItem.title}" has been listed on the DBS Campus Marketplace!`);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
  };

  const lockEscrowForItem = (itemId: string, _upiTxnRef: string): boolean => {
    const item = marketplaceItems.find((i) => i.itemId === itemId);
    if (!item) return false;

    const escrowCode = `ESC-${Math.floor(1000 + Math.random() * 9000)}`;
    const buyerId = firebaseUser?.uid || currentUser?.uid || 'guest-buyer';
    const buyerName = (currentUser?.displayName || 'Campus Student').slice(0, 100);

    setMarketplaceItems((prev) =>
      prev.map((i) => {
        if (i.itemId === itemId) {
          return {
            ...i,
            isEscrowHeld: true,
            status: 'ESCROW_PENDING',
            escrowBuyerId: buyerId,
            escrowBuyerName: buyerName,
            escrowCode
          };
        }
        return i;
      })
    );

    if (canWriteToFirestore && firebaseUser) {
      void (async () => {
        try {
          const itemRef = doc(db, 'marketplace_items', itemId);
          const snap = await getDoc(itemRef);
          if (snap.exists() && snap.data().status === 'AVAILABLE') {
            await updateDoc(itemRef, {
              status: 'ESCROW_PENDING',
              isEscrowHeld: true,
              escrowBuyerId: firebaseUser.uid,
              escrowBuyerName: buyerName,
              escrowCode
            });
          }
        } catch (err) {
          if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
            handleFirestoreError(err, OperationType.UPDATE, `marketplace_items/${itemId}`);
          }
        }
      })();
    }

    showToast(
      `Escrow Locked! Deposit held securely in GearShield. Share PIN ${escrowCode} only upon campus inspection.`
    );
    return true;
  };

  const completeEscrowPickup = (itemId: string): boolean => {
    setMarketplaceItems((prev) =>
      prev.map((i) => {
        if (i.itemId === itemId) {
          return {
            ...i,
            status: 'SOLD',
            isEscrowHeld: false
          };
        }
        return i;
      })
    );

    if (canWriteToFirestore && firebaseUser) {
      void (async () => {
        try {
          const itemRef = doc(db, 'marketplace_items', itemId);
          const snap = await getDoc(itemRef);
          if (
            snap.exists() &&
            snap.data().status === 'ESCROW_PENDING' &&
            (snap.data().escrowBuyerId === firebaseUser.uid ||
              snap.data().sellerId === firebaseUser.uid)
          ) {
            await updateDoc(itemRef, {
              status: 'SOLD',
              isEscrowHeld: false
            });
          }
        } catch (err) {
          if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
            handleFirestoreError(err, OperationType.UPDATE, `marketplace_items/${itemId}`);
          }
        }
      })();
    }

    showToast('Handover confirmed! GearShield escrow funds released to seller.');
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {}
    return true;
  };

  const cancelEscrowHold = (itemId: string): boolean => {
    setMarketplaceItems((prev) =>
      prev.map((i) => {
        if (i.itemId === itemId) {
          return {
            ...i,
            status: 'AVAILABLE',
            isEscrowHeld: false,
            escrowBuyerId: undefined,
            escrowBuyerName: undefined,
            escrowCode: undefined
          };
        }
        return i;
      })
    );

    if (canWriteToFirestore && firebaseUser) {
      void (async () => {
        try {
          const itemRef = doc(db, 'marketplace_items', itemId);
          const snap = await getDoc(itemRef);
          if (
            snap.exists() &&
            snap.data().status === 'ESCROW_PENDING' &&
            (snap.data().escrowBuyerId === firebaseUser.uid ||
              snap.data().sellerId === firebaseUser.uid)
          ) {
            await updateDoc(itemRef, {
              status: 'AVAILABLE',
              isEscrowHeld: false,
              escrowBuyerId: null,
              escrowBuyerName: null,
              escrowCode: null
            });
          }
        } catch (err) {
          if (err instanceof Error && err.message.includes('Missing or insufficient permissions')) {
            handleFirestoreError(err, OperationType.UPDATE, `marketplace_items/${itemId}`);
          }
        }
      })();
    }

    showToast('Escrow cancelled. Refund processed to student wallet / UPI.');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        hubs,
        selectedHub,
        setSelectedHub,
        vehicles,
        marketplaceItems,
        rentals,
        activeRide,
        activeRideElapsedSeconds,
        activeVehicle,
        startRide,
        endRide,
        unlockVehicleByQr,
        createMarketplaceItem,
        lockEscrowForItem,
        completeEscrowPickup,
        cancelEscrowHold,
        toastMessage,
        showToast,
        clearToast,
        openQrScannerModal,
        setOpenQrScannerModal,
        openPostItemModal,
        setOpenPostItemModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
export default AppContext;
