import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, BookingType } from "@/contexts/FirebaseContext";
import { Edit, Trash, Phone, MessageSquare, Send, MoreVertical, ExternalLink, Search, RefreshCw, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const BookingsTable = () => {
  const { getBookings, updateBooking, deleteBooking } = useFirebase();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingType | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<BookingType>>({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bookings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'pending' | 'completed') => {
    try {
      await updateBooking(id, { paymentStatus: status });
      
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id ? { ...booking, paymentStatus: status } : booking
        )
      );
      
      toast({
        title: "Status updated",
        description: `Booking status has been updated to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status. Please try again.",
      });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(id);
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
        
        toast({
          title: "Booking deleted",
          description: "The booking has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting booking:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete booking. Please try again.",
        });
      }
    }
  };

  const openEditDialog = (booking: BookingType) => {
    setCurrentBooking(booking);
    setEditFormData({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      preferredSlot: booking.preferredSlot,
      paymentStatus: booking.paymentStatus,
      price: booking.price,
      screenshotUrl: booking.screenshotUrl
    });
    setEditDialogOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleEditSelectChange = (value: string, field: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBooking = async () => {
    if (!currentBooking?.id) return;
    
    try {
      await updateBooking(currentBooking.id, editFormData);
      
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === currentBooking.id 
            ? { ...booking, ...editFormData } 
            : booking
        )
      );
      
      toast({
        title: "Booking updated",
        description: "The booking has been successfully updated.",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update booking. Please try again.",
      });
    }
  };

  // Add functions to handle calling and messaging
  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleSMS = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = (phoneNumber: string, name: string) => {
    // Format phone number (remove any non-digit characters)
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    // Create message template
    const message = `Hello ${name}, this is Rebuild Fitness contacting you regarding your booking.`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filter bookings based on search query
  const filteredBookings = bookings.filter(booking => {
    const query = searchQuery.toLowerCase();
    return (
      booking.name.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.phone.includes(query) ||
      booking.preferredSlot.toLowerCase().includes(query)
    );
  });

  // Add window width tracking for responsiveness
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Define breakpoint for mobile view
  const isMobile = windowWidth < 768;

  // Enhanced mobile experience with improved visual feedback
  const renderMobileCard = (booking: BookingType) => (
    <Card key={booking.id} className="overflow-hidden bg-gym-gray-dark border-gym-gray-light mb-3 last:mb-0 animate-in fade-in duration-300">
      <CardContent className="p-4 pt-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-white truncate pr-2">{booking.name}</h3>
          <Badge
            variant={booking.paymentStatus === "completed" ? "default" : "outline"}
            className={
              booking.paymentStatus === "completed" 
                ? "bg-gym-yellow/20 text-gym-yellow border-gym-yellow whitespace-nowrap" 
                : "bg-transparent border-gym-yellow/50 text-gym-yellow/80 whitespace-nowrap"
            }
          >
            {booking.paymentStatus === "completed" ? "Paid" : "Pending"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
          <div>
            <p className="text-white/50 text-xs">Email</p>
            <p className="text-white/90 truncate">{booking.email || "-"}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Phone</p>
            <p className="text-white/90">{booking.phone}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Slot</p>
            <p className="text-white/90">{booking.preferredSlot}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Price</p>
            <p className="text-white/90">₹{booking.price}</p>
          </div>
        </div>
        
        {booking.screenshotUrl && (
          <div className="mb-3">
            <p className="text-white/50 text-xs mb-1">Payment Screenshot</p>
            <div className="relative w-full h-28 bg-gym-gray rounded overflow-hidden">
              <a href={booking.screenshotUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                <img src={booking.screenshotUrl} className="w-full h-full object-cover" alt="Payment" />
                <div className="absolute bottom-1 right-1">
                  <div className="bg-black/50 text-white p-1 rounded-full">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-0 border-t border-gym-gray-light">
        <div className="grid grid-cols-5 w-full divide-x divide-gym-gray-light">
          <Button 
            variant="ghost" 
            className="py-3 rounded-none h-auto text-blue-500"
            onClick={() => handleCall(booking.phone)}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            className="py-3 rounded-none h-auto text-green-500"
            onClick={() => handleSMS(booking.phone)}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            className="py-3 rounded-none h-auto text-green-500"
            onClick={() => handleWhatsApp(booking.phone, booking.name)}
          >
            <Send className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost"
            className="py-3 rounded-none h-auto text-amber-500"
            onClick={() => openEditDialog(booking)}
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost"
            className="py-3 rounded-none h-auto text-red-500"
            onClick={() => booking.id && handleDeleteBooking(booking.id)}
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
  
  // Improved responsive layout
  return (
    <>
      <div className="bg-gym-gray-dark rounded-lg shadow-md border border-gym-gray-light overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 border-b border-gym-gray-light">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Bookings</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50"
                />
              </div>
              <Button 
                onClick={fetchBookings} 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto border-gym-yellow text-gym-yellow hover:bg-gym-yellow/20"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-gym-gray inline-flex rounded-full p-4 mb-4">
              <Calendar className="h-8 w-8 text-white/30" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">{searchQuery ? "No matching bookings" : "No bookings yet"}</h3>
            <p className="text-white/60 max-w-md mx-auto">
              {searchQuery 
                ? "Try adjusting your search or clear the filter to see all bookings." 
                : "When customers make bookings, they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="sm:hidden">
            <div className="p-3">
              {filteredBookings.map(booking => renderMobileCard(booking))}
            </div>
          </div>
        )}

        {!loading && filteredBookings.length > 0 && (
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Email</TableHead>
                  <TableHead className="text-white/70">Phone</TableHead>
                  <TableHead className="text-white/70">Preferred Slot</TableHead>
                  <TableHead className="text-white/70">Screenshot</TableHead>
                  <TableHead className="text-white/70">Payment Status</TableHead>
                  <TableHead className="text-white/70">Price (₹)</TableHead>
                  <TableHead className="text-white/70 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.name}</TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>{booking.phone}</TableCell>
                    <TableCell>{booking.preferredSlot}</TableCell>
                    <TableCell>
                      {booking.screenshotUrl ? (
                        <a href={booking.screenshotUrl} target="_blank" rel="noopener noreferrer">
                          <img src={booking.screenshotUrl} className="w-12 h-12 object-cover rounded" alt="Payment screenshot" />
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={booking.paymentStatus === "completed" ? "default" : "outline"}
                        className={
                          booking.paymentStatus === "completed" 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        }
                      >
                        {booking.paymentStatus === "completed" ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{booking.price}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleCall(booking.phone)}
                          title="Call customer"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSMS(booking.phone)}
                          title="Send SMS"
                          className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => openEditDialog(booking)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Booking
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => handleWhatsApp(booking.phone, booking.name)}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              WhatsApp
                            </DropdownMenuItem>
                            
                            {booking.paymentStatus === "pending" ? (
                              <DropdownMenuItem 
                                onClick={() => booking.id && handleUpdateStatus(booking.id, "completed")}
                              >
                                Mark as Paid
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => booking.id && handleUpdateStatus(booking.id, "pending")}
                              >
                                Mark as Pending
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => booking.id && handleDeleteBooking(booking.id)}
                              className="text-red-600"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
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
      </div>

      {/* Edit Booking Dialog - improved for mobile */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px] w-[95vw] max-h-[90vh] max-w-full rounded-lg overflow-hidden flex flex-col bg-gym-gray-dark border-gym-gray-light text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Booking</DialogTitle>
            <DialogDescription className="text-white/70">
              Update the booking information below.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-4 max-h-[60vh]">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="name" className="md:text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="email" className="md:text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editFormData.email || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="phone" className="md:text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={editFormData.phone || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="preferredSlot" className="md:text-right">
                  Slot
                </Label>
                <div className="md:col-span-3">
                  <Select 
                    value={editFormData.preferredSlot} 
                    onValueChange={(value) => handleEditSelectChange(value, 'preferredSlot')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning-1">8:00 AM - 9:00 AM (Morning)</SelectItem>
                      <SelectItem value="morning-2">9:00 AM - 10:10 AM (Morning)</SelectItem>
                      <SelectItem value="evening-1">3:00 PM - 4:00 PM (Evening)</SelectItem>
                      <SelectItem value="evening-2">4:00 PM - 5:00 PM (Evening)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="price" className="md:text-right">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={editFormData.price || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="screenshotUrl" className="md:text-right">
                  Screenshot URL
                </Label>
                <Input
                  id="screenshotUrl"
                  name="screenshotUrl"
                  value={editFormData.screenshotUrl || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="paymentStatus" className="md:text-right">
                  Payment Status
                </Label>
                <div className="md:col-span-3">
                  <Select 
                    value={editFormData.paymentStatus} 
                    onValueChange={(value) => handleEditSelectChange(value as 'pending' | 'completed', 'paymentStatus')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0 mt-6 pt-4 border-t border-gym-gray-light">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveBooking} 
              className="w-full sm:w-auto bg-gym-yellow text-black hover:bg-gym-yellow/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingsTable;
