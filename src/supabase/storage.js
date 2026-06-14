import { supabase, isMockSupabase } from './supabaseClient';

export const uploadProductImage = async (file) => {
  if (isMockSupabase) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  } else {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
      
    return publicUrl;
  }
};
