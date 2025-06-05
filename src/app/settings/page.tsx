"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { useTheme } from "next-themes";
import { Bell, MessageSquare, Palette } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Mock state

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleFeedback = () => {
    window.location.href = "mailto:feedback@affirmationoasis.app?subject=Feedback for Affirmation Oasis";
  };

  if (!mounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
         {/* Using Palette as a general settings icon */}
        <Palette className="w-8 h-8 text-primary" /> 
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" /> Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="theme-mode" className="text-base">
              Theme Mode
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm capitalize text-muted-foreground">{theme}</span>
              <ThemeToggleButton />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</CardTitle>
          <CardDescription>Manage your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="push-notifications" className="text-base">
              Daily Reminders
            </Label>
            <Switch
              id="push-notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              aria-label="Toggle push notifications"
            />
          </div>
           <p className="text-xs text-muted-foreground px-1">
            Note: Web push notifications are not fully implemented in this demo. This is a visual toggle.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Feedback</CardTitle>
          <CardDescription>We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleFeedback} className="w-full" variant="outline">
            Send Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
