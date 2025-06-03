import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
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
  writeBatch,
  limit
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

// Add interface for coupon data
export interface CouponData {
  id: string;
  code: string;
  maxRedemptions: number;
  usageCount: number;
  expiryDate: string;
  status: string;
}

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

// Add FreeSessionType definition
export type FreeSessionType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  timestamp: any; // Firestore timestamp
  status?: 'new' | 'contacted' | 'booked' | 'completed' | 'cancelled';
  notes?: string;
};

interface FirebaseContextType {
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
  getActiveCoupon: () => Promise<{
    id: string;
    code: string;
    maxRedemptions: number;
    usageCount: number;
    expiryDate: string;
    status: string;
  } | null>;
  getAllCoupons: () => Promise<CouponData[]>;
  // Free Session methods
  getFreeSessions: () => Promise<FreeSessionType[]>;
  getFreeSession: (id: string) => Promise<FreeSessionType | null>;
  createFreeSession: (data: Omit<FreeSessionType, 'id' | 'timestamp'>) => Promise<string>;
  updateFreeSession: (id: string, data: Partial<FreeSessionType>) => Promise<void>;
  deleteFreeSession: (id: string) => Promise<void>;
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
  const [totalRedemptions, setTotalRedemptions] = useState(0);

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
      // Fetch from both collections
      const [bookingsSnapshot, bookingRequestsSnapshot] = await Promise.all([
        getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "bookingRequests"), orderBy("createdAt", "desc")))
      ]);
      
      // Process traditional bookings
      const bookings = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Process booking requests (from registration form)
      const bookingRequests = bookingRequestsSnapshot.docs.map(doc => {
        const data = doc.data();
        // Normalize field names to match BookingType
        return {
          id: doc.id,
          name: data.name,
          email: data.email || '',
          phone: data.phone,
          preferredSlot: data.serviceName || data.preferredSlot || 'Not specified',
          paymentStatus: data.paymentStatus || data.status || 'completed',
          price: data.amount || data.price || 0,
          createdAt: data.createdAt || data.timestamp ? Timestamp.fromDate(new Date(data.timestamp)) : Timestamp.now(),
          screenshotUrl: data.screenshotUrl || ''
        };
      });
      
      // Combine both collections and sort by date (most recent first)
      // Fix type safety issues with better type handling
      const combinedBookings = [...bookings, ...bookingRequests].sort((a, b) => {
        // Safely handle potential missing createdAt property
        const getTimestamp = (item: any): number => {
          if (!item || typeof item !== 'object') return 0;
          const createdAt = item.createdAt;
          if (!createdAt) return 0;
          // Check if it's a Firestore Timestamp and has toDate method
          if (typeof createdAt.toDate === 'function') {
            return createdAt.toDate().getTime();
          } 
          // Handle if it's a Date object or timestamp string
          else if (createdAt instanceof Date) {
            return createdAt.getTime();
          } 
          // If it's a timestamp string/number
          else if (createdAt) {
            return new Date(createdAt).getTime();
          }
          return 0;
        };
        
        return getTimestamp(b) - getTimestamp(a);
      });
      
      // Remove console log about booking counts
      return combinedBookings as BookingType[];
    } catch (error) {
      // Remove console.error
      throw error;
    }
  };

  const updateBooking = async (id: string, data: Partial<BookingType>) => {
    try {
      // Validate data before sending to Firestore
      const validatedData = { ...data };
      
      // Make sure price is a number
      if (validatedData.price !== undefined) {
        validatedData.price = Number(validatedData.price);
      }
      
      // Clean undefined values that might cause Firestore errors
      Object.keys(validatedData).forEach(key => {
        if (validatedData[key as keyof typeof validatedData] === undefined) {
          delete validatedData[key as keyof typeof validatedData];
        }
      });
      
      // Remove the console.log that exposes booking data
      
      // First check if document exists in bookings collection
      const bookingRef = doc(db, "bookings", id);
      const bookingSnap = await getDoc(bookingRef);
      
      if (bookingSnap.exists()) {
        // Update in bookings collection
        await updateDoc(bookingRef, validatedData);
        return;
      }
      
      // If not in bookings, try bookingRequests collection
      const bookingRequestRef = doc(db, "bookingRequests", id);
      const bookingRequestSnap = await getDoc(bookingRequestRef);
      
      if (bookingRequestSnap.exists()) {
        // Update in bookingRequests collection
        await updateDoc(bookingRequestRef, validatedData);
        return;
      }
      
      // If we got here, the document wasn't found in either collection
      throw new Error(`Booking not found in any collection: ${id}`);
      
    } catch (error) {
      // Keep error tracking but don't print to console in production
      if (process.env.NODE_ENV === 'development') {
        // Only log in development environment
        console.error("Error in updateBooking:", error);
      }
      
      // Re-throw with more context for better debugging
      throw new Error(`Failed to update booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      // First check if document exists in bookings collection
      const bookingRef = doc(db, "bookings", id);
      const bookingSnap = await getDoc(bookingRef);
      
      if (bookingSnap.exists()) {
        // Delete from bookings collection
        await deleteDoc(bookingRef);
        return;
      }
      
      // If not in bookings, try bookingRequests collection
      const bookingRequestRef = doc(db, "bookingRequests", id);
      const bookingRequestSnap = await getDoc(bookingRequestRef);
      
      if (bookingRequestSnap.exists()) {
        // Delete from bookingRequests collection
        await deleteDoc(bookingRequestRef);
        return;
      }
      
      // If we get here, the document wasn't found in either collection
      throw new Error(`Booking not found in any collection: ${id}`);
      
    } catch (error) {
      // Keep error tracking but don't print to console in production
      if (process.env.NODE_ENV === 'development') {
        // Only log in development environment
        console.error("Error deleting booking:", error);
      }
      
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

  // Validate coupon function
  const validateCoupon = async (code: string, serviceId: string) => {
    try {
      // Standardize the code format
      const formattedCode = code.trim().toUpperCase();
      
      // If we've reached the global limit of 30 redemptions, no more coupons can be used
      if (totalRedemptions >= 30) {
        return { 
          valid: false, 
          message: "All coupons have been exhausted. No more redemptions available.",
          discountedPrice: 0 
        };
      }
      
      // Query the coupon by code
      const couponsRef = collection(db, "coupons");
      const q = query(couponsRef, where("code", "==", formattedCode));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { 
          valid: false, 
          message: "Invalid coupon code", 
          discountedPrice: 0 
        };
      }
      
      // Get the first matching coupon
      const couponDoc = querySnapshot.docs[0];
      const couponData = couponDoc.data() as CouponType;
      
      // Check if coupon is active
      if (couponData.status !== 'active') {
        return { 
          valid: false, 
          message: "This coupon is inactive", 
          discountedPrice: 0 
        };
      }
      
      // Check if coupon has expired
      if (couponData.expiryDate && new Date() > couponData.expiryDate.toDate()) {
        return { 
          valid: false, 
          message: "This coupon has expired", 
          discountedPrice: 0 
        };
      }
      
      // Check if coupon has reached its maximum redemptions
      if (couponData.usageCount >= couponData.maxRedemptions) {
        return { 
          valid: false, 
          message: "This coupon has reached its maximum number of uses", 
          discountedPrice: 0 
        };
      }
      
      // Check if the coupon is applicable to this service
      if (couponData.applicableServices.length > 0 && 
          !couponData.applicableServices.includes(serviceId)) {
        return { 
          valid: false, 
          message: "This coupon is not applicable for the selected service", 
          discountedPrice: 0 
        };
      }
      
      // Get service details to determine correct discounted price
      const serviceDoc = await getDoc(doc(db, "services", serviceId));
      
      if (!serviceDoc.exists()) {
        return { 
          valid: false, 
          message: "Service not found", 
          discountedPrice: 0 
        };
      }
      
      const serviceData = serviceDoc.data() as ServiceType;
      let discountedPrice = serviceData.discountedPrice || serviceData.basePrice;
      
      // Fixed discounted prices based on service type
      if (serviceId.includes("weight") || serviceData.title.toLowerCase().includes("weight loss")) {
        discountedPrice = 3000; // Weight Loss: ₹3000 (Regular ₹4000)
      } else if (serviceId.includes("strength") || serviceData.title.toLowerCase().includes("strength")) {
        discountedPrice = 1500; // Strength Training: ₹1500 (Regular ₹1800)
      } else if (serviceId.includes("zumba") || serviceData.title.toLowerCase().includes("zumba")) {
        discountedPrice = 1500; // Zumba: ₹1500 (Regular ₹2000)
      }
      
      return {
        valid: true,
        message: "Coupon applied successfully!",
        discountedPrice: discountedPrice,
        originalPrice: serviceData.basePrice,
        couponId: couponDoc.id
      };
    } catch (error) {
      console.error("Error validating coupon:", error);
      return { 
        valid: false, 
        message: "Error validating coupon. Please try again.", 
        discountedPrice: 0 
      };
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

  // Add this function in your FirebaseProvider implementation
  const getActiveCoupon = async () => {
    try {
      const couponsRef = collection(db, 'coupons');
      const q = query(
        couponsRef,
        where('status', '==', 'active'),
        orderBy('expiryDate', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const couponDoc = querySnapshot.docs[0];
        const couponData = couponDoc.data();
        
        // Format expiry date as string
        let expiryDateStr = '';
        if (couponData.expiryDate) {
          if (couponData.expiryDate instanceof Timestamp) {
            expiryDateStr = couponData.expiryDate.toDate().toISOString();
          } else {
            expiryDateStr = new Date(couponData.expiryDate).toISOString();
          }
        }
        
        return {
          id: couponDoc.id,
          code: couponData.code,
          maxRedemptions: couponData.maxRedemptions || 30,
          usageCount: couponData.usageCount || 0,
          expiryDate: expiryDateStr,
          status: couponData.status || 'active'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting active coupon:', error);
      return null;
    }
  };

  // Add this function to your Firebase provider component
  const getAllCoupons = async (): Promise<CouponData[]> => {
    try {
      const couponsRef = collection(db, 'coupons');
      const couponsSnapshot = await getDocs(couponsRef);
      
      if (couponsSnapshot.empty) {
        console.log('No coupons found');
        return [];
      }
      
      const couponsData = couponsSnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Timestamp to string format for expiryDate
        let expiryDateStr = '';
        if (data.expiryDate) {
          if (data.expiryDate instanceof Timestamp) {
            expiryDateStr = data.expiryDate.toDate().toISOString();
          } else {
            expiryDateStr = new Date(data.expiryDate).toISOString();
          }
        }

        return {
          id: doc.id,
          code: data.code,
          maxRedemptions: data.maxRedemptions || 30,
          usageCount: data.usageCount || 0,
          expiryDate: expiryDateStr,
          status: data.status || 'inactive'
        } as CouponData;
      });
      
      return couponsData;
    } catch (error) {
      console.error('Error fetching all coupons:', error);
      return [];
    }
  };

  // Add handling for totalRedemptions in the Firebase context
  const getTotalRedemptions = useCallback(async () => {
    try {
      const redemptionsSnapshot = await getDocs(collection(db, "couponRedemptions"));
      setTotalRedemptions(redemptionsSnapshot.size);
      return redemptionsSnapshot.size;
    } catch (error) {
      // Handle error silently - don't use console.error
      return 0;
    }
  }, [db]);

  // Free Session Methods
  const getFreeSessions = async (): Promise<FreeSessionType[]> => {
    try {
      const freeSessionsRef = collection(db, "free_sessions");
      const q = query(freeSessionsRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FreeSessionType[];
    } catch (error) {
      console.error("Error getting free sessions:", error);
      throw error;
    }
  };
  
  const getFreeSession = async (id: string): Promise<FreeSessionType | null> => {
    try {
      const freeSessionRef = doc(db, "free_sessions", id);
      const snapshot = await getDoc(freeSessionRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as FreeSessionType;
    } catch (error) {
      console.error("Error getting free session:", error);
      throw error;
    }
  };
  
  const createFreeSession = async (data: Omit<FreeSessionType, 'id' | 'timestamp'>): Promise<string> => {
    try {
      const freeSessionsRef = collection(db, "free_sessions");
      const newData = {
        ...data,
        timestamp: Timestamp.now(),
        status: data.status || 'new'
      };
      
      const docRef = await addDoc(freeSessionsRef, newData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating free session:", error);
      throw error;
    }
  };
  
  const updateFreeSession = async (id: string, data: Partial<FreeSessionType>): Promise<void> => {
    try {
      const freeSessionRef = doc(db, "free_sessions", id);
      await updateDoc(freeSessionRef, data);
    } catch (error) {
      console.error("Error updating free session:", error);
      throw error;
    }
  };
  
  const deleteFreeSession = async (id: string): Promise<void> => {
    try {
      const freeSessionRef = doc(db, "free_sessions", id);
      await deleteDoc(freeSessionRef);
    } catch (error) {
      console.error("Error deleting free session:", error);
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
    deleteTrainer,
    getActiveCoupon,
    getAllCoupons,
    totalRedemptions,
    getTotalRedemptions,
    
    // Free Session methods
    getFreeSessions,
    getFreeSession,
    createFreeSession,
    updateFreeSession,
    deleteFreeSession,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
