"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MembershipManager from "@/components/admin/MembershipManager";
import IntegratedPricingManager from "@/components/admin/IntegratedPricingManager";
import { useState } from "react";
import { Tag, DollarSign } from "lucide-react";

export default function PricingAdminPage() {
  const [activeTab, setActiveTab] = useState("membership");
  
  return (
    <main className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Pricing & Membership Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gym-gray-dark border-gym-gray-light">
          <TabsTrigger 
            value="membership" 
            className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Membership Plans
          </TabsTrigger>
          <TabsTrigger 
            value="coupons" 
            className="data-[state=active]:bg-gym-yellow data-[state=active]:text-black text-white"
          >
            <Tag className="mr-2 h-4 w-4" />
            Coupons & Discounts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="membership" className="space-y-6 mt-6">
          <MembershipManager />
        </TabsContent>
        
        <TabsContent value="coupons" className="space-y-6 mt-6">
          <IntegratedPricingManager />
        </TabsContent>
      </Tabs>
    </main>
  );
}
