import { useState, useEffect } from "react";
import { useFirebase, SessionType } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Edit, Trash, Clock, Sunrise, Sunset, Calendar, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionEditor from "./SessionEditor";
import { Timestamp } from "firebase/firestore";

const SessionManager = () => {
  const { getSessions, deleteSession, createSession, updateSession } = useFirebase();
  const { toast } = useToast();

  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "morning" | "evening">("all");

  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sessionNameToDelete, setSessionNameToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Saving state
  const [saving, setSaving] = useState(false);

  // Fetch sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const sessionsData = await getSessions();
      setSessions(sessionsData);
      applyFilters(sessionsData, searchQuery, filter);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sessions. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [getSessions]);

  // Apply filters to sessions
  const applyFilters = (data: SessionType[], query: string, timeFilter: string) => {
    let result = [...data];
    
    // Apply search query filter
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      result = result.filter(session => 
        session.title.toLowerCase().includes(lowercasedQuery) || 
        session.instructor.toLowerCase().includes(lowercasedQuery) ||
        session.time.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Apply time of day filter
    if (timeFilter !== "all") {
      result = result.filter(session => session.timeOfDay === timeFilter);
    }
    
    // Sort by time of day and then by time
    result.sort((a, b) => {
      if (a.timeOfDay !== b.timeOfDay) {
        return a.timeOfDay === "morning" ? -1 : 1;
      }
      return a.time.localeCompare(b.time);
    });
    
    setFilteredSessions(result);
  };

  useEffect(() => {
    applyFilters(sessions, searchQuery, filter);
  }, [searchQuery, filter, sessions]);
  
  // Handlers for session creation/editing
  const handleCreateSession = () => {
    setEditingSession(null);
    setIsCreating(true);
    setIsEditorOpen(true);
  };
  
  const handleEditSession = (session: SessionType) => {
    setEditingSession(session);
    setIsCreating(false);
    setIsEditorOpen(true);
  };
  
  const handleDeleteClick = (id: string, name: string) => {
    setSessionToDelete(id);
    setSessionNameToDelete(name);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteSession(sessionToDelete);
      
      toast({
        title: "Session deleted",
        description: "The session has been successfully removed."
      });
      
      // Refresh sessions list
      await fetchSessions();
      
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete session. Please try again."
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session? This cannot be undone.")) {
      return;
    }
    
    try {
      await deleteSession(sessionId);
      fetchSessions();
      toast({
        title: "Success",
        description: "Session deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the session"
      });
    }
  };
  
  const handleSaveSession = async (sessionData: any) => {
    setSaving(true);
    try {
      if (isCreating) {
        await createSession(sessionData);
      } else if (editingSession) {
        await updateSession(editingSession.id, sessionData);
      }
      
      fetchSessions();
      setEditingSession(null);
      setIsCreating(false);
      toast({
        title: "Success",
        description: isCreating 
          ? "Session created successfully" 
          : "Session updated successfully"
      });
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save session"
      });
    } finally {
      setSaving(false);
    }
  };

  // Format time display
  const formatTime = (timestamp: Timestamp) => {
    try {
      return new Date(timestamp.toDate()).toLocaleString();
    } catch (e) {
      return "N/A";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-gym-gray-dark border-gym-gray-light overflow-hidden">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-white text-xl sm:text-2xl">Session Management</CardTitle>
              <CardDescription className="text-white/70">
                Create and manage your workout sessions
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gym-gray border-gym-gray-light text-white w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateSession}
                  className="bg-gym-yellow text-black hover:bg-gym-yellow/90 whitespace-nowrap"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Session
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 sm:p-4">
          {loading ? (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gym-gray h-[170px] rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-gym-gray-light rounded-md m-4">
              <div className="bg-gym-gray inline-flex rounded-full p-4 mb-4">
                <Clock className="h-8 w-8 text-white/30" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No sessions found</h3>
              <p className="text-white/60 mb-4 max-w-md mx-auto">
                {searchQuery || filter !== 'all' ? "No results match your search criteria." : "Get started by creating your first session."}
              </p>
              {!searchQuery && filter === 'all' && (
                <Button
                  onClick={handleCreateSession}
                  className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create First Session
                </Button>
              )}
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-gym-gray-dark border border-gym-gray-light rounded-md overflow-hidden cursor-pointer"
                  onClick={() => handleEditSession(session)}
                >
                  {/* Simple header with time of day */}
                  <div className="p-3 border-b border-gym-gray-light flex justify-between items-center">
                    <div className="flex items-center">
                      {session.timeOfDay === "morning" ? (
                        <Sunrise className="h-4 w-4 text-amber-400 mr-2" />
                      ) : (
                        <Sunset className="h-4 w-4 text-indigo-400 mr-2" />
                      )}
                      <span className="text-sm font-medium text-white">
                        {session.timeOfDay === "morning" ? "Morning" : "Evening"}
                      </span>
                    </div>
                    <span className="text-white/60 text-xs">{session.time}</span>
                  </div>
                  
                  {/* Simple body with session info */}
                  <div className="p-3">
                    <h4 className="text-white font-medium mb-1">{session.title}</h4>
                    <p className="text-white/60 text-xs mb-2 line-clamp-1">{session.description || "No description"}</p>
                    
                    {/* Action buttons and attendees */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center text-white/60 text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{session.currentAttendees}/{session.maxCapacity}</span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSession(session);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Session Editor Dialog - with mobile improvements */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="bg-gym-gray-dark border-gym-gray-light text-white sm:max-w-[550px] w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-gym-yellow text-xl">
              {isCreating ? "Create New Session" : "Edit Session"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {isCreating ? "Add a new session to your schedule" : "Update the details for this session"}
            </DialogDescription>
          </DialogHeader>
          
          <SessionEditor 
            session={editingSession} 
            isNew={isCreating} 
            onClose={() => setIsEditorOpen(false)} 
            onSuccess={() => {
              setIsEditorOpen(false);
              fetchSessions();
            }}
          />
          
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0 mt-6 pt-4 border-t border-gym-gray-light">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditorOpen(false)}
              className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-white"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              className="w-full sm:w-auto bg-gym-yellow text-black hover:bg-gym-yellow/90"
              onClick={handleSaveSession}
              disabled={saving}
            >
              {saving ? (isCreating ? "Creating..." : "Updating...") : (isCreating ? "Create Session" : "Update Session")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gym-gray-dark border-gym-gray-light text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Session</DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to delete the session "{sessionNameToDelete}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-red-950/30 border border-red-900/50 rounded-md p-4 text-sm text-red-400">
            <p>This will permanently remove the session from your schedule.</p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="sm:w-auto w-full border-white/20 hover:bg-white/10 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="sm:w-auto w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionManager;
