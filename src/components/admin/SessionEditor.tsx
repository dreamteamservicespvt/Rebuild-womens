import { useState } from "react";
import { useFirebase, SessionType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timestamp } from "firebase/firestore";

interface SessionEditorProps {
  session: SessionType | null;
  isNew?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SessionEditor = ({ session, isNew = false, onClose, onSuccess }: SessionEditorProps) => {
  const { createSession, updateSession } = useFirebase();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(session?.title || "");
  const [time, setTime] = useState(session?.time || "");
  const [duration, setDuration] = useState(session?.duration || "");
  const [instructor, setInstructor] = useState(session?.instructor || "");
  const [description, setDescription] = useState(session?.description || "");
  const [maxCapacity, setMaxCapacity] = useState(session?.maxCapacity?.toString() || "10");
  const [currentAttendees, setCurrentAttendees] = useState(session?.currentAttendees?.toString() || "0");
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "evening">(session?.timeOfDay || "morning");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !time || !instructor) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill out all required fields."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const sessionData = {
        title,
        time,
        duration,
        instructor,
        description,
        maxCapacity: parseInt(maxCapacity),
        currentAttendees: parseInt(currentAttendees),
        timeOfDay,
      };
      
      if (isNew) {
        // Remove createdAt and updatedAt as they're handled internally by createSession
        await createSession(sessionData);
        
        toast({
          title: "Session created",
          description: "The new session has been added successfully."
        });
      } else if (session) {
        await updateSession(session.id, {
          ...sessionData,
          updatedAt: Timestamp.now()
        });
        
        toast({
          title: "Session updated",
          description: "The session has been updated successfully."
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: isNew ? "Failed to create session." : "Failed to update session."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Session Title*</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Weight Loss Program"
            className="bg-gym-gray border-gym-gray-light text-white"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="time">Time Slot*</Label>
            <Input
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="E.g., 6:00 AM–10:00 AM"
              className="bg-gym-gray border-gym-gray-light text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="timeOfDay">Time of Day*</Label>
            <Select value={timeOfDay} onValueChange={(value: "morning" | "evening") => setTimeOfDay(value)}>
              <SelectTrigger id="timeOfDay" className="bg-gym-gray border-gym-gray-light text-white">
                <SelectValue placeholder="Select time of day" />
              </SelectTrigger>
              <SelectContent className="bg-gym-gray-dark border-gym-gray-light">
                <SelectItem value="morning" className="text-white hover:bg-gym-gray-light focus:bg-gym-gray-light focus:text-white">
                  Morning
                </SelectItem>
                <SelectItem value="evening" className="text-white hover:bg-gym-gray-light focus:bg-gym-gray-light focus:text-white">
                  Evening
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="E.g., 60 minutes"
              className="bg-gym-gray border-gym-gray-light text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="maxCapacity">Max Capacity*</Label>
            <Input
              id="maxCapacity"
              type="number"
              min="1"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              className="bg-gym-gray border-gym-gray-light text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="currentAttendees">Current Attendees</Label>
            <Input
              id="currentAttendees"
              type="number"
              min="0"
              max={maxCapacity}
              value={currentAttendees}
              onChange={(e) => setCurrentAttendees(e.target.value)}
              className="bg-gym-gray border-gym-gray-light text-white"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="instructor">Instructor Name*</Label>
          <Input
            id="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            placeholder="E.g., Revathi"
            className="bg-gym-gray border-gym-gray-light text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this session..."
            className="bg-gym-gray border-gym-gray-light text-white min-h-[100px] resize-none"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-white/20 hover:bg-white/10 text-white"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (isNew ? "Creating..." : "Updating...") : (isNew ? "Create Session" : "Update Session")}
        </Button>
      </div>
    </form>
  );
};

export default SessionEditor;
