import { useState, useEffect } from "react";
import { useFirebase, TrainerType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, UploadCloud } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TrainerManager = () => {
  const { getTrainers, getTrainer, createTrainer, updateTrainer, deleteTrainer } = useFirebase();
  const { toast } = useToast();
  
  const [trainers, setTrainers] = useState<TrainerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTrainer, setCurrentTrainer] = useState<TrainerType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    quote: "",
    image: ""
  });
  
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const data = await getTrainers();
      setTrainers(data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load trainers. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setCurrentTrainer(null);
    setFormData({
      name: "",
      expertise: "",
      quote: "",
      image: ""
    });
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = async (trainerId: string) => {
    try {
      const trainer = await getTrainer(trainerId);
      if (trainer) {
        setCurrentTrainer(trainer);
        setFormData({
          name: trainer.name,
          expertise: trainer.expertise,
          quote: trainer.quote,
          image: trainer.image
        });
        setIsEditing(true);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Error getting trainer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load trainer data. Please try again.",
      });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image to upload.",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "rebuild womens");
      
      // Upload to Cloudinary
      const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dvmrhs2ek/upload", {
        method: "POST",
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }
      
      const uploadData = await uploadResponse.json();
      
      if (uploadData.secure_url) {
        setFormData(prev => ({
          ...prev,
          image: uploadData.secure_url
        }));
        
        toast({
          title: "Image uploaded",
          description: "Trainer image has been uploaded successfully.",
        });
      } else {
        throw new Error("Failed to get upload URL");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.expertise) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields.",
      });
      return;
    }
    
    try {
      if (isEditing && currentTrainer) {
        await updateTrainer(currentTrainer.id, formData);
        toast({
          title: "Success",
          description: "Trainer updated successfully.",
        });
      } else {
        await createTrainer(formData);
        toast({
          title: "Success",
          description: "Trainer created successfully.",
        });
      }
      
      // Refresh data and close dialog
      fetchTrainers();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving trainer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save trainer. Please try again.",
      });
    }
  };

  const handleDelete = async (trainerId: string) => {
    if (window.confirm("Are you sure you want to delete this trainer? This action cannot be undone.")) {
      try {
        await deleteTrainer(trainerId);
        toast({
          title: "Success",
          description: "Trainer deleted successfully.",
        });
        fetchTrainers();
      } catch (error) {
        console.error("Error deleting trainer:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete trainer. Please try again.",
        });
      }
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Trainer Management</h2>
          <p className="text-white/70">Manage your fitness trainer profiles</p>
        </div>
        <Button 
          onClick={handleOpenCreateDialog}
          className="bg-gym-yellow text-gym-black hover:bg-gym-yellow/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Trainer
        </Button>
      </div>

      {/* Trainer Grid */}
      {trainers.length === 0 ? (
        <div className="text-center py-20 bg-gym-gray-dark rounded-lg border border-gym-gray-light">
          <Pencil className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Trainers Yet</h3>
          <p className="text-white/60 max-w-md mx-auto mb-8">
            Add your first trainer to showcase your fitness experts on the website.
          </p>
          <Button 
            onClick={handleOpenCreateDialog}
            className="bg-gym-yellow text-gym-black hover:bg-gym-yellow/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Trainer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trainers.map(trainer => (
            <Card key={trainer.id} className="bg-gym-gray-dark border-gym-gray-light overflow-hidden">
              <div className="aspect-[4/3] relative overflow-hidden bg-gym-gray">
                {trainer.image ? (
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    loading="lazy"
                    width="300"
                    height="225"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gym-gray">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-gym-yellow text-gym-black text-3xl">
                        {getInitials(trainer.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gym-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium text-lg">{trainer.name}</h3>
                  <p className="text-gym-yellow text-sm">{trainer.expertise}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-white/80 text-sm italic">
                  "{trainer.quote || "No quote provided"}"
                </p>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gym-gray-light flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleOpenEditDialog(trainer.id)}
                  className="text-white/70 hover:text-white hover:bg-gym-gray"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(trainer.id)}
                  className="text-red-400 hover:text-red-400 hover:bg-red-950/30"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gym-gray-dark border-gym-gray-light text-white sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Trainer" : "Add New Trainer"}</DialogTitle>
            <DialogDescription className="text-white/60">
              {isEditing ? "Update the trainer details below." : "Complete the form to add a new trainer to your team."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Revathi S."
                className="bg-gym-gray border-gym-gray-light text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expertise" className="text-white">Expertise/Specialization*</Label>
              <Input
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleFormChange}
                placeholder="e.g., Weight Loss Specialist"
                className="bg-gym-gray border-gym-gray-light text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quote" className="text-white">Quote or Bio</Label>
              <Textarea
                id="quote"
                name="quote"
                value={formData.quote}
                onChange={handleFormChange}
                placeholder="Share a motivational quote or brief bio..."
                className="bg-gym-gray border-gym-gray-light text-white min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Trainer Image</Label>
              
              {formData.image && (
                <div className="mb-4">
                  <img 
                    src={formData.image} 
                    alt="Trainer" 
                    className="max-h-40 object-cover rounded-md mx-auto border border-gym-gray-light"
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  />
                  <div className="flex items-center w-full overflow-hidden rounded-md border border-gym-yellow/40 bg-gym-gray-dark hover:bg-gym-gray hover:border-gym-yellow group-hover:shadow-[0_0_8px_rgba(255,243,24,0.2)] transition-all duration-300">
                    <div className="bg-gym-yellow/20 text-gym-yellow py-2.5 px-4">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="px-4 py-2 text-white/90 truncate">
                      {imageFile ? imageFile.name : "Choose image file..."}
                    </div>
                  </div>
                </div>
                
                {imageFile && (
                  <Button
                    onClick={handleUploadImage}
                    className="bg-gym-yellow/20 text-gym-yellow border border-gym-yellow/40 hover:bg-gym-yellow/30"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                )}
              </div>
              
              <p className="text-white/50 text-xs mt-2">
                Recommended: Square image (1:1 ratio) for best results. JPG, PNG formats supported.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-gym-yellow text-gym-black hover:bg-gym-yellow/90"
              disabled={uploading}
            >
              {isEditing ? "Save Changes" : "Add Trainer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerManager;
