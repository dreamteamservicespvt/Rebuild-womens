import { useState, useEffect } from "react";
import { Users, Calendar, Tag, DollarSign } from "lucide-react";
import { useFirebase } from "@/contexts/FirebaseContext";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgClass?: string;
}

const StatCard = ({ title, value, icon, trend, bgClass = "bg-gym-gray-dark" }: StatCardProps) => {
  return (
    <div className={`rounded-xl border border-gym-gray-light ${bgClass} p-5 h-full`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white/70 text-xs sm:text-sm font-medium mb-1">{title}</h3>
          <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
          
          {trend && (
            <div className={`text-xs mt-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'} flex items-center`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-0.5">{trend.value}% from last month</span>
            </div>
          )}
        </div>
        <div className="bg-gym-yellow/10 p-2 sm:p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatsCards = () => {
  const { getBookings, getCoupons, getServices } = useFirebase();
  const [stats, setStats] = useState({
    bookings: 0,
    revenue: 0,
    memberships: 0,
    coupons: 0
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all necessary data in parallel
        const [bookings, services, coupons] = await Promise.all([
          getBookings(),
          getServices(),
          getCoupons()
        ]);
        
        // Calculate stats
        const totalBookings = bookings.length;
        
        // Calculate revenue from completed bookings
        const completedBookings = bookings.filter(b => b.paymentStatus === "completed");
        const revenue = completedBookings.reduce((total, booking) => total + Number(booking.price || 0), 0);
        
        setStats({
          bookings: totalBookings,
          revenue: revenue,
          memberships: services.length,
          coupons: coupons.filter(c => c.status === 'active').length
        });
        
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    
    fetchStats();
  }, [getBookings, getServices, getCoupons]);

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Bookings"
        value={stats.bookings}
        icon={<Calendar size={20} className="text-gym-yellow" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Revenue"
        value={`₹${stats.revenue.toLocaleString()}`}
        icon={<DollarSign size={20} className="text-gym-yellow" />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title="Services"
        value={stats.memberships}
        icon={<Users size={20} className="text-gym-yellow" />}
      />
      <StatCard
        title="Active Coupons"
        value={stats.coupons}
        icon={<Tag size={20} className="text-gym-yellow" />}
      />
    </div>
  );
};

export default StatsCards;
