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
import { Edit, Trash, Phone, MessageSquare, Send, MoreVertical, ExternalLink, Search, RefreshCw, Calendar, DownloadCloud, CheckSquare, X, Trash2, AlertTriangle, ChevronDown, FileCog } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AnimatePresence, motion } from "framer-motion";

const BookingsTable = () => {
  const { getBookings, updateBooking, deleteBooking } = useFirebase();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingType | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<BookingType>>({});
  
  // Add multi-select state
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
  const [processingBulkAction, setProcessingBulkAction] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      
      if (!data || data.length === 0) {
        // Remove console.warn
      } else {
        // Only count paid bookings without logging
        const paidBookings = data.filter(booking => booking.paymentStatus === "completed");
        // Remove console.log about counts
      }
      
      // Ensure we're storing ALL bookings regardless of status
      setBookings(data || []);
    } catch (error) {
      // Remove console.error
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bookings. Please try again.",
      });
      // Initialize with empty array on error to avoid undefined
      setBookings([]);
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
      // Clean up data before sending to Firestore
      const cleanData = Object.fromEntries(
        Object.entries(editFormData).filter(([_, value]) => value !== undefined && value !== "")
      );
      
      // Convert price to number if it's a string
      if (typeof cleanData.price === 'string' && cleanData.price !== '') {
        cleanData.price = Number(cleanData.price);
      }
      
      // Remove console.log about data being sent to Firestore
      
      // Update booking with clean data
      await updateBooking(currentBooking.id, cleanData);
      
      // Update local state with the same clean data
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === currentBooking.id 
            ? { ...booking, ...cleanData } 
            : booking
        )
      );
      
      toast({
        title: "Booking updated",
        description: "The booking has been successfully updated.",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      // Remove console.error
      // More informative error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      // Show a more user-friendly error message based on the specific error
      if (errorMessage.includes("Booking not found")) {
        toast({
          variant: "destructive",
          title: "Booking not found",
          description: "This booking record may have been deleted or moved. Please refresh the list.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: `Failed to update booking: ${errorMessage}`,
        });
      }
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
    const query = searchQuery.toLowerCase().trim();
    
    // If no search query, return all bookings
    if (!query) return true;
    
    // Otherwise, search across multiple fields
    return (
      booking.name?.toLowerCase().includes(query) ||
      booking.email?.toLowerCase().includes(query) ||
      booking.phone?.includes(query) ||
      booking.preferredSlot?.toLowerCase().includes(query) ||
      booking.paymentStatus?.toLowerCase().includes(query) // Also search by payment status
    );
  });

  // Replace debug function with a version that only shows toasts, no console logs
  const debugBookings = () => {
    toast({
      title: "Debug info",
      description: `Total: ${bookings.length}, Filtered: ${filteredBookings.length}, Paid: ${bookings.filter(b => b.paymentStatus === "completed").length}`,
    });
  };

  // Add window width tracking for responsiveness
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Define breakpoint for mobile view
  const isMobile = windowWidth < 768;

  // Toggle selection for a single booking
  const toggleBookingSelection = (id: string | undefined) => {
    if (!id) return;
    
    setSelectedBookings(prev => {
      if (prev.includes(id)) {
        return prev.filter(bookingId => bookingId !== id);
      } else {
        return [...prev, id];
      }
    });
    
    // Auto-activate selection mode when first item is selected
    if (!selectionMode) {
      setSelectionMode(true);
    }
  };
  
  // Toggle selection for all filtered bookings
  const toggleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      // Deselect all
      setSelectedBookings([]);
    } else {
      // Select all filtered bookings
      const ids = filteredBookings
        .map(booking => booking.id)
        .filter((id): id is string => id !== undefined);
      setSelectedBookings(ids);
    }
  };
  
  // Exit selection mode
  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedBookings([]);
  };
  
  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedBookings.length === 0) return;
    
    setProcessingBulkAction(true);
    setBulkDeleteDialog(false);
    
    const totalToDelete = selectedBookings.length;
    const deleteProgress = toast({
      title: `Deleting ${totalToDelete} bookings`,
      description: "Please wait...",
    });
    
    try {
      let successCount = 0;
      let errorCount = 0;
      
      // Process deletions sequentially to avoid overwhelming Firebase
      for (const id of selectedBookings) {
        try {
          await deleteBooking(id);
          successCount++;
        } catch (err) {
          // Remove console.error for each failed deletion
          errorCount++;
        }
      }
      
      // Update local state to remove deleted bookings
      setBookings(prevBookings => 
        prevBookings.filter(booking => !selectedBookings.includes(booking.id || ''))
      );
      
      // Show completion toast
      toast({
        title: errorCount > 0 ? "Deletion partially completed" : "Deletion successful",
        description: `Successfully deleted ${successCount} out of ${totalToDelete} bookings${errorCount > 0 ? `. ${errorCount} failed.` : ''}.`,
        variant: errorCount > 0 ? "destructive" : "default",
      });
      
      // Exit selection mode
      exitSelectionMode();
      
    } catch (error) {
      // Remove console.error for bulk delete failures
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setProcessingBulkAction(false);
    }
  };
  
  // Export selected bookings as CSV
  const handleExportBookings = () => {
    if (selectedBookings.length === 0) return;
    setProcessingBulkAction(true);
    
    try {
      const selectedBookingsData = bookings.filter(booking => 
        selectedBookings.includes(booking.id || '')
      );
      
      if (exportFormat === 'csv') {
        // Export as CSV
        const headers = [
          "Name", "Email", "Phone", "Preferred Slot", "Payment Status", 
          "Price", "Date", "Screenshot URL"
        ];
        
        const rows = selectedBookingsData.map(booking => [
          booking.name || '',
          booking.email || '',
          booking.phone || '',
          booking.preferredSlot || '',
          booking.paymentStatus || '',
          booking.price || 0,
          booking.createdAt?.toDate ? booking.createdAt.toDate().toISOString() : '',
          booking.screenshotUrl || ''
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(',') + '\r\n';
        
        rows.forEach(row => {
          // Handle commas and quotes in cell values
          const processedRow = row.map(cell => {
            const cellStr = String(cell);
            // If cell contains comma, quote, or newline, wrap in quotes
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          });
          
          csvContent += processedRow.join(',') + '\r\n';
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `rebuild-fitness-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        
        link.click();
        document.body.removeChild(link);
        
      } else if (exportFormat === 'json') {
        // Export as JSON
        const jsonStr = JSON.stringify(selectedBookingsData, null, 2);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `rebuild-fitness-bookings-${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchorNode);
        
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
      
      toast({
        title: "Export successful",
        description: `${selectedBookingsData.length} bookings exported as ${exportFormat.toUpperCase()}.`,
      });
      
      setExportDialogOpen(false);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export bookings. Please try again.",
      });
      // Remove console.error for export failures
    } finally {
      setProcessingBulkAction(false);
    }
  };

  // Improve the "Exit Selection" button to be more visible and compact
  const SelectionToggle = () => {
    if (loading || filteredBookings.length === 0) return null;
    
    return (
      <Button
        variant={selectionMode ? "secondary" : "outline"}
        size="sm"
        onClick={() => setSelectionMode(!selectionMode)}
        className={`h-7 px-2.5 flex items-center gap-1 ${
          selectionMode 
            ? 'bg-gym-yellow text-black font-medium hover:bg-gym-yellow/90' 
            : 'border-gym-gray-light text-white/70 hover:bg-gym-gray hover:text-white'
        }`}
      >
        <CheckSquare className={`h-3.5 w-3.5 ${selectionMode ? 'text-black' : 'text-gym-yellow'}`} />
        <span className="text-xs">{selectionMode ? 'EXIT SELECTION' : 'Select'}</span>
      </Button>
    );
  };

  // A more compact Select All component for mobile with even smaller checkbox
  const MobileSelectAll = () => {
    const allSelected = filteredBookings.length > 0 && 
      selectedBookings.length === filteredBookings.length;
    
    return (
      <div className="flex items-center justify-between py-1 px-2 bg-gym-gray border-b border-gym-gray-light">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center p-0.5">
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleSelectAll}
              className="h-2 w-2 scale-[0.5] rounded-[1px] data-[state=checked]:bg-gym-yellow data-[state=checked]:text-black border-white/60"
            />
          </div>
          <span className="text-white/80 text-xs pl-0.5">
            Select All ({filteredBookings.length})
          </span>
        </div>
        
        <Badge 
          variant="outline" 
          className="text-xs px-1.5 py-0 h-4 text-[10px] border-gym-yellow/30 bg-gym-yellow/5 text-gym-yellow"
        >
          {selectedBookings.length} selected
        </Badge>
      </div>
    );
  };

  // Enhanced mobile experience with much smaller checkboxes
  const renderMobileCard = (booking: BookingType) => (
    <div className="relative" key={booking.id}>
      {/* Make checkbox significantly smaller */}
      <div 
        className={`absolute top-[8px] left-[8px] z-10 transform transition-all duration-300 ${
          selectionMode ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      >
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selectedBookings.includes(booking.id || '')}
            onCheckedChange={() => toggleBookingSelection(booking.id)}
            className="h-2 w-2 scale-[0.5] rounded-[1px] border-white/60
                   data-[state=checked]:bg-gym-yellow data-[state=checked]:text-black"
          />
        </div>
      </div>
      
      <Card 
        className={`overflow-hidden mb-2 ${
          selectedBookings.includes(booking.id || '') 
            ? 'border border-gym-yellow bg-gym-yellow/5' 
            : 'bg-gym-gray-dark border border-gym-gray-light'
        } transition-all duration-200`}
        onClick={() => {
          if (selectionMode) {
            toggleBookingSelection(booking.id);
          }
        }}
      >
        <CardContent className="p-3 pt-2">
          {/* Visual indicator for selection state */}
          {selectedBookings.includes(booking.id || '') && (
            <div className="absolute inset-0 border border-gym-yellow pointer-events-none"></div>
          )}
          
          <div className="flex justify-between items-center mb-2">
            {/* Adjust padding for name with the smaller checkbox */}
            <h3 className={`font-semibold text-sm text-white truncate pr-2 ${selectionMode ? 'pl-3' : ''}`}>
              {booking.name}
            </h3>
            <Badge
              variant={booking.paymentStatus === "completed" ? "default" : "outline"}
              className={booking.paymentStatus === "completed" 
                ? "text-[10px] py-0 h-4 px-1.5 whitespace-nowrap bg-gym-yellow/20 text-gym-yellow border border-gym-yellow/50" 
                : "text-[10px] py-0 h-4 px-1.5 whitespace-nowrap bg-transparent border border-gym-yellow/50 text-gym-yellow/80"}
            >
              {booking.paymentStatus === "completed" ? "Paid" : "Pending"}
            </Badge>
          </div>
          
          {/* More compact layout for card content */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
            <div>
              <p className="text-white/40 text-[10px]">Email</p>
              <p className="text-white/90 truncate text-xs">{booking.email || "-"}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px]">Phone</p>
              <p className="text-white/90 text-xs">{booking.phone}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px]">Slot</p>
              <p className="text-white/90 text-xs">{booking.preferredSlot}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px]">Price</p>
              <p className="text-white/90 text-xs">₹{booking.price}</p>
            </div>
          </div>
          
          {booking.screenshotUrl && (
            <div className="mb-2">
              <p className="text-white/50 text-xs mb-1">Payment Screenshot</p>
              <div className="relative w-full h-24 bg-gym-gray rounded overflow-hidden">
                <a href={booking.screenshotUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <img src={booking.screenshotUrl} className="w-full h-full object-cover" alt="Payment" loading="lazy" width="100" height="100" />
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
        
        {/* Only show action buttons when NOT in selection mode */}
        {!selectionMode && (
          <CardFooter className="p-0 border-t border-gym-gray-light">
            <div className="grid grid-cols-5 w-full divide-x divide-gym-gray-light">
              <Button 
                variant="ghost" 
                className="py-2 rounded-none h-auto text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCall(booking.phone);
                }}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                className="py-2 rounded-none h-auto text-green-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSMS(booking.phone);
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                className="py-2 rounded-none h-auto text-green-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWhatsApp(booking.phone, booking.name);
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost"
                className="py-2 rounded-none h-auto text-amber-500"
                onClick={() => openEditDialog(booking)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost"
                className="py-2 rounded-none h-auto text-red-500"
                onClick={() => booking.id && handleDeleteBooking(booking.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
  
  // Optimized floating toolbar for mobile - more compact
  const BulkActionsToolbar = () => {
    if (!selectionMode || selectedBookings.length === 0) return null;
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 inset-x-0 z-50 pointer-events-none"
        >
          <div className="max-w-md mx-auto px-2 pb-1 pointer-events-auto">
            <div className="bg-gym-black rounded-t-md shadow-lg border border-b-0 border-gym-gray-light">
              {/* Compact header with count */}
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-gym-gray-light">
                <div className="flex items-center gap-1.5">
                  <div className="bg-gym-yellow/10 rounded-full p-0.5 flex items-center justify-center">
                    <CheckSquare className="h-3 w-3 text-gym-yellow" />
                  </div>
                  <span className="text-white font-medium text-xs">
                    {selectedBookings.length} selected
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exitSelectionMode}
                  disabled={processingBulkAction}
                  className="h-5 w-5 p-0 rounded-full text-white/70 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              {/* Action buttons in compact row */}
              <div className="grid grid-cols-2 gap-1 p-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExportDialogOpen(true)}
                  disabled={processingBulkAction}
                  className="border-gym-yellow/70 text-gym-yellow hover:bg-gym-yellow/10 text-xs h-7 px-1"
                >
                  <DownloadCloud className="h-3 w-3 mr-1" />
                  Export
                </Button>
                  
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setBulkDeleteDialog(true)}
                  disabled={processingBulkAction}
                  className="bg-red-600/80 hover:bg-red-700 text-xs h-7 px-1"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Update the main component's return section
  return (
    <>
      <div className="bg-gym-gray-dark rounded-lg shadow-md border border-gym-gray-light overflow-hidden">
        {/* Header with more compact controls */}
        <div className="p-2 sm:p-4 md:p-6 border-b border-gym-gray-light">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Bookings</h2>
              
              {/* Improved selection toggle button */}
              <div>
                <SelectionToggle />
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full xs:w-auto flex-grow">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 py-1 h-8 text-sm bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50"
                />
              </div>
              <div className="flex gap-1 w-full xs:w-auto">
                <Button 
                  onClick={fetchBookings} 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 xs:flex-initial border-gym-yellow text-gym-yellow hover:bg-gym-yellow/20 text-xs h-8 py-0"
                >
                  <RefreshCw className={`mr-1 h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    onClick={debugBookings}
                    variant="outline"
                    size="sm"
                    className="flex-1 xs:flex-initial border-white/30 text-white/70 hover:bg-white/10 text-xs h-8 py-0"
                  >
                    Debug
                  </Button>
                )}
              </div>
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
            {/* Improved Select All UI only shown in selection mode */}
            {selectionMode && <MobileSelectAll />}
            
            <div className="px-2 py-1 space-y-2">
              {filteredBookings.map(booking => renderMobileCard(booking))}
            </div>
            
            {/* Add padding at the bottom when toolbar is visible to prevent content from being hidden */}
            {selectionMode && selectedBookings.length > 0 && (
              <div className="h-16"></div>
            )}
          </div>
        )}

        {!loading && filteredBookings.length > 0 && (
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Add checkbox column for multi-select */}
                  {selectionMode && (
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          filteredBookings.length > 0 &&
                          selectedBookings.length === filteredBookings.length
                        }
                        onCheckedChange={toggleSelectAll}
                        className="data-[state=checked]:bg-gym-yellow data-[state=checked]:text-black"
                      />
                    </TableHead>
                  )}
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
                  <TableRow 
                    key={booking.id}
                    className={`
                      ${selectedBookings.includes(booking.id || '') ? 'bg-gym-yellow/10' : ''}
                      ${selectionMode ? 'hover:bg-gym-gray-light/30 cursor-pointer' : ''}
                      transition-colors
                    `}
                    onClick={() => {
                      if (selectionMode) {
                        toggleBookingSelection(booking.id);
                      }
                    }}
                  >
                    {/* Selection checkbox */}
                    {selectionMode && (
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.id || '')}
                          onCheckedChange={() => toggleBookingSelection(booking.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="data-[state=checked]:bg-gym-yellow data-[state=checked]:text-black"
                        />
                      </TableCell>
                    )}
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
          <DialogHeader className="pb-2 border-b border-gym-gray-light">
            <DialogTitle className="text-white font-bold text-xl">Edit Booking</DialogTitle>
            <DialogDescription className="text-white/90">
              Update the booking information below.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-4 max-h-[60vh]">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="name" className="md:text-right font-medium text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3 bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="email" className="md:text-right font-medium text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editFormData.email || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3 bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="phone" className="md:text-right font-medium text-white">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={editFormData.phone || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3 bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="preferredSlot" className="md:text-right font-medium text-white">
                  Slot
                </Label>
                <div className="md:col-span-3">
                  <Select 
                    value={editFormData.preferredSlot} 
                    onValueChange={(value) => handleEditSelectChange(value, 'preferredSlot')}
                  >
                    <SelectTrigger className="bg-gym-gray text-white border-gym-gray-light">
                      <SelectValue placeholder="Select preferred slot" />
                    </SelectTrigger>
                    <SelectContent className="bg-gym-gray-dark text-white border-gym-gray-light">
                      <SelectItem value="morning-1" className="text-white hover:bg-gym-gray-light focus:text-white">8:00 AM - 9:00 AM (Morning)</SelectItem>
                      <SelectItem value="morning-2" className="text-white hover:bg-gym-gray-light focus:text-white">9:00 AM - 10:10 AM (Morning)</SelectItem>
                      <SelectItem value="evening-1" className="text-white hover:bg-gym-gray-light focus:text-white">3:00 PM - 4:00 PM (Evening)</SelectItem>
                      <SelectItem value="evening-2" className="text-white hover:bg-gym-gray-light focus:text-white">4:00 PM - 5:00 PM (Evening)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="price" className="md:text-right font-medium text-white">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={editFormData.price || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3 bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="screenshotUrl" className="md:text-right font-medium text-white">
                  Screenshot URL
                </Label>
                <Input
                  id="screenshotUrl"
                  name="screenshotUrl"
                  value={editFormData.screenshotUrl || ''}
                  onChange={handleEditInputChange}
                  className="md:col-span-3 bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
                <Label htmlFor="paymentStatus" className="md:text-right font-medium text-white">
                  Payment Status
                </Label>
                <div className="md:col-span-3">
                  <Select 
                    value={editFormData.paymentStatus} 
                    onValueChange={(value) => handleEditSelectChange(value as 'pending' | 'completed', 'paymentStatus')}
                  >
                    <SelectTrigger className="bg-gym-gray text-white border-gym-gray-light">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gym-gray-dark text-white border-gym-gray-light">
                      <SelectItem value="pending" className="text-white hover:bg-gym-gray-light focus:text-white">Pending</SelectItem>
                      <SelectItem value="completed" className="text-white hover:bg-gym-gray-light focus:text-white">Completed</SelectItem>
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

      {/* Bulk actions toolbar */}
      <BulkActionsToolbar />
      
      {/* Bulk delete confirmation dialog */}
      <AlertDialog open={bulkDeleteDialog} onOpenChange={setBulkDeleteDialog}>
        <AlertDialogContent className="bg-gym-gray-dark border-gym-gray-light text-white w-[calc(100%-2rem)] max-w-md mx-auto p-4">
          <AlertDialogHeader className="space-y-1">
            <AlertDialogTitle className="text-white text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Confirm Bulk Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70 text-sm">
              Delete {selectedBookings.length} {selectedBookings.length === 1 ? 'booking' : 'bookings'}?
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="bg-red-900/20 border border-red-900/30 rounded-md p-3 my-3 text-xs">
            <p className="text-red-300">
              All selected bookings will be removed permanently.
            </p>
          </div>
          
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10 mt-0 text-sm py-1 h-8">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleBulkDelete();
                if ('vibrate' in navigator) {
                  navigator.vibrate([100, 50, 100]);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 h-8"
            >
              {processingBulkAction ? (
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>Delete {selectedBookings.length}</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Similarly optimize export dialog */}
      <AlertDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <AlertDialogContent className="bg-gym-gray-dark border-gym-gray-light text-white w-[calc(100%-2rem)] max-w-md mx-auto p-4">
          <AlertDialogHeader className="space-y-1">
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <FileCog className="h-5 w-5 text-gym-yellow" />
              Export Bookings
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Choose a format to export {selectedBookings.length} {selectedBookings.length === 1 ? 'booking' : 'bookings'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="flex flex-col gap-3">
              <div 
                className={`p-4 border rounded-md cursor-pointer flex items-center ${
                  exportFormat === 'csv' 
                    ? 'border-gym-yellow bg-gym-yellow/10' 
                    : 'border-white/20'
                }`}
                onClick={() => setExportFormat('csv')}
              >
                <Checkbox 
                  checked={exportFormat === 'csv'} 
                  className="data-[state=checked]:bg-gym-yellow data-[state=checked]:text-black h-5 w-5"
                />
                <div className="ml-4">
                  <h3 className="font-medium text-white">CSV Format</h3>
                  <p className="text-sm text-white/70">Export as comma-separated values. Best for spreadsheets.</p>
                </div>
              </div>
              
              <div 
                className={`p-4 border rounded-md cursor-pointer flex items-center ${
                  exportFormat === 'json' 
                    ? 'border-gym-yellow bg-gym-yellow/10' 
                    : 'border-white/20'
                }`}
                onClick={() => setExportFormat('json')}
              >
                <Checkbox 
                  checked={exportFormat === 'json'} 
                  className="data-[state=checked]:bg-gym-yellow data-[state=checked]:text-black h-5 w-5"
                />
                <div className="ml-4">
                  <h3 className="font-medium text-white">JSON Format</h3>
                  <p className="text-sm text-white/70">Export as structured data. Best for developers.</p>
                </div>
              </div>
            </div>
          </div>
          
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10 mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleExportBookings();
              }}
              className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
            >
              {processingBulkAction ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>Export {selectedBookings.length} {selectedBookings.length === 1 ? 'booking' : 'bookings'}</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookingsTable;
