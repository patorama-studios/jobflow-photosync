
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileType } from "./types";

interface AvatarSectionProps {
  profile: ProfileType;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType>>;
  loading: boolean;
}

export function AvatarSection({ profile, setProfile, loading }: AvatarSectionProps) {
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
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
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
  );
}
