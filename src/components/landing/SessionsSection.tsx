import { useState, useEffect } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";
import { useFirebase, SessionType } from "@/contexts/FirebaseContext";
import { Timestamp } from "firebase/firestore";

// helper to sort morning sessions first, then evening, then by time
const sortSessions = (sessions: SessionType[]) =>
	[...sessions].sort((a, b) => {
		if (a.timeOfDay !== b.timeOfDay) {
			return a.timeOfDay === "morning" ? -1 : 1;
		}
		return a.time.localeCompare(b.time);
	});

// If Firebase data isn't available, fallback to these values
const fallbackSessions = [
	{
		id: "1",
		time: "6:00 AM–10:00 AM",
		title: "Weight Loss Program",
		description:
			"Morning session to kickstart your metabolism and burn calories throughout the day.",
		maxCapacity: 10,
		currentAttendees: 0,
		timeOfDay: "morning" as "morning" | "evening",
		duration: "",
		instructor: "Revathi",
		createdAt: Timestamp.now(),
		updatedAt: Timestamp.now(),
	},
	{
		id: "2",
		time: "5:30 AM–10:30 AM",
		title: "Strength Training",
		description:
			"Early morning strength building to enhance your core strength and fitness.",
		maxCapacity: 10,
		currentAttendees: 0,
		timeOfDay: "morning" as "morning" | "evening",
		duration: "",
		instructor: "Revathi",
		createdAt: Timestamp.now(),
		updatedAt: Timestamp.now(),
	},
	{
		id: "3",
		time: "4:00 PM–8:00 PM",
		title: "Weight Loss Program & Strength Training",
		description: "Evening session for those who prefer working out after their day.",
		maxCapacity: 10,
		currentAttendees: 0,
		timeOfDay: "evening" as "morning" | "evening",
		duration: "",
		instructor: "Revathi",
		createdAt: Timestamp.now(),
		updatedAt: Timestamp.now(),
	},
	{
		id: "4",
		time: "4:00 PM–8:00 PM",
		title: "Zumba",
		description: "High-energy dance fitness session to burn calories while having fun.",
		maxCapacity: 10,
		currentAttendees: 0,
		timeOfDay: "evening" as "morning" | "evening",
		duration: "",
		instructor: "Jyothi",
		createdAt: Timestamp.now(),
		updatedAt: Timestamp.now(),
	},
];

// Enhanced cache management system with improved persistence
const CACHE_KEY = "rebuild_sessions_cache_v2";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Initialize sessions from all sources (memory, localStorage, hardcoded defaults)
const initializeSessionsData = (): { sessions: SessionType[], source: string } => {
  try {
    const cached = localStorage.getItem('sessions-data');
    if (cached) {
      const parsedData = JSON.parse(cached);
      const cachedTimestamp = new Date(parsedData.timestamp);
      const currentTime = new Date();
      
      // Check if cache is still valid (less than 1 hour old)
      if (currentTime.getTime() - cachedTimestamp.getTime() < 3600000) {
        // Silent return of cached data without console log
        return { sessions: parsedData.sessions, source: "cache" };
      }
    }
  } catch (error) {
    // Replace console.warn with silent failure
    // We'll just return fallback data without logging
  }
  
  // Return fallback data without console log
  return { sessions: fallbackSessions, source: "fallback" };
};

// Helper function to cache sessions with proper error handling
const persistSessions = (sessions: SessionType[]) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: sessions,
      timestamp: Date.now()
    }));
    
    // Store in sessionStorage as well for immediate access on page navigation
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      data: sessions,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn("Failed to cache sessions:", error);
  }
};

const SessionsSection = () => {
  const { getSessions } = useFirebase();
  // Initialize state with data immediately available (no initial loading state)
  const initialData = initializeSessionsData();
  const [sessions, setSessions] = useState<SessionType[]>(initialData.sessions);
  const [isRefreshing, setIsRefreshing] = useState(initialData.source !== "firebase");
  // Add visibility tracking for large screens
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  
  // Use intersection observer to detect when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasEnteredViewport(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );
    
    const section = document.getElementById("sessions");
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    // Flag to avoid state updates if component unmounts during fetch
    let isMounted = true;
    
    // Immediately make sessions visible on all devices by using fallback data
    if (sessions.length === 0) {
      setSessions(fallbackSessions);
    }
    
    const syncWithFirebase = async () => {
      try {
        const sessionsData = await getSessions();
        
        if (!isMounted) return;
        
        if (sessionsData && sessionsData.length > 0) {
          // Process and deduplicate the data
          const uniqueSessionsMap = new Map();
          sessionsData.forEach((session) => {
            const key = `${session.timeOfDay}-${session.time}-${session.title}`;
            uniqueSessionsMap.set(key, session);
          });
          
          const uniqueSessions = Array.from(uniqueSessionsMap.values());
          
          // Always update with Firebase data when available
          if (uniqueSessions.length > 0) {
            setSessions(sortSessions(uniqueSessions));
            // Persist the synchronized data
            persistSessions(sortSessions(uniqueSessions));
          }
        }
      } catch (error) {
        // If Firebase fails, ensure we still show fallback data
        if (sessions.length === 0) {
          setSessions(fallbackSessions);
        }
      } finally {
        if (isMounted) {
          setIsRefreshing(false);
        }
      }
    };
    
    // Start background sync immediately
    syncWithFirebase();
    
    // Set up real-time refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      syncWithFirebase();
    }, 5 * 60 * 1000);
    
    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, [getSessions, sessions.length]);
  
  // Helper function to get period text based on timeOfDay
  const getPeriodText = (timeOfDay: "morning" | "evening") => {
    return timeOfDay === "morning" ? "Morning" : "Evening";
  };
  
  return (
    <section
      id="sessions"
      className="section relative overflow-hidden bg-gym-black py-24"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gym-yellow/5 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gym-yellow/5 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gym-yellow/5 rounded-full opacity-30 blur-3xl"></div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="Flexible Workout Sessions for Every Woman"
          subtitle="Choose the time slot that works best for your schedule and start your fitness journey today."
          className="text-white"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300">
          {sessions.map((session, index) => (
            <div
              key={`${session.id}-${index}`}
              className={cn(
                "bg-gym-gray-dark rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1",
                "hover:border-gym-yellow border-2 border-transparent",
                // Remove animation classes that might cause visibility issues on different devices
                hasEnteredViewport ? "opacity-100" : "opacity-100" // Always visible regardless of animation state
              )}
              style={{
                // Use simpler animation approach that works consistently across devices
                transitionDelay: `${index * 0.1}s`,
                boxShadow: "0 0 10px rgba(255, 243, 24, 0.1)",
              }}
            >
              <div className="p-4 bg-gradient-to-r from-gym-yellow/10 to-gym-yellow/5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">
                    {getPeriodText(session.timeOfDay)}
                  </span>
                  <Calendar className="h-5 w-5 text-gym-yellow" />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2 text-gym-yellow" />
                  <h3 className="font-semibold text-xl text-white">
                    {session.time}
                  </h3>
                </div>

                <h4 className="text-gym-yellow font-semibold mb-2">
                  {session.title}
                </h4>

                <p className="text-white/80 mb-4">
                  {session.description}
                </p>

                <div className="flex items-center text-white/60 mt-auto">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {session.maxCapacity} max
                  </span>
                </div>
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="col-span-4 text-center py-8 text-white/60">
              No sessions available
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <p className="text-lg font-medium text-white">
            Pick Any Slot Based on Your Flexibility
          </p>
        </div>
      </div>
    </section>
  );
};

export default SessionsSection;
