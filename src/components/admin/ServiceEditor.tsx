import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceType } from "@/contexts/FirebaseContext";
import { Trash, Plus, AlertCircle, Loader2 } from "lucide-react";

interface ServiceEditorProps {
  service: ServiceType | null;
  onSave: (data: Partial<ServiceType>) => Promise<void>;
  onDelete?: (serviceId: string) => Promise<void>;
  onCancel: () => void;
  isNew?: boolean;
}

// Create a separate interface instead of extending ServiceType
interface ServiceFormData {
  id?: string;
  title: string;
  description: string;
  trainer: string;
  basePrice: number;
  discountedPrice: number;
  features: string[];
  maxCapacity: number;
  imageUrl?: string;
  isActive?: boolean;
  category?: string;
  duration?: string;
}

const ServiceEditor: React.FC<ServiceEditorProps> = ({ service, onSave, onDelete, onCancel, isNew = false }) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    id: service?.id || '',
    title: service?.title || "",
    description: service?.description || "",
    trainer: service?.trainer || "",
    basePrice: service?.basePrice || 0,
    discountedPrice: service?.discountedPrice || 0,
    features: service?.features || [],
    maxCapacity: Number(service?.maxCapacity) || 10,
    imageUrl: '',
    isActive: true,
    category: '',
    duration: ''
  });
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSwitchChange = (checked: boolean, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title) {
      setFormError('Title is required');
      return false;
    }
    // Add other validation rules as needed
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data with all form fields
      const processedData: Partial<ServiceType> = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        trainer: formData.trainer,
        basePrice: Number(formData.basePrice),
        discountedPrice: Number(formData.discountedPrice),
        features: formData.features,
        maxCapacity: formData.maxCapacity
        // We're not sending the extended properties that don't exist in ServiceType
      };
      
      await onSave(processedData);
      setFormError(null);
    } catch (error) {
      console.error("Error saving service:", error);
      setFormError("Failed to save service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!service?.id || !onDelete) return;
    
    setIsSubmitting(true);
    try {
      await onDelete(service.id);
    } catch (error) {
      console.error("Error deleting service:", error);
      setFormError("Failed to delete service. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {formError && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{formError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Service Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Weight Loss Program"
                className="bg-gym-gray border-gym-gray-light text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange(value, "category")}
              >
                <SelectTrigger className="bg-gym-gray border-gym-gray-light text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="zumba">Zumba</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trainer" className="text-white">Trainer Name</Label>
              <Input
                id="trainer"
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
                placeholder="e.g., John Smith"
                className="bg-gym-gray border-gym-gray-light text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the service..."
                className="bg-gym-gray border-gym-gray-light text-white min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCapacity" className="text-white">Max Capacity</Label>
              <Input
                id="maxCapacity"
                name="maxCapacity"
                type="number"
                value={String(formData.maxCapacity)}
                onChange={handleNumberChange}
                placeholder="e.g., 10"
                className="bg-gym-gray border-gym-gray-light text-white"
                min="1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice" className="text-white">Regular Price (₹)</Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  value={String(formData.basePrice)}
                  onChange={handleNumberChange}
                  placeholder="e.g., 4000"
                  className="bg-gym-gray border-gym-gray-light text-white"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice" className="text-white">Discounted Price (₹)</Label>
                <Input
                  id="discountedPrice"
                  name="discountedPrice"
                  type="number"
                  value={String(formData.discountedPrice)}
                  onChange={handleNumberChange}
                  placeholder="e.g., 3000"
                  className="bg-gym-gray border-gym-gray-light text-white"
                  min="0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
                placeholder="e.g., 60 mins"
                className="bg-gym-gray border-gym-gray-light text-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="features" className="text-white">Features</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature..."
                    className="bg-gym-gray border-gym-gray-light text-white w-[200px]"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddFeature}
                    className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {formData.features.length > 0 ? (
                <ul className="space-y-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-between bg-gym-gray p-2 rounded-md">
                      <span className="text-white">{feature}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-white hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/50 text-sm">No features added yet</p>
              )}
            </div>
          
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange(checked, "isActive")}
              />
              <Label htmlFor="isActive" className="text-white">Active</Label>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <div className="order-2 sm:order-1">
              {!isNew && onDelete && (
                <>
                  {!showDeleteConfirm ? (
                    <Button 
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Service
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500 rounded-md p-2">
                      <p className="text-red-500 text-sm">Are you sure?</p>
                      <Button 
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteConfirm}
                        disabled={isSubmitting}
                      >
                        Yes, delete
                      </Button>
                      <Button 
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="space-x-2 order-1 sm:order-2">
              <Button 
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="text-white/70"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  `${isNew ? 'Create' : 'Save'} Service`
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceEditor;
