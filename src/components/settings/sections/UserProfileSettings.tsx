
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function UserProfileSettings() {
  const [profile, setProfile] = useState({
    avatar_url: "",
    full_name: "",
    email: "",
    phone: "", // Added phone property with empty string default
    id: "",
    role: "",
    updated_at: "",
    username: ""
  });
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Fetch auth user info
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError) {
          throw authError;
        }
        
        // Fetch extended profile info
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Merge auth data with profile data
        setProfile({
          ...data,
          email: authUser.user?.email || '',
          phone: data.phone || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, []);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      // Update profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          username: profile.username,
          phone: profile.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload the image
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const avatar_url = data.publicUrl;
      
      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url })
        .eq('id', profile.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      setProfile(prev => ({ ...prev, avatar_url }));
      
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">User Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback>{profile.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="text-xl font-medium">{profile.full_name}</h3>
          <p className="text-muted-foreground mb-4">{profile.email}</p>
          
          <div>
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
            <label htmlFor="avatar-upload">
              <Button variant="outline" size="sm" asChild>
                <span>Change Avatar</span>
              </Button>
            </label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed directly. Please contact support.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="(123) 456-7890"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
