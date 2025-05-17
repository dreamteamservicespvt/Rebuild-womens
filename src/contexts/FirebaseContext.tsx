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
  Timestamp
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
    updatePriceConfig
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
