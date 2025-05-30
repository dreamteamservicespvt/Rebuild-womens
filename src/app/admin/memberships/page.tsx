"use client";

import { useState, useEffect } from "react";
import { useFirebase, ServiceType } from "@/contexts/FirebaseContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Edit, Trash, UserPlus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import MembershipEditor from "@/components/admin/MembershipEditor";

export default function MembershipsPage() {
  const { getServices, updateService, createService, deleteService } = useFirebase();
  const { toast } = useToast();
  
  const [services, setServices] = useState<ServiceType[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesData = await getServices();
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load membership data."
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const filtered = services.filter(service => 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.trainer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchQuery, services]);
  
  const handleCreateMembership = () => {
    setEditingService(null);
    setIsCreating(true);
    setIsEditorOpen(true);
  };
  
  const handleEditMembership = (service: ServiceType) => {
    setEditingService(service);
    setIsCreating(false);
    setIsEditorOpen(true);
  };
  
  const handleSaveMembership = async (serviceData: Partial<ServiceType>) => {
    try {
      if (isCreating) {
        await createService(serviceData as Omit<ServiceType, 'id'>);
        toast({
          title: "Membership created",
          description: "The new membership plan has been added."
        });
      } else if (editingService) {
        await updateService(editingService.id, serviceData);
        toast({
          title: "Membership updated",
          description: "The membership plan has been updated."
        });
      }
      
      setIsEditorOpen(false);
      fetchServices();
    } catch (error) {
      console.error("Error saving membership:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save membership plan."
      });
    }
  };
  
  const handleDeleteMembership = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await deleteService(id);
        toast({
          title: "Membership deleted",
          description: "The membership plan has been removed."
        });
        fetchServices();
      } catch (error) {
        console.error("Error deleting membership:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete membership plan."
        });
      }
    }
  };
  
  return (
    <main className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Membership Management</h1>
          <p className="text-white/70">Create and manage membership plans for your clients</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search memberships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gym-gray border-gym-gray-light text-white w-full"
            />
          </div>
          
          <Button
            onClick={handleCreateMembership}
            className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Membership
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gym-gray-dark border-gym-gray-light">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Total Membership Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gym-yellow">{services.length}</span>
            </div>
            <p className="text-white/70 text-sm mt-1">Active membership options</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gym-gray-dark border-gym-gray-light">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white truncate">
                {services.length > 0 ? services[0].title : "No memberships yet"}
              </span>
            </div>
            <p className="text-white/70 text-sm mt-1">Based on enrollments</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gym-gray-dark border-gym-gray-light">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gym-yellow">
                ₹{services.length > 0 
                  ? Math.round(services.reduce((acc, curr) => acc + curr.basePrice, 0) / services.length) 
                  : 0
                }
              </span>
            </div>
            <p className="text-white/70 text-sm mt-1">Before discounts</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Memberships Table */}
      <div className="bg-gym-gray-dark rounded-lg border border-gym-gray-light p-6">
        <h2 className="text-xl font-bold text-white mb-6">Membership Plans</h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gym-gray-light hover:bg-transparent">
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Trainer</TableHead>
                  <TableHead className="text-white/70">Base Price</TableHead>
                  <TableHead className="text-white/70">Discounted Price</TableHead>
                  <TableHead className="text-white/70">Features</TableHead>
                  <TableHead className="text-white/70 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} className="border-gym-gray-light hover:bg-gym-gray">
                    <TableCell className="font-medium text-white">{service.title}</TableCell>
                    <TableCell className="text-white">
                      {service.trainer}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gym-yellow/10 border-gym-yellow/30 text-gym-yellow">
                        ₹{service.basePrice}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-900/20 border-purple-400/30 text-purple-400">
                        ₹{service.discountedPrice}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/80">
                      {service.features.length} features
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-400 border-blue-400/30 hover:bg-blue-950/30"
                          onClick={() => handleEditMembership(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 border-red-400/30 hover:bg-red-950/30"
                          onClick={() => handleDeleteMembership(service.id, service.title)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="mx-auto h-12 w-12 text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No membership plans found</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? "No membership plans match your search criteria." 
                : "Get started by creating your first membership plan for your clients."
              }
            </p>
            {!searchQuery && (
              <Button
                onClick={handleCreateMembership}
                className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Create First Membership
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Membership Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="bg-gym-gray-dark border-gym-gray-light text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gym-yellow">
              {isCreating ? "Create New Membership" : "Edit Membership"}
            </DialogTitle>
          </DialogHeader>
          
          <MembershipEditor
            membership={editingService}
            onSave={handleSaveMembership}
            onCancel={() => setIsEditorOpen(false)}
            isNew={isCreating}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
