import { useState, useEffect } from "react";
import { useFirebase, FooterSettings } from "@/contexts/FirebaseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const FooterSettingsManager = () => {
  const { getFooterSettings, updateFooterSettings } = useFirebase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<FooterSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getFooterSettings();
        setSettings(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load footer settings",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [getFooterSettings, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!settings) return;
    
    // Handle nested socialLinks properties
    if (name.startsWith("socialLinks.")) {
      const socialLinkKey = name.split(".")[1] as keyof typeof settings.socialLinks;
      setSettings({
        ...settings,
        socialLinks: {
          ...settings.socialLinks,
          [socialLinkKey]: value
        }
      });
    } else {
      // Handle top-level properties
      setSettings({
        ...settings,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings) return;
    
    setSaving(true);
    try {
      // Important: Make sure to remove any undefined values that might cause Firebase errors
      const cleanedSettings = { ...settings };
      Object.entries(cleanedSettings.socialLinks).forEach(([key, value]) => {
        if (!value) {
          delete cleanedSettings.socialLinks[key as keyof typeof cleanedSettings.socialLinks];
        }
      });
      
      await updateFooterSettings(cleanedSettings);
      
      toast({
        title: "Success",
        description: "Footer settings updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update footer settings",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-gym-yellow" />
      </div>
    );
  }

  return (
    <div className="bg-gym-gray-dark border border-gym-gray-light rounded-lg shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Footer Settings</CardTitle>
        <CardDescription className="text-white/70">
          Manage the content displayed in the website footer.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general">
          <div className="px-6 border-b border-gym-gray-light">
            <TabsList className="bg-gym-gray">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="general" className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="brandName" className="text-white">Brand Name</Label>
                <Input
                  id="brandName"
                  name="brandName"
                  value={settings?.brandName || ""}
                  onChange={handleChange}
                  className="bg-gym-gray text-white border-gym-gray-light"
                  placeholder="E.g., Rebuild Women's"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-white">Contact Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={settings?.phone || ""}
                  onChange={handleChange}
                  className="bg-gym-gray text-white border-gym-gray-light"
                  placeholder="+91 9618361999"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white">Contact Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={settings?.email || ""}
                  onChange={handleChange}
                  className="bg-gym-gray text-white border-gym-gray-light"
                  placeholder="contact@rebuild.com"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="socialLinks.instagram" className="text-white">Instagram URL</Label>
                <Input
                  id="socialLinks.instagram"
                  name="socialLinks.instagram"
                  value={settings?.socialLinks?.instagram || ""}
                  onChange={handleChange}
                  className="bg-gym-gray text-white border-gym-gray-light"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
              
              <div>
                <Label htmlFor="socialLinks.facebook" className="text-white">Facebook URL</Label>
                <Input
                  id="socialLinks.facebook"
                  name="socialLinks.facebook"
                  value={settings?.socialLinks?.facebook || ""}
                  onChange={handleChange}
                  className="bg-gym-gray text-white border-gym-gray-light"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div>
                <Label htmlFor="socialLinks.youtube" className="text-white">YouTube URL</Label>
                <Input
                  id="socialLinks.youtube"
                  name="socialLinks.youtube"
                  value={settings?.socialLinks?.youtube || ""}
                  onChange={handleChange}
                  className="bg-gym-gray text-white border-gym-gray-light"
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
              
              <div>
                <Label htmlFor="socialLinks.whatsapp" className="text-white">WhatsApp Link</Label>
                <Input
                  id="socialLinks.whatsapp"
                  name="socialLinks.whatsapp"
                  value={settings?.socialLinks?.whatsapp || ""}
                  onChange={handleChange}
                  className="bg-gym-gray text-white border-gym-gray-light"
                  placeholder="https://wa.me/919618361999"
                />
              </div>
              
              <div>
                <Label htmlFor="socialLinks.x" className="text-white">Twitter/X URL</Label>
                <Input
                  id="socialLinks.x"
                  name="socialLinks.x"
                  value={settings?.socialLinks?.x || ""}
                  onChange={handleChange}
                  className="bg-gym-gray text-white border-gym-gray-light"
                  placeholder="https://x.com/yourprofile"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-end border-t border-gym-gray-light p-6 bg-gym-gray/30">
          <Button 
            type="submit"
            disabled={saving}
            className="bg-gym-yellow text-black hover:bg-gym-yellow/90"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default FooterSettingsManager;
