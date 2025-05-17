
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, BookingType } from "@/contexts/FirebaseContext";

const BookingsTable = () => {
  const { getBookings, updateBooking, deleteBooking } = useFirebase();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bookings</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={fetchBookings} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {searchQuery ? "No bookings match your search." : "No bookings found."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Preferred Slot</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{booking.price}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
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
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;
