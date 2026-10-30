import { CampusHub, Vehicle, MarketplaceItem, Rental, UserProfile } from '../types';

export const CAMPUS_HUBS: CampusHub[] = [
  {
    id: 'hub-main-gate',
    name: 'Main Campus Gate Dock',
    tagline: 'DBS Academic Block & Admin Center',
    distanceFromDBS: '0.0 km (On Campus)',
    coordinates: { x: 50, y: 45 },
    totalDocks: 24,
    availableBikes: 7,
    availableScooters: 6,
    isChargingEquipped: true,
    popularFor: 'Lecture halls & Cafeteria transit'
  },
  {
    id: 'hub-selaqui-pg-a',
    name: 'Selaqui PG Hub A (Green Valley)',
    tagline: 'Largest off-campus student PG corridor',
    distanceFromDBS: '1.4 km (5 min EV / 10 min Cycle)',
    coordinates: { x: 22, y: 72 },
    totalDocks: 20,
    availableBikes: 5,
    availableScooters: 4,
    isChargingEquipped: true,
    popularFor: 'Morning rush to campus & evening return'
  },
  {
    id: 'hub-hostel-block-c',
    name: 'Hostel Block C Yard',
    tagline: 'In-campus residential boys & girls towers',
    distanceFromDBS: '0.3 km (On Campus)',
    coordinates: { x: 68, y: 30 },
    totalDocks: 16,
    availableBikes: 4,
    availableScooters: 3,
    isChargingEquipped: true,
    popularFor: 'Night library commute & sports complex'
  },
  {
    id: 'hub-selaqui-chowk',
    name: 'Selaqui Chowk Market Hub',
    tagline: 'Grocery, pharmacy & stationery center',
    distanceFromDBS: '2.1 km (7 min ride)',
    coordinates: { x: 80, y: 78 },
    totalDocks: 14,
    availableBikes: 3,
    availableScooters: 2,
    isChargingEquipped: false,
    popularFor: 'Weekend grocery runs & street food'
  },
  {
    id: 'hub-tech-park',
    name: 'DBS Tech Park & Incubation Dock',
    tagline: 'Engineering Labs & Coding Hub',
    distanceFromDBS: '0.5 km (On Campus)',
    coordinates: { x: 35, y: 25 },
    totalDocks: 18,
    availableBikes: 6,
    availableScooters: 5,
    isChargingEquipped: true,
    popularFor: 'Hackathons, robotics lab & innovation block'
  },
  {
    id: 'hub-sports-complex',
    name: 'Cricket Ground & Gym Hub',
    tagline: 'Recreation & Student Activity Centre',
    distanceFromDBS: '0.8 km (On Campus)',
    coordinates: { x: 75, y: 55 },
    totalDocks: 12,
    availableBikes: 4,
    availableScooters: 1,
    isChargingEquipped: false,
    popularFor: 'Evening workout & sports practice'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    vehicleId: 'GL-EV-101',
    type: 'E_SCOOTER',
    modelName: 'VoltStep Campus Pro (25 km/h)',
    currentHub: 'Main Campus Gate Dock',
    status: 'AVAILABLE',
    batteryPercent: 94,
    qrCodeKey: 'GL-EV-101',
    rangeKm: 42,
    ratePerMinute: 2.5
  },
  {
    vehicleId: 'GL-EV-102',
    type: 'E_SCOOTER',
    modelName: 'VoltStep Campus Pro (25 km/h)',
    currentHub: 'Selaqui PG Hub A (Green Valley)',
    status: 'AVAILABLE',
    batteryPercent: 88,
    qrCodeKey: 'GL-EV-102',
    rangeKm: 39,
    ratePerMinute: 2.5
  },
  {
    vehicleId: 'GL-EV-103',
    type: 'E_SCOOTER',
    modelName: 'AeroPulse Glide Eco',
    currentHub: 'Selaqui PG Hub A (Green Valley)',
    status: 'AVAILABLE',
    batteryPercent: 78,
    qrCodeKey: 'GL-EV-103',
    rangeKm: 34,
    ratePerMinute: 2.5
  },
  {
    vehicleId: 'GL-EV-104',
    type: 'E_SCOOTER',
    modelName: 'VoltStep Campus Pro (25 km/h)',
    currentHub: 'Hostel Block C Yard',
    status: 'AVAILABLE',
    batteryPercent: 96,
    qrCodeKey: 'GL-EV-104',
    rangeKm: 44,
    ratePerMinute: 2.5
  },
  {
    vehicleId: 'GL-EV-105',
    type: 'E_SCOOTER',
    modelName: 'AeroPulse Glide Eco',
    currentHub: 'DBS Tech Park & Incubation Dock',
    status: 'AVAILABLE',
    batteryPercent: 65,
    qrCodeKey: 'GL-EV-105',
    rangeKm: 28,
    ratePerMinute: 2.5
  },
  {
    vehicleId: 'GL-EV-106',
    type: 'E_SCOOTER',
    modelName: 'VoltStep Campus Pro (25 km/h)',
    currentHub: 'Selaqui Chowk Market Hub',
    status: 'MAINTENANCE',
    batteryPercent: 12,
    qrCodeKey: 'GL-EV-106',
    rangeKm: 5,
    ratePerMinute: 2.5
  },
  {
    vehicleId: 'GL-BIKE-201',
    type: 'BICYCLE',
    modelName: 'Hero Sprint Pro 7-Speed Alloy',
    currentHub: 'Main Campus Gate Dock',
    status: 'AVAILABLE',
    batteryPercent: null,
    qrCodeKey: 'GL-BIKE-201',
    ratePerMinute: 1.0,
    gearCount: 7
  },
  {
    vehicleId: 'GL-BIKE-202',
    type: 'BICYCLE',
    modelName: 'Firefox Rapide Single Speed',
    currentHub: 'Main Campus Gate Dock',
    status: 'AVAILABLE',
    batteryPercent: null,
    qrCodeKey: 'GL-BIKE-202',
    ratePerMinute: 1.0,
    gearCount: 1
  },
  {
    vehicleId: 'GL-BIKE-203',
    type: 'BICYCLE',
    modelName: 'Hero Sprint Pro 7-Speed Alloy',
    currentHub: 'Selaqui PG Hub A (Green Valley)',
    status: 'AVAILABLE',
    batteryPercent: null,
    qrCodeKey: 'GL-BIKE-203',
    ratePerMinute: 1.0,
    gearCount: 7
  },
  {
    vehicleId: 'GL-BIKE-204',
    type: 'BICYCLE',
    modelName: 'Atlas Sport Campus Cruiser',
    currentHub: 'Hostel Block C Yard',
    status: 'AVAILABLE',
    batteryPercent: null,
    qrCodeKey: 'GL-BIKE-204',
    ratePerMinute: 1.0,
    gearCount: 1
  },
  {
    vehicleId: 'GL-BIKE-205',
    type: 'BICYCLE',
    modelName: 'Hero Sprint Pro 7-Speed Alloy',
    currentHub: 'DBS Tech Park & Incubation Dock',
    status: 'AVAILABLE',
    batteryPercent: null,
    qrCodeKey: 'GL-BIKE-205',
    ratePerMinute: 1.0,
    gearCount: 7
  },
  {
    vehicleId: 'GL-BIKE-206',
    type: 'BICYCLE',
    modelName: 'Decathlon Rockrider ST30',
    currentHub: 'Selaqui Chowk Market Hub',
    status: 'AVAILABLE',
    batteryPercent: null,
    qrCodeKey: 'GL-BIKE-206',
    ratePerMinute: 1.0,
    gearCount: 6
  }
];

export const INITIAL_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    itemId: 'item-101',
    sellerId: 'user-rohit',
    sellerName: 'Rohit Sharma (B.Tech CS 4th Yr)',
    sellerEmail: 'rohit.sharma@dgu.ac.in',
    sellerIsVerified: true,
    title: 'LG 45L Hostel Mini Refrigerator with Freezer Compartment',
    category: 'APPLIANCE',
    price: 3800,
    depositEscrow: 800,
    condition: 'LIKE_NEW',
    description: 'Perfect for keeping milk, juices, and snacks cold in Selaqui heat. Bought in 3rd semester, very quietly running, energy efficient (4 star). Graduating next month so clearing room.',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80'
    ],
    isEscrowHeld: false,
    status: 'AVAILABLE',
    hubLocation: 'Selaqui PG Hub A (Green Valley)',
    createdAt: '2026-10-06T10:30:00.000Z'
  },
  {
    itemId: 'item-102',
    sellerId: 'user-priya',
    sellerName: 'Priya Verma (BBA 3rd Yr)',
    sellerEmail: 'priya.v@dgu.ac.in',
    sellerIsVerified: true,
    title: 'Solid Engineered Wood Study Desk + Ergonomic Mesh Chair Combo',
    category: 'FURNITURE',
    price: 2400,
    depositEscrow: 500,
    condition: 'GOOD',
    description: 'Heavy duty study table with book rack and drawer, paired with a Green Soul mid-back mesh chair with lumbar support. Super comfortable for long exam study nights.',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580481077195-c22845347714?auto=format&fit=crop&w=800&q=80'
    ],
    isEscrowHeld: false,
    status: 'AVAILABLE',
    hubLocation: 'Hostel Block C Yard',
    createdAt: '2026-10-07T14:15:00.000Z'
  },
  {
    itemId: 'item-103',
    sellerId: 'user-arjun',
    sellerName: 'Arjun Mehta (Mechanical 3rd Yr)',
    sellerEmail: 'arjun.m@dgu.ac.in',
    sellerIsVerified: true,
    title: 'Prestige 1600W Induction Cooktop + Prestige Stainless Steel Pan',
    category: 'APPLIANCE',
    price: 1100,
    depositEscrow: 300,
    condition: 'LIKE_NEW',
    description: 'Hostel friendly! Auto voltage regulator, preset Indian cooking modes (Maggi, Chai, Boil). In pristine working condition, comes with original box.',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    isEscrowHeld: true,
    status: 'ESCROW_PENDING',
    hubLocation: 'Main Campus Gate Dock',
    createdAt: '2026-10-05T09:00:00.000Z',
    escrowBuyerName: 'Aman Deep (1st Yr)',
    escrowCode: 'ESC-7741'
  },
  {
    itemId: 'item-104',
    sellerId: 'user-ananya',
    sellerName: 'Ananya Gupta (MCA 2nd Yr)',
    sellerEmail: 'ananya.g@dgu.ac.in',
    sellerIsVerified: true,
    title: 'Complete 3rd/4th Sem CS Engineering Textbook Bundle + Hand-written Notes',
    category: 'BOOKS_NOTES',
    price: 750,
    depositEscrow: 150,
    condition: 'GOOD',
    description: 'Includes Cormen algorithms (CLRS), Tanenbaum Computer Networks, Silberschatz OS, plus curated handwritten notes with previous 5 years DGU solved exam papers.',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    ],
    isEscrowHeld: false,
    status: 'AVAILABLE',
    hubLocation: 'DBS Tech Park & Incubation Dock',
    createdAt: '2026-10-07T18:40:00.000Z'
  },
  {
    itemId: 'item-105',
    sellerId: 'user-vikram',
    sellerName: 'Vikram Negi (MBA 2nd Yr)',
    sellerEmail: 'vikram.negi@dgu.ac.in',
    sellerIsVerified: true,
    title: 'Firefox Target 29T Mountain Cycle (21-Speed Shimano Tourney)',
    category: 'CYCLE',
    price: 4900,
    depositEscrow: 1000,
    condition: 'LIKE_NEW',
    description: 'Front suspension with disc brakes. Ideal for Dehradun hilly terrain and Selaqui road. Serviced last month at Dehradun cycle store, comes with heavy duty number lock and mudguards.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
    ],
    isEscrowHeld: false,
    status: 'AVAILABLE',
    hubLocation: 'Selaqui PG Hub A (Green Valley)',
    createdAt: '2026-10-08T08:10:00.000Z'
  },
  {
    itemId: 'item-106',
    sellerId: 'user-tanya',
    sellerName: 'Tanya Sen (Biotech 4th Yr)',
    sellerEmail: 'tanya.sen@dgu.ac.in',
    sellerIsVerified: true,
    title: 'Bajaj 2000W Room Heater (Blow-Hot) + Electric Kettle 1.5L',
    category: 'GEAR',
    price: 950,
    depositEscrow: 250,
    condition: 'GOOD',
    description: 'Essential for chilly Dehradun/Selaqui winter mornings! Dual heat setting, thermal cutoff, and quick boiling kettle for late night tea or soups.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    isEscrowHeld: false,
    status: 'AVAILABLE',
    hubLocation: 'Hostel Block C Yard',
    createdAt: '2026-10-08T11:20:00.000Z'
  }
];

export const INITIAL_RENTALS: Rental[] = [
  {
    rentalId: 'rent-9841',
    userId: 'demo-student-dgu',
    userName: 'Karan Singhania',
    vehicleId: 'GL-EV-102',
    vehicleType: 'E_SCOOTER',
    vehicleModel: 'VoltStep Campus Pro (25 km/h)',
    planType: 'TRIAL_99',
    startTime: '2026-10-08T08:45:00.000Z',
    endTime: '2026-10-08T09:02:00.000Z',
    pickupHub: 'Selaqui PG Hub A (Green Valley)',
    dropHub: 'Main Campus Gate Dock',
    paymentStatus: 'PAID',
    upiTxnRef: 'UPI/DGU/748392019/PAY',
    totalCost: 0,
    distanceKm: 2.1,
    carbonSavedKg: 0.42,
    durationMinutes: 17
  },
  {
    rentalId: 'rent-9812',
    userId: 'demo-student-dgu',
    userName: 'Karan Singhania',
    vehicleId: 'GL-BIKE-201',
    vehicleType: 'BICYCLE',
    vehicleModel: 'Hero Sprint Pro 7-Speed Alloy',
    planType: 'TRIAL_99',
    startTime: '2026-10-07T17:10:00.000Z',
    endTime: '2026-10-07T17:34:00.000Z',
    pickupHub: 'Main Campus Gate Dock',
    dropHub: 'Selaqui Chowk Market Hub',
    paymentStatus: 'PAID',
    upiTxnRef: 'UPI/DGU/839201128/PAY',
    totalCost: 0,
    distanceKm: 2.3,
    carbonSavedKg: 0.48,
    durationMinutes: 24
  }
];

export const DEFAULT_USER: UserProfile = {
  uid: 'demo-student-dgu',
  displayName: 'Karan Singhania',
  email: 'karan.singh@dgu.ac.in',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isVerifiedStudent: true,
  hostelHub: 'Selaqui PG Hub A (Green Valley)',
  activePlan: 'TRIAL_3DAY',
  planExpiryDate: '2026-10-11T23:59:59.000Z',
  walletBalance: 450,
  phone: '+91 98765 43210',
  upiId: 'karan.dgu@okaxis',
  studentId: 'DGU-2023-CS-049',
  department: 'Computer Science & Engineering (Sem 5)',
  createdAt: '2026-10-01T12:00:00.000Z'
};
