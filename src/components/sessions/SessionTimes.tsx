import { Button } from "@/components/ui/button";

// Define session type
interface Session {
  id: string;
  title: string;
  time: string;
  duration: string;
  instructor: string;
  description: string;
  maxCapacity: number;
  currentAttendees?: number;
  timeOfDay: "morning" | "evening";
}

// Sample session data (you can replace with your actual data)
const ALL_SESSIONS: Session[] = [
  {
    id: "morning-1",
    title: "Sunrise HIIT",
    time: "6:00 AM - 7:00 AM",
    duration: "60 min",
    instructor: "Priya S.",
    description: "Start your day with this high-intensity interval training session designed to boost metabolism and energy.",
    maxCapacity: 12,
    currentAttendees: 8,
    timeOfDay: "morning"
  },
  {
    id: "morning-2",
    title: "Morning Flow Yoga",
    time: "7:30 AM - 8:30 AM",
    duration: "60 min",
    instructor: "Anita R.",
    description: "Gentle yet invigorating yoga flow to improve flexibility and center your mind for the day ahead.",
    maxCapacity: 15,
    currentAttendees: 10,
    timeOfDay: "morning"
  },
  {
    id: "morning-3",
    title: "Core Strength",
    time: "9:00 AM - 10:00 AM",
    duration: "60 min",
    instructor: "Deepa K.",
    description: "Focus on building a strong foundation with exercises targeting abs, lower back, and obliques.",
    maxCapacity: 12,
    currentAttendees: 7,
    timeOfDay: "morning"
  },
  {
    id: "evening-1",
    title: "Power Hour",
    time: "5:30 PM - 6:30 PM",
    duration: "60 min",
    instructor: "Meera T.",
    description: "Full-body workout combining strength training and cardio for maximum results.",
    maxCapacity: 12,
    currentAttendees: 11,
    timeOfDay: "evening"
  },
  {
    id: "evening-2",
    title: "Circuit Training",
    time: "7:00 PM - 8:00 PM",
    duration: "60 min",
    instructor: "Priya S.",
    description: "Move through various exercise stations to work every muscle group and improve endurance.",
    maxCapacity: 15,
    currentAttendees: 9,
    timeOfDay: "evening"
  },
  {
    id: "evening-3",
    title: "Stress Relief Yoga",
    time: "8:30 PM - 9:30 PM",
    duration: "60 min",
    instructor: "Anita R.",
    description: "Wind down your day with calming yoga poses that release tension and promote relaxation.",
    maxCapacity: 12,
    currentAttendees: 6,
    timeOfDay: "evening"
  }
];

const SessionTimes = () => {
  return (
    <div id="sessions" className="section bg-white">
      <div className="container-custom">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-10">
          Workout Sessions
        </h2>
        
        {/* Session cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
          {ALL_SESSIONS.map((session) => (
            <div 
              key={session.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{session.title}</h3>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    session.timeOfDay === "morning" 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {session.duration}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{session.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>{session.instructor}</span>
                </div>
                
                <p className="text-gray-700 mb-5">{session.description}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Availability</span>
                    <span className="text-sm font-medium">
                      {session.currentAttendees}/{session.maxCapacity}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        session.timeOfDay === "morning" ? "bg-amber-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${(session.currentAttendees || 0) / session.maxCapacity * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <Button 
                  className={`w-full mt-5 text-white transition-opacity ${
                    session.timeOfDay === "morning"
                      ? "bg-gradient-to-r from-amber-500 to-rebuild-purple hover:opacity-90"
                      : "bg-gradient-to-r from-orange-500 to-rebuild-pink hover:opacity-90"
                  }`}
                >
                  Reserve Spot
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionTimes;
