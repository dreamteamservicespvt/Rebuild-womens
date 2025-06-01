import { useState, useEffect } from 'react';
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, FreeSessionType } from "@/contexts/FirebaseContext";
import { Edit, Trash, Phone, MessageSquare, Send, MoreVertical, Search, RefreshCw, Plus } from "lucide-react";

const FreeSessionManager = () => {
  const { getFreeSessions, updateFreeSession, deleteFreeSession, createFreeSession } = useFirebase();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<FreeSessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<FreeSessionType | null>(null);
  const [formData, setFormData] = useState<Partial<FreeSessionType>>({});
  const [filteredSessions, setFilteredSessions] = useState<FreeSessionType[]>([]);
  
  // Fetch free sessions
  useEffect(() => {
    fetchSessions();
  }, []);
  
  // Filter sessions based on search query
  useEffect(() => {
    const filtered = sessions.filter(session => {
      const query = searchQuery.toLowerCase();
      return (
        session.name.toLowerCase().includes(query) ||
        session.email.toLowerCase().includes(query) ||
        session.phone.includes(query)
      );
    });
    setFilteredSessions(filtered);
  }, [searchQuery, sessions]);
  
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await getFreeSessions();
      setSessions(data);
      setFilteredSessions(data);
    } catch (error) {
      console.error("Error fetching free sessions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load free session bookings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const openEditDialog = (session: FreeSessionType) => {
    setCurrentSession(session);
    setFormData({
      name: session.name,
      email: session.email,
      phone: session.phone,
      status: session.status,
      notes: session.notes,
    });
    setEditDialogOpen(true);
  };
  
  const openCreateDialog = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'new',
      notes: '',
    });
    setCreateDialogOpen(true);
  };
  
  const openDeleteDialog = (session: FreeSessionType) => {
    setCurrentSession(session);
    setDeleteDialogOpen(true);
  };
  
  const handleSaveSession = async () => {
    if (!currentSession?.id) return;
    
    try {
      await updateFreeSession(currentSession.id, formData);
      
      // Update local state
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === currentSession.id 
            ? { ...session, ...formData } 
            : session
        )
      );
      
      toast({
        title: "Session updated",
        description: "Free session booking has been updated successfully.",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating free session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update free session. Please try again.",
      });
    }
  };
  
  const handleCreateSession = async () => {
    try {
      // Check if all required fields are present
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields (name, email, phone).",
        });
        return;
      }
      
      // Cast formData to the required type, now that we've verified required fields exist
      const sessionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status || 'new',
        notes: formData.notes || ''
      };
      
      const newSessionId = await createFreeSession(sessionData);
      
      // Refresh sessions to include the new one
      fetchSessions();
      
      toast({
        title: "Session created",
        description: "Free session booking has been created successfully.",
      });
      
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating free session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create free session. Please try again.",
      });
    }
  };
  
  const handleDeleteSession = async () => {
    if (!currentSession?.id) return;
    
    try {
      await deleteFreeSession(currentSession.id);
      
      // Update local state
      setSessions(prevSessions => 
        prevSessions.filter(session => session.id !== currentSession.id)
      );
      
      toast({
        title: "Session deleted",
        description: "Free session booking has been deleted successfully.",
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting free session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete free session. Please try again.",
      });
    }
  };
  
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleSMS = (phone: string) => {
    window.open(`sms:${phone}`, '_self');
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const formattedPhone = phone.replace(/\D/g, '');
    const message = `Hello ${name}, this is Rebuild Fitness contacting you regarding your free session booking.`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Get status badge styles
  const getStatusBadge = (status: string = 'new') => {
    switch(status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Contacted</Badge>;
      case 'booked':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Booked</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/30">{status}</Badge>;
    }
  };
  
  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Render mobile card view
  const renderMobileCard = (session: FreeSessionType) => (
    <Card key={session.id} className="mb-4 bg-gym-gray-dark border-gym-gray-light overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-white text-lg">{session.name}</CardTitle>
          {getStatusBadge(session.status)}
        </div>
        <p className="text-white/60 text-sm">
          {formatDate(session.timestamp)}
        </p>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-white/60">Email:</span>
            <span className="text-white">{session.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Phone:</span>
            <span className="text-white">{session.phone}</span>
          </div>
          {session.notes && (
            <div className="pt-2 border-t border-gym-gray-light">
              <p className="text-white/60 text-sm">Notes:</p>
              <p className="text-white text-sm mt-1">{session.notes}</p>
            </div>
          )}
        </div>
        
        <div className="flex border-t border-gym-gray-light -mx-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCall(session.phone)}
            className="flex-1 rounded-none py-3 text-blue-400"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSMS(session.phone)}
            className="flex-1 rounded-none py-3 text-green-400 border-l border-gym-gray-light"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleWhatsApp(session.phone, session.name)}
            className="flex-1 rounded-none py-3 text-green-400 border-l border-gym-gray-light"
          >
            <Send className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditDialog(session)}
            className="flex-1 rounded-none py-3 text-yellow-400 border-l border-gym-gray-light"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteDialog(session)}
            className="flex-1 rounded-none py-3 text-red-400 border-l border-gym-gray-light"
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Free Session Leads</h2>
          <p className="text-white/70">Manage and track free session bookings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 bg-gym-gray border-gym-gray-light text-white"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={fetchSessions}
              className="w-full sm:w-auto border-gym-yellow text-gym-yellow hover:bg-gym-yellow/20"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={openCreateDialog}
              className="w-full sm:w-auto bg-gym-yellow text-black hover:bg-gym-yellow/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gym-gray inline-flex rounded-full p-4 mb-4">
            <Phone className="h-8 w-8 text-white/30" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {searchQuery ? "No matching leads found" : "No free session leads yet"}
          </h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? "Try adjusting your search or clear the filter to see all leads." 
              : "When users book free sessions, they'll appear here. You can also manually add leads."
            }
          </p>
          {!searchQuery && (
            <Button
              onClick={openCreateDialog}
              className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Lead
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile view */}
          {isMobile && (
            <div>
              {filteredSessions.map(renderMobileCard)}
              <div className="text-center text-white/60 text-sm mt-2">
                {filteredSessions.length} lead{filteredSessions.length !== 1 ? 's' : ''} found
              </div>
            </div>
          )}
          
          {/* Desktop view */}
          {!isMobile && (
            <div className="overflow-x-auto rounded-lg border border-gym-gray-light">
              <Table>
                <TableHeader>
                  <TableRow className="border-gym-gray-light hover:bg-transparent">
                    <TableHead className="text-white/70">Name</TableHead>
                    <TableHead className="text-white/70">Email</TableHead>
                    <TableHead className="text-white/70">Phone</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Date</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id} className="border-gym-gray-light">
                      <TableCell className="font-medium text-white">{session.name}</TableCell>
                      <TableCell className="text-white/80">{session.email}</TableCell>
                      <TableCell className="text-white/80">{session.phone}</TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell className="text-white/80">{formatDate(session.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCall(session.phone)}
                            className="h-8 w-8 p-0 text-blue-400"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSMS(session.phone)}
                            className="h-8 w-8 p-0 text-green-400"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleWhatsApp(session.phone, session.name)}
                            className="h-8 w-8 p-0 text-green-400"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gym-gray-dark border-gym-gray-light">
                              <DropdownMenuLabel className="text-white/70">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-gym-gray-light" />
                              <DropdownMenuItem
                                onClick={() => openEditDialog(session)}
                                className="text-white hover:bg-gym-gray-light hover:text-white"
                              >
                                <Edit className="h-4 w-4 mr-2 text-yellow-400" />
                                Edit Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(session)}
                                className="text-red-400 hover:bg-red-950/30 hover:text-red-400"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Lead
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-gym-gray-dark border-gym-gray-light sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Free Session Lead</DialogTitle>
            <DialogDescription className="text-white/70">
              Update details for this free session lead.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-white text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleFormChange}
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-white text-right">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleFormChange}
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-white text-right">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleFormChange}
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-white text-right">Status</Label>
              <Select
                value={formData.status || 'new'}
                onValueChange={(value) => handleSelectChange(value, 'status')}
              >
                <SelectTrigger className="col-span-3 bg-gym-gray border-gym-gray-light text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gym-gray-dark border-gym-gray-light">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-white text-right pt-2">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleFormChange}
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white min-h-[100px]"
                placeholder="Add any additional notes here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSession}
              className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-gym-gray-dark border-gym-gray-light sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add Free Session Lead</DialogTitle>
            <DialogDescription className="text-white/70">
              Manually add a new free session lead.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-name" className="text-white text-right">Name</Label>
              <Input
                id="create-name"
                name="name"
                value={formData.name || ''}
                onChange={handleFormChange}
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white"
                placeholder="Full name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-email" className="text-white text-right">Email</Label>
              <Input
                id="create-email"
                name="email"
                value={formData.email || ''}
                onChange={handleFormChange}
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white"
                placeholder="Email address"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-phone" className="text-white text-right">Phone</Label>
              <Input
                id="create-phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleFormChange}
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white"
                placeholder="Phone number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="create-status" className="text-white text-right">Status</Label>
              <Select
                value={formData.status || 'new'}
                onValueChange={(value) => handleSelectChange(value, 'status')}
              >
                <SelectTrigger id="create-status" className="col-span-3 bg-gym-gray border-gym-gray-light text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gym-gray-dark border-gym-gray-light">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="create-notes" className="text-white text-right pt-2">Notes</Label>
              <Textarea
                id="create-notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleFormChange}
                className="col-span-3 bg-gym-gray border-gym-gray-light text-white min-h-[100px]"
                placeholder="Add any additional notes here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSession}
              className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
            >
              Create Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gym-gray-dark border-gym-gray-light sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Free Session Lead</DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to delete this free session booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gym-gray p-4 rounded-md border border-gym-gray-light">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Name:</span>
                <span className="text-white font-medium">{currentSession?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Email:</span>
                <span className="text-white">{currentSession?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Phone:</span>
                <span className="text-white">{currentSession?.phone}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteSession}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreeSessionManager;
