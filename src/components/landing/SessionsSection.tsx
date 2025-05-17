
import { Calendar, Clock } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";

const sessions = [
  { id: 1, time: "9 AM–10 AM", period: "Morning" },
  { id: 2, time: "10 AM–11 AM", period: "Morning" },
  { id: 3, time: "4 PM–5 PM", period: "Evening" },
  { id: 4, time: "5 PM–6 PM", period: "Evening" },
];

const SessionsSection = () => {
  return (
    <section id="sessions" className="section relative overflow-hidden bg-gradient-to-b from-purple-50 to-white py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-100 rounded-full opacity-30 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Flexible Workout Sessions for Every Woman" 
          subtitle="Choose the time slot that works best for your schedule and start your fitness journey today."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sessions.map((session, index) => (
            <div 
              key={session.id}
              className={cn(
                "bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-on-scroll",
                session.period === "Morning" 
                  ? "hover:border-amber-400 border-2 border-transparent" 
                  : "hover:border-indigo-400 border-2 border-transparent"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                "p-4",
                session.period === "Morning" 
                  ? "bg-gradient-to-r from-amber-50 to-amber-100" 
                  : "bg-gradient-to-r from-indigo-50 to-indigo-100"
              )}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{session.period}</span>
                  {session.period === "Morning" ? (
                    <Calendar className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Calendar className="h-5 w-5 text-indigo-500" />
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className={cn(
                    "h-5 w-5 mr-2",
                    session.period === "Morning" ? "text-amber-500" : "text-indigo-500"
                  )} />
                  <h3 className="font-semibold text-xl">{session.time}</h3>
                </div>
                
                <p className="text-gray-600">
                  Perfect {session.period.toLowerCase()} session designed to energize your day.
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-lg font-medium animate-on-scroll">
            Pick Any Slot Based on Your Flexibility
          </p>
        </div>
      </div>
    </section>
  );
};

export default SessionsSection;
