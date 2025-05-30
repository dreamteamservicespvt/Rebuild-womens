import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  getDoc,
  setDoc,
  writeBatch
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDorQDLPgCDWEodNUk9QRhcbfGpUL3vdaA",
  authDomain: "rebuild-fit.firebaseapp.com",
  projectId: "rebuild-fit",
  storageBucket: "rebuild-fit.firebasestorage.app",
  messagingSenderId: "784467283936",
  appId: "1:784467283936:web:b64c9b007d93b862606585",
  measurementId: "G-FQ1CBG9P3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Types
export type BookingType = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  preferredSlot: string;
  paymentStatus: 'pending' | 'completed';
  price: number;
  createdAt: Timestamp;
  screenshotUrl?: string;
};

export type PriceConfig = {
  id?: string;
  currentOffer: 'none' | '50off' | '25off';
  basePrice: number;
  discountedPrice: number;
};

// Add ServiceType definition
export type ServiceType = {
  id: string;
  title: string;
  basePrice: number;
  discountedPrice: number;
  trainer: string;
  maxCapacity: number | string;
  description: string;
  features: string[];
  timings?: string;
};

// Add TrainerType definition
export type TrainerType = {
  id: string;
  name: string;
  expertise: string;
  quote: string;
  image: string;
};

// Add CouponType definition
export type CouponType = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  applicableServices: string[];
  maxRedemptions: number;
  usageCount: number;
  status: 'active' | 'inactive';
  expiryDate?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted?: boolean;
  deletedAt?: Timestamp;
};

// Add CouponRedemptionType 
export type CouponRedemptionType = {
  id: string;
  couponId: string;
  couponCode: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  serviceId: string;
  serviceName: string;
  originalPrice: number;
  discountedPrice: number;
  timestamp: Timestamp;
};

// Add SessionType definition
export type SessionType = {
  id: string;
  title: string;
  time: string;
  duration: string;
  instructor: string;
  description: string;
  maxCapacity: number;
  currentAttendees: number;
  timeOfDay: "morning" | "evening";
  serviceId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Add BookingSubmissionType definition
export type BookingSubmissionType = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  serviceId: string;
  serviceName: string;
  couponCode?: string;
  amount: number;
  originalAmount: number;
  timestamp: string;
  trainer: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  screenshotUrl?: string;
};

export type CouponValidationResult = {
  valid: boolean;
  discountedPrice: number;
  message?: string;
};

type FirebaseContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  addBooking: (booking: Omit<BookingType, 'createdAt'>) => Promise<string>;
  getBookings: () => Promise<BookingType[]>;
  updateBooking: (id: string, data: Partial<BookingType>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  getPriceConfig: () => Promise<PriceConfig>;
  updatePriceConfig: (config: Partial<PriceConfig>) => Promise<void>;
  // Add missing function definitions
  getServices: () => Promise<ServiceType[]>;
  getTrainers: () => Promise<TrainerType[]>;
  submitBooking: (bookingData: BookingSubmissionType) => Promise<string>;
  validateCoupon: (code: string, serviceId: string) => Promise<CouponValidationResult>;
  getCouponUsage: (code: string) => Promise<number>;
  getCoupons: () => Promise<CouponType[]>;
  getCoupon: (id: string) => Promise<CouponType | null>;
  createCoupon: (coupon: Omit<CouponType, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCoupon: (id: string, data: Partial<Omit<CouponType, 'id' | 'createdAt'>>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  getCouponRedemptions: (couponId: string) => Promise<CouponRedemptionType[]>;
  getAllCouponRedemptions: () => Promise<CouponRedemptionType[]>;
  createService: (serviceData: Omit<ServiceType, 'id'>) => Promise<string>;
  updateService: (id: string, data: Partial<ServiceType>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  resetCouponRedemptions: () => Promise<void>;
  getSessions: () => Promise<SessionType[]>;
  getSession: (id: string) => Promise<SessionType | null>;
  createSession: (sessionData: Omit<SessionType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateSession: (id: string, data: Partial<Omit<SessionType, 'id' | 'createdAt'>>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  getTrainer: (id: string) => Promise<TrainerType | null>;
  createTrainer: (trainerData: Omit<TrainerType, 'id'>) => Promise<string>;
  updateTrainer: (id: string, data: Partial<TrainerType>) => Promise<void>;
  deleteTrainer: (id: string) => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const addBooking = async (booking: Omit<BookingType, 'createdAt'>) => {
    try {
      const bookingWithTimestamp = {
        ...booking,
        createdAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, "bookings"), bookingWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error("Error adding booking:", error);
      throw error;
    }
  };

  const getBookings = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "bookings"), orderBy("createdAt", "desc"))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as BookingType);
    } catch (error) {
      console.error("Error getting bookings:", error);
      throw error;
    }
  };

  const updateBooking = async (id: string, data: Partial<BookingType>) => {
    try {
      await updateDoc(doc(db, "bookings", id), data);
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, "bookings", id));
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  };

  const getPriceConfig = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "priceConfig"));
      
      // If no price config exists, create a default one
      if (querySnapshot.empty) {
        const defaultConfig = {
          currentOffer: 'none' as const,
          basePrice: 4000,
          discountedPrice: 4000,
        };
        
        const docRef = await addDoc(collection(db, "priceConfig"), defaultConfig);
        return { ...defaultConfig, id: docRef.id };
      }
      
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      } as PriceConfig;
    } catch (error) {
      console.error("Error getting price config:", error);
      throw error;
    }
  };

  const updatePriceConfig = async (config: Partial<PriceConfig>) => {
    try {
      const currentConfig = await getPriceConfig();
      
      // Calculate the discounted price based on the offer
      let discountedPrice = currentConfig.basePrice;
      if (config.currentOffer === '50off') {
        discountedPrice = currentConfig.basePrice * 0.5;
      } else if (config.currentOffer === '25off') {
        discountedPrice = currentConfig.basePrice * 0.75;
      }
      
      await updateDoc(doc(db, "priceConfig", currentConfig.id!), {
        ...config,
        discountedPrice
      });
    } catch (error) {
      console.error("Error updating price config:", error);
      throw error;
    }
  };

  // Services related methods
  const getServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as ServiceType);
    } catch (error) {
      console.error("Error getting services:", error);
      return [];
    }
  };

  // Trainers related methods
  const getTrainers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "trainers"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as TrainerType);
    } catch (error) {
      console.error("Error getting trainers:", error);
      return [];
    }
  };

  // Implement the getCoupons method
  const getCoupons = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "coupons"), orderBy("createdAt", "desc"))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as CouponType);
    } catch (error) {
      console.error("Error getting coupons:", error);
      throw error;
    }
  };

  // Implement getCouponUsage method
  const getCouponUsage = async (code: string) => {
    try {
      const couponRef = doc(db, "coupons", code);
      const couponSnap = await getDoc(couponRef);
      
      if (!couponSnap.exists()) {
        return 0; // Coupon doesn't exist, so usage is 0
      }
      
      const couponData = couponSnap.data() as CouponType;
      return couponData.usageCount || 0;
    } catch (error) {
      console.error("Error getting coupon usage:", error);
      return 0;
    }
  };

  // Implement getCoupon method
  const getCoupon = async (id: string) => {
    try {
      const docRef = doc(db, "coupons", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CouponType;
      }
      return null;
    } catch (error) {
      console.error("Error getting coupon:", error);
      throw error;
    }
  };

  // Implement createCoupon method
  const createCoupon = async (coupon: Omit<CouponType, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Use the code as the document ID for easier lookups
      const docRef = doc(db, "coupons", coupon.code);
      
      // Check if coupon code already exists
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        throw new Error("Coupon code already exists");
      }
      
      const timestamp = Timestamp.now();
      await setDoc(docRef, {
        ...coupon,
        usageCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      
      return coupon.code;
    } catch (error) {
      console.error("Error creating coupon:", error);
      throw error;
    }
  };

  // Implement updateCoupon method
  const updateCoupon = async (id: string, data: Partial<Omit<CouponType, 'id' | 'createdAt'>>) => {
    try {
      await updateDoc(doc(db, "coupons", id), {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating coupon:", error);
      throw error;
    }
  };

  // Implement deleteCoupon method
  const deleteCoupon = async (id: string) => {
    try {
      // First check if coupon exists to avoid errors
      const couponRef = doc(db, "coupons", id);
      const couponSnap = await getDoc(couponRef);
      
      if (!couponSnap.exists()) {
        throw new Error(`Coupon with ID ${id} does not exist`);
      }
      
      // Delete the coupon document
      await deleteDoc(couponRef);
    } catch (error) {
      throw error;
    }
  };

  // Implement getCouponRedemptions method
  const getCouponRedemptions = async (couponId: string) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "couponRedemptions"), where("couponId", "==", couponId), orderBy("timestamp", "desc"))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as CouponRedemptionType);
    } catch (error) {
      console.error("Error getting coupon redemptions:", error);
      throw error;
    }
  };

  // Implement getAllCouponRedemptions method
  const getAllCouponRedemptions = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "couponRedemptions"), orderBy("timestamp", "desc"))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as CouponRedemptionType);
    } catch (error) {
      console.error("Error getting all coupon redemptions:", error);
      throw error;
    }
  };

  // Implement validateCoupon method
  const validateCoupon = async (code: string, serviceId: string) => {
    try {
      // Normalize coupon code to uppercase for consistency
      const normalizedCode = code.toUpperCase();
      
      // First check if total redemptions across all services is below 30
      const allRedemptionsSnapshot = await getDocs(collection(db, "couponRedemptions"));
      const totalRedemptions = allRedemptionsSnapshot.size;
      
      if (totalRedemptions >= 30) {
        return { 
          valid: false, 
          discountedPrice: 0, 
          message: "Coupon limit reached: Only available for the first 30 members across all services." 
        };
      }
      
      // Continue with regular coupon validation
      const couponRef = doc(db, "coupons", normalizedCode);
      const couponSnap = await getDoc(couponRef);
      
      if (!couponSnap.exists()) {
        return { valid: false, discountedPrice: 0, message: "Invalid coupon code" };
      }
      
      const couponData = couponSnap.data() as CouponType;
      
      // Check if the coupon is active
      if (couponData.status !== 'active') {
        return { valid: false, discountedPrice: 0, message: "This coupon is currently inactive" };
      }
      
      // Check if coupon is expired
      if (couponData.expiryDate && new Date(couponData.expiryDate.toDate()) < new Date()) {
        return { valid: false, discountedPrice: 0, message: "Coupon has expired" };
      }
      
      // Check if maximum usage has been reached
      if (couponData.maxRedemptions && couponData.usageCount >= couponData.maxRedemptions) {
        return { valid: false, discountedPrice: 0, message: "Coupon usage limit reached" };
      }
      
      // Check if the coupon applies to the selected service
      if (couponData.applicableServices && 
          couponData.applicableServices.length > 0 && 
          !couponData.applicableServices.includes(serviceId)) {
        return { valid: false, discountedPrice: 0, message: "Coupon not applicable to selected service" };
      }
      
      // Get the service from Firebase to get the actual base price
      let servicePrice;
      let finalPrice;
      
      try {
        const serviceRef = doc(db, "services", serviceId);
        const serviceSnap = await getDoc(serviceRef);
        
        if (serviceSnap.exists()) {
          const serviceData = serviceSnap.data() as ServiceType;
          servicePrice = serviceData.basePrice;
          
          // Calculate discounted price based on coupon type
          if (couponData.discountType === 'percentage') {
            finalPrice = servicePrice - (servicePrice * (couponData.discountValue / 100));
          } else {
            finalPrice = servicePrice - couponData.discountValue;
            if (finalPrice < 0) finalPrice = 0;
          }
        } else {
          // Fallback to hardcoded prices
          switch(serviceId) {
            case "weight-loss":
              servicePrice = 4000;
              finalPrice = 3000;
              break;
            case "strength":
              servicePrice = 1800;
              finalPrice = 1500;
              break;
            case "zumba":
              servicePrice = 2000;
              finalPrice = 1500;
              break;
            default:
              return { valid: false, discountedPrice: 0, message: "Invalid service selected" };
          }
        }
      } catch (error) {
        return { valid: false, discountedPrice: 0, message: "Failed to validate coupon" };
      }
      
      return { 
        valid: true, 
        discountedPrice: finalPrice,
        message: `Coupon ${code} applied successfully!`
      };
    } catch (error) {
      console.error("Error validating coupon:", error);
      return { valid: false, discountedPrice: 0, message: "Failed to validate coupon" };
    }
  };

  // Implement submitBooking method
  const submitBooking = async (bookingData: BookingSubmissionType) => {
    try {
      const bookingWithTimestamp = {
        ...bookingData,
        createdAt: Timestamp.now(),
        status: bookingData.status || 'pending',
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, "bookingRequests"), bookingWithTimestamp);
      
      // If coupon was applied, increment its usage count and record redemption
      if (bookingData.couponCode) {
        const couponRef = doc(db, "coupons", bookingData.couponCode);
        const couponSnap = await getDoc(couponRef);
        
        if (couponSnap.exists()) {
          const couponData = couponSnap.data() as CouponType;
          
          // Increment usage count
          await updateDoc(couponRef, {
            usageCount: (couponData.usageCount || 0) + 1,
            updatedAt: Timestamp.now()
          });
          
          // Record redemption details
          await addDoc(collection(db, "couponRedemptions"), {
            couponId: bookingData.couponCode,
            couponCode: bookingData.couponCode,
            userName: bookingData.name,
            userPhone: bookingData.phone,
            userEmail: bookingData.email || '',
            serviceId: bookingData.serviceId,
            serviceName: bookingData.serviceName,
            originalPrice: bookingData.originalAmount,
            discountedPrice: bookingData.amount,
            timestamp: Timestamp.now()
          });
        }
      }
      
      return docRef.id;
    } catch (error) {
      console.error("Error submitting booking:", error);
      throw error;
    }
  };

  // Services CRUD operations
  const createService = async (serviceData: Omit<ServiceType, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, "services"), serviceData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  };

  const updateService = async (id: string, data: Partial<ServiceType>) => {
    try {
      await updateDoc(doc(db, "services", id), data);
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, "services", id));
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  };

  // Implement resetCouponRedemptions method
  const resetCouponRedemptions = async () => {
    try {
      // Get all coupons to reset their usage counts
      const couponsSnapshot = await getDocs(collection(db, "coupons"));
      
      // Get all redemption records to delete them
      const redemptionsSnapshot = await getDocs(collection(db, "couponRedemptions"));
      
      // Start a batch operation for better atomicity
      const batch = writeBatch(db);
      
      // Reset usage count for all coupons
      couponsSnapshot.docs.forEach(couponDoc => {
        const couponRef = doc(db, "coupons", couponDoc.id);
        batch.update(couponRef, { 
          usageCount: 0,
          updatedAt: Timestamp.now()
        });
      });
      
      // Delete all redemption records
      redemptionsSnapshot.docs.forEach(redemptionDoc => {
        const redemptionRef = doc(db, "couponRedemptions", redemptionDoc.id);
        batch.delete(redemptionRef);
      });
      
      // Commit the batch operation
      await batch.commit();
      
      // Create a record of this reset action
      await addDoc(collection(db, "redemptionResets"), {
        timestamp: Timestamp.now(),
        performedBy: user?.email || "admin",
        couponsReset: couponsSnapshot.size,
        redemptionsDeleted: redemptionsSnapshot.size,
        note: "Complete reset of all coupon redemptions and records"
      });
      
      return;
    } catch (error) {
      console.error("Error resetting coupon redemptions:", error);
      throw error;
    }
  };

  // Implement Session CRUD operations
  const getSessions = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "sessions"), orderBy("timeOfDay", "asc"), orderBy("time", "asc"))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SessionType[];
    } catch (error) {
      console.error("Error getting sessions:", error);
      throw error;
    }
  };

  const getSession = async (id: string) => {
    try {
      const docRef = doc(db, "sessions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as SessionType;
      }
      return null;
    } catch (error) {
      console.error("Error getting session:", error);
      throw error;
    }
  };

  const createSession = async (sessionData: Omit<SessionType, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const timestamp = Timestamp.now();
      const docRef = await addDoc(collection(db, "sessions"), {
        ...sessionData,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  const updateSession = async (id: string, data: Partial<Omit<SessionType, 'id' | 'createdAt'>>) => {
    try {
      await updateDoc(doc(db, "sessions", id), {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await deleteDoc(doc(db, "sessions", id));
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  };

  // Implement Trainer CRUD operations
  const getTrainer = async (id: string) => {
    try {
      const docRef = doc(db, "trainers", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as TrainerType;
      }
      return null;
    } catch (error) {
      console.error("Error getting trainer:", error);
      throw error;
    }
  };

  const createTrainer = async (trainerData: Omit<TrainerType, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, "trainers"), trainerData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating trainer:", error);
      throw error;
    }
  };

  const updateTrainer = async (id: string, data: Partial<TrainerType>) => {
    try {
      await updateDoc(doc(db, "trainers", id), data);
    } catch (error) {
      console.error("Error updating trainer:", error);
      throw error;
    }
  };

  const deleteTrainer = async (id: string) => {
    try {
      await deleteDoc(doc(db, "trainers", id));
    } catch (error) {
      console.error("Error deleting trainer:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    addBooking,
    getBookings,
    updateBooking,
    deleteBooking,
    getPriceConfig,
    updatePriceConfig,
    getServices,
    getTrainers,
    submitBooking,
    validateCoupon,
    getCouponUsage,
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponRedemptions,
    getAllCouponRedemptions,
    createService,
    updateService,
    deleteService,
    resetCouponRedemptions,
    getSessions,
    getSession,
    createSession,
    updateSession,
    deleteSession,
    getTrainer,
    createTrainer,
    updateTrainer,
    deleteTrainer
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
