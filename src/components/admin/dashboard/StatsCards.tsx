import { Users, Calendar, Tag, DollarSign } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Members"
        value="157"
        icon={<Users size={20} className="text-gym-yellow" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Active Bookings"
        value="28"
        icon={<Calendar size={20} className="text-gym-yellow" />}
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        title="Active Coupons"
        value="3"
        icon={<Tag size={20} className="text-gym-yellow" />}
      />
      <StatCard
        title="Revenue (This Month)"
        value="₹52,400"
        icon={<DollarSign size={20} className="text-gym-yellow" />}
        trend={{ value: 8, isPositive: true }}
      />
    </div>
  );
};

export default StatsCards;
