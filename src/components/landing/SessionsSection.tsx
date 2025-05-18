import { Calendar, Clock, Users } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";

const sessions = [
  { 
    id: 1, 
    time: "9 AM–10 AM", 
    period: "Morning",
    description: "Perfect morning session designed to energize your day with a balanced mix of cardio and strength training.",
    maxCapacity: 10
  },
  { 
    id: 2, 
    time: "10 AM–11 AM", 
    period: "Morning",
    description: "Start your day with this invigorating routine focused on core strength and flexibility.",
    maxCapacity: 10
  },
  { 
    id: 3, 
    time: "4 PM–5 PM", 
    period: "Evening",
    description: "Wind down your day with this calming yet effective workout combining yoga and light resistance training.",
    maxCapacity: 10
  },
  { 
    id: 4, 
    time: "5 PM–6 PM", 
    period: "Evening",
    description: "A high-energy evening session that helps release the day's stress with cardio and toning exercises.",
    maxCapacity: 10
  },
];

const SessionsSection = () => {
  return (
    <section id="sessions" className="section relative overflow-hidden bg-gym-black py-24">
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
              key={session.id}
              className={cn(
                "bg-gym-gray-dark rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-on-scroll",
                session.period === "Morning" 
                  ? "hover:border-gym-yellow border-2 border-transparent" 
                  : "hover:border-gym-yellow border-2 border-transparent"
              )}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                boxShadow: "0 0 10px rgba(255, 243, 24, 0.1)"
              }}
            >
              <div className={cn(
                "p-4",
                session.period === "Morning" 
                  ? "bg-gradient-to-r from-gym-yellow/10 to-gym-yellow/5" 
                  : "bg-gradient-to-r from-gym-yellow/10 to-gym-yellow/5"
              )}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{session.period}</span>
                  <Calendar className="h-5 w-5 text-gym-yellow" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2 text-gym-yellow" />
                  <h3 className="font-semibold text-xl text-white">{session.time}</h3>
                </div>
                
                <p className="text-white/80 mb-4">
                  {session.description}
                </p>
                
                <div className="flex items-center text-white/60 mt-auto">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{session.maxCapacity} max</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-lg font-medium animate-on-scroll text-white">
            Pick Any Slot Based on Your Flexibility
          </p>
        </div>
      </div>
    </section>
  );
};

export default SessionsSection;
