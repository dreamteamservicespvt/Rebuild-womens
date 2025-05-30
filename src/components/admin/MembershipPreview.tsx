import { ServiceType } from "@/contexts/FirebaseContext";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

interface MembershipPreviewProps {
  membership: ServiceType;
}

const MembershipPreview = ({ membership }: MembershipPreviewProps) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-xs transition-all duration-300 hover:shadow-2xl">
      <div className="bg-gym-yellow p-6 text-center">
        <h3 className="uppercase text-xs font-bold tracking-wider text-black/70">MEMBERSHIP</h3>
        <h2 className="text-xl font-bold mt-1 text-black">{membership.title}</h2>
        <p className="text-sm text-black/80 mt-1">Trainer: {membership.trainer}</p>
      </div>
      
      <div className="p-6 text-center">
        <div className="flex items-end justify-center">
          <span className="text-3xl font-bold text-gym-yellow">₹{membership.basePrice}</span>
          {membership.basePrice !== membership.discountedPrice && (
            <div className="text-sm text-gray-500 ml-2 mb-1 line-through">₹{membership.basePrice}</div>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-6">/month</p>
        
        <div className="space-y-3 text-left mb-6">
          {membership.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gym-yellow/20 flex items-center justify-center mr-2 mt-0.5">
                <CheckIcon className="h-3 w-3 text-gym-yellow" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button className="w-full bg-gym-yellow text-black hover:bg-gym-yellow/90 shadow-md">
          Join Now
        </Button>
      </div>
    </div>
  );
};

export default MembershipPreview;
