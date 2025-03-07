
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useClientPhoto(clientId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchClientPhoto = async () => {
    if (!clientId) return null;
    
    try {
      // First check if there's a photo record in the database
      const { data: photoData, error: photoError } = await supabase
        .from('client_photos')
        .select('photo_url')
        .eq('client_id', clientId)
        .eq('is_default', true)
        .maybeSingle();

      if (photoError) throw photoError;
      
      if (photoData?.photo_url) {
        setPhotoUrl(photoData.photo_url);
        return photoData.photo_url;
      }
      
      // If no dedicated photo record, check if client has photo_url
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('photo_url')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;
      
      setPhotoUrl(clientData?.photo_url || null);
      return clientData?.photo_url || null;
    } catch (err: any) {
      console.error("Error fetching client photo:", err);
      setError(err.message || 'Failed to fetch client photo');
      return null;
    }
  };

  const uploadClientPhoto = async (file: File) => {
    if (!clientId || !file) return null;
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${clientId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('client-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('client-photos')
        .getPublicUrl(filePath);
      
      const photoUrl = urlData.publicUrl;
      
      // Update or insert the client_photos record
      const { data: existingPhoto, error: checkError } = await supabase
        .from('client_photos')
        .select('id')
        .eq('client_id', clientId)
        .eq('is_default', true)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingPhoto) {
        // Update existing photo record
        const { error: updateError } = await supabase
          .from('client_photos')
          .update({ photo_url: photoUrl })
          .eq('id', existingPhoto.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new photo record
        const { error: insertError } = await supabase
          .from('client_photos')
          .insert([{ 
            client_id: clientId, 
            photo_url: photoUrl, 
            is_default: true 
          }]);
          
        if (insertError) throw insertError;
      }
      
      // Also update the client's photo_url for compatibility
      const { error: clientUpdateError } = await supabase
        .from('clients')
        .update({ photo_url: photoUrl })
        .eq('id', clientId);
        
      if (clientUpdateError) throw clientUpdateError;
      
      setPhotoUrl(photoUrl);
      toast.success("Photo uploaded successfully");
      return photoUrl;
    } catch (err: any) {
      console.error("Error uploading client photo:", err);
      setError(err.message || 'Failed to upload photo');
      toast.error(`Failed to upload photo: ${err.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    photoUrl,
    isUploading,
    error,
    fetchClientPhoto,
    uploadClientPhoto
  };
}
