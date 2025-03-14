import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileType } from "@/hooks/types/user-settings-types";

export function UserProfileSettings() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No user found');
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        // Transform to match our ProfileType format
        const profileData: ProfileType = {
          id: data.id,
          firstName: data.full_name?.split(' ')[0] || '',
          lastName: data.full_name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',  // Get email from the auth user object
          phoneNumber: data.phone || '',
          title: data.role || '',
          avatar: data.avatar_url || '',
          full_name: data.full_name || '',
          role: data.role || 'user'
        };
        
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (field: keyof ProfileType, value: string) => {
    if (!profile) return;
    
    if (field === 'firstName' || field === 'lastName') {
      const newFirstName = field === 'firstName' ? value : profile.firstName;
      const newLastName = field === 'lastName' ? value : profile.lastName;
      const newFullName = `${newFirstName} ${newLastName}`.trim();
      
      setProfile({
        ...profile,
        [field]: value,
        full_name: newFullName
      });
    } else {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  // Save profile
  const saveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phoneNumber,
          role: profile.title || profile.role,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center p-4">
        <p>No profile found. Please log in again.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={profile.firstName} 
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={profile.lastName} 
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={profile.email} 
              disabled 
              type="email"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if you need to update your email.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              value={profile.phoneNumber} 
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              type="tel"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input 
              id="title" 
              value={profile.title} 
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input 
              id="role" 
              value={profile.role} 
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Roles can only be changed by administrators.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={saveProfile} 
              disabled={saving}
            >
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
      </CardContent>
    </Card>
  );
}
