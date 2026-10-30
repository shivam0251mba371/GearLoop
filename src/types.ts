export type PlanType = 'NONE' | 'TRIAL_3DAY' | 'MONTHLY_PASS';
export type RentalPlanRate = 'TRIAL_99' | 'MONTHLY_899' | 'PAY_PER_RIDE';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  isVerifiedStudent: boolean;
  hostelHub: string;
  activePlan: PlanType;
  planExpiryDate?: string;
  walletBalance: number;
  phone?: string;
  upiId?: string;
  studentId?: string;
  department?: string;
  createdAt: string;
}

export type VehicleType = 'BICYCLE' | 'E_SCOOTER';
export type VehicleStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';

export interface Vehicle {
  vehicleId: string;
  type: VehicleType;
  modelName: string;
  currentHub: string;
  status: VehicleStatus;
  batteryPercent: number | null; // null for non-electric bicycles
  qrCodeKey: string;
  rangeKm?: number;
  ratePerMinute?: number;
  gearCount?: number;
}

export interface Rental {
  rentalId: string;
  userId: string;
  userName?: string;
  vehicleId: string;
  vehicleType?: VehicleType;
  vehicleModel?: string;
  planType: 'TRIAL_99' | 'MONTHLY_899' | 'PAY_PER_RIDE';
  startTime: string;
  endTime: string | null;
  pickupHub: string;
  dropHub: string | null;
  paymentStatus: 'PAID' | 'PENDING';
  upiTxnRef: string;
  totalCost?: number;
  distanceKm?: number;
  carbonSavedKg?: number;
  durationMinutes?: number;
}

export type ItemCategory = 'APPLIANCE' | 'FURNITURE' | 'BOOKS_NOTES' | 'CYCLE' | 'GEAR';
export type ItemCondition = 'LIKE_NEW' | 'GOOD' | 'FAIR';
export type ItemStatus = 'AVAILABLE' | 'ESCROW_PENDING' | 'SOLD';

export interface MarketplaceItem {
  itemId: string;
  sellerId: string;
  sellerName: string;
  sellerEmail?: string;
  sellerIsVerified?: boolean;
  title: string;
  category: ItemCategory;
  price: number;
  depositEscrow: number;
  condition: ItemCondition;
  description: string;
  images: string[];
  isEscrowHeld: boolean;
  status: ItemStatus;
  hubLocation: string;
  createdAt: string;
  escrowBuyerId?: string;
  escrowBuyerName?: string;
  escrowCode?: string;
}

export interface CampusHub {
  id: string;
  name: string;
  tagline: string;
  distanceFromDBS: string;
  coordinates: { x: number; y: number }; // percentage on stylized campus map
  totalDocks: number;
  availableBikes: number;
  availableScooters: number;
  isChargingEquipped: boolean;
  popularFor: string;
}
