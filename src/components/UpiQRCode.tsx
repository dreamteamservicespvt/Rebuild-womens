import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface UPIQRCodeProps {
  amount: number;
  userName: string;  // Added user name
  serviceName: string; // Added service name
  originalPrice: number; // Added original price
  couponCode?: string; // Added optional coupon code
  paymentDescription?: string;
  onComplete?: () => void;
}

const UPIQRCode = ({ 
  amount, 
  userName, 
  serviceName, 
  originalPrice, 
  couponCode, 
  paymentDescription, 
  onComplete 
}: UPIQRCodeProps) => {
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate QR code for UPI payment
  const upiID = "sagar.a.tej@ybl";
  const payeeName = "AKULA SAGAR/Sri Devi";
  
  // Create a detailed transaction note that will appear in UPI apps
  const formattedDescription = formatUpiDescription(userName, serviceName, originalPrice, amount, couponCode);
  
  // Properly encode UPI string with descriptive transaction note
  const upiString = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(formattedDescription)}`;

  useEffect(() => {
    QRCode.toDataURL(upiString)
      .then(url => {
        setQrUrl(url);
      })
      .catch(err => {
        console.error("Error generating QR code:", err);
      });
  }, [upiString]);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Format currency with thousands separator
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN');
  };

  return (
    <Card className="border-rebuild-purple/20 shadow-lg bg-white/90 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-rebuild-purple text-xl">Pay with UPI</CardTitle>
        <CardDescription>
          {paymentDescription || `Your total amount: ₹${formatCurrency(amount)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-2">
        {qrUrl ? (
          <div className="mb-4 p-4 bg-white rounded-lg border border-rebuild-purple/20">
            <img 
              src={qrUrl} 
              alt="UPI QR Code" 
              loading="lazy"
              width="224"
              height="224"
              className="mx-auto w-56 h-56 object-contain" 
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rebuild-purple"></div>
          </div>
        )}
        
        {/* Payment details preview - show what will appear in UPI app */}
        <div className="mb-4 w-full">
          <p className="text-sm text-gray-500 mb-1 text-center">Payment details:</p>
          <div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-200">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">Rebuild Women</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Original:</span>
                <span className="font-medium">₹{formatCurrency(originalPrice)}</span>
              </div>
              {couponCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon:</span>
                  <span className="font-medium text-green-600">{couponCode}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 mt-1 pt-1">
                <span className="text-gray-700 font-medium">Final Amount:</span>
                <span className="font-bold text-rebuild-purple">₹{formatCurrency(amount)}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 text-center italic">
            This information will appear in your UPI payment app
          </p>
        </div>
        
        <div className="mb-4 w-full text-center">
          <p className="text-sm text-gray-500 mb-1">UPI ID:</p>
          <div className="flex items-center justify-center gap-2">
            <code className="bg-gray-100 px-3 py-1 rounded text-gray-800">{upiID}</code>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyUpiId}
              className="text-xs"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 pt-0">
        {/* Fixed UPI button with high contrast styling */}
        <Button 
          className="w-full bg-gym-yellow text-black font-bold py-6 px-4 rounded-md hover:bg-gym-yellow/90 hover:shadow-[0_0_15px_rgba(255,243,24,0.6)] transition-all duration-300"
          onClick={() => window.open(`${upiString}`, "_blank")}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L2.869 16.629 12 21.693l9.131-5.064L12 0zm0 19.813l-7.143-3.971L12 2.867l7.143 12.975L12 19.813z"/>
          </svg>
          PAY WITH UPI APP
        </Button>
        
        {onComplete && (
          <Button 
            variant="outline" 
            className="w-full border-rebuild-purple text-rebuild-purple hover:bg-rebuild-purple/10" 
            onClick={onComplete}
          >
            I've Completed Payment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Helper function to format the UPI description - prioritizing critical information first
function formatUpiDescription(
  userName: string, 
  serviceName: string, 
  originalPrice: number, 
  finalPrice: number, 
  couponCode?: string
): string {
  // Extract first name for shorter display
  const firstName = userName.split(' ')[0];
  
  // Shorten service name if too long
  const shortServiceName = serviceName.length > 10 ? 
    serviceName.substring(0, 10) : serviceName;
  
  // Create description with most important info first
  // This ensures critical payment details are visible even if truncated
  let description = `${firstName} is sending ₹${finalPrice} to Rebuild Women`;
  
  // Add service name without any separator that might cause display issues
  description += ` for ${shortServiceName}`;
  
  // Add coupon info at the end, which is okay if truncated
  if (couponCode && originalPrice !== finalPrice) {
    // Add savings amount information
    const savings = originalPrice - finalPrice;
    description += ` (${couponCode} saved ₹${savings})`;
  }
  
  return description;
}

export default UPIQRCode;
