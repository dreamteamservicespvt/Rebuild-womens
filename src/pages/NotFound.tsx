import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Use a more structured error logging approach
    const errorInfo = {
      type: "Navigation Error",
      path: location.pathname,
      timestamp: new Date().toISOString(),
    };

    // Log to an error tracking service in production
    if (process.env.NODE_ENV === "production") {
      // In production, we would integrate with proper error tracking
      // Example: errorTrackingService.captureError(errorInfo);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gym-black flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gym-yellow mb-6">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-white/70 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
          asChild
        >
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
