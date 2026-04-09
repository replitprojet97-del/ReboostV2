import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[SUPABASE] Missing credentials - PDF preview won\'t work');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Generate presigned upload URL for client
export async function generateUploadUrl(fileName: string, fileType: string) {
  try {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const storagePath = `chat-uploads/${timestamp}-${randomId}-${fileName}`;
    
    // Server-side generation of presigned URL for frontend
    const { data, error } = await supabase.storage
      .from('chat-files')
      .createSignedUploadUrl(storagePath);

    if (error) {
      console.error('[SUPABASE] Upload URL generation failed:', error);
      throw error;
    }

    return {
      uploadUrl: data?.signedUrl,
      storagePath,
      token: data?.token,
    };
  } catch (error) {
    console.error('[SUPABASE] Error generating upload URL:', error);
    throw error;
  }
}

// Generate presigned download/preview URL
export async function generateDownloadUrl(storagePath: string) {
  try {
    const { data, error } = await supabase.storage
      .from('chat-files')
      .createSignedUrl(storagePath, 3600); // 1 hour validity

    if (error) {
      console.error('[SUPABASE] Download URL generation failed:', error);
      throw error;
    }

    return data?.signedUrl;
  } catch (error) {
    console.error('[SUPABASE] Error generating download URL:', error);
    throw error;
  }
}

// Upload file from backend (fallback)
export async function uploadFile(fileName: string, fileBuffer: Buffer, fileType: string) {
  try {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const storagePath = `chat-uploads/${timestamp}-${randomId}-${fileName}`;

    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(storagePath, fileBuffer, {
        contentType: fileType,
        upsert: false,
      });

    if (error) {
      console.error('[SUPABASE] File upload failed:', error);
      throw error;
    }

    return {
      storagePath: data?.path,
      fileName,
    };
  } catch (error) {
    console.error('[SUPABASE] Error uploading file:', error);
    throw error;
  }
}

// Delete file
export async function deleteFile(storagePath: string) {
  try {
    const { error } = await supabase.storage
      .from('chat-files')
      .remove([storagePath]);

    if (error) {
      console.error('[SUPABASE] File deletion failed:', error);
      throw error;
    }
  } catch (error) {
    console.error('[SUPABASE] Error deleting file:', error);
    throw error;
  }
}
