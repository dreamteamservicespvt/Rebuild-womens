
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/contexts/FirebaseContext";

const Login = () => {
  const { user } = useFirebase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("govardhan5009@gmail.com");
  const [password, setPassword] = useState("govardhan5009@gmail.com");
  const [loading, setLoading] = useState(false);

  // Redirect to admin if already logged in
  if (user || localStorage.getItem("isLoggedIn") === "true") {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if the credentials match the hardcoded values
    if (email === "govardhan5009@gmail.com" && password === "govardhan5009@gmail.com") {
      // Set local storage to indicate user is logged in
      localStorage.setItem("isLoggedIn", "true");
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      
      // Artificial delay to simulate authentication
      setTimeout(() => {
        setLoading(false);
        // Redirect to admin page
        navigate("/admin");
      }, 1000);
    } else {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your email and password and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rebuild-purple">Rebuild Fitness</h1>
          <p className="text-gray-600">Admin Login</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/" className="text-rebuild-purple hover:underline">
            Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
