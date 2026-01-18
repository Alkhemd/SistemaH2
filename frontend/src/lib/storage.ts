import { supabase } from '@/lib/supabase';

export const uploadImage = async (file: File, bucket: string = 'imagenes_equipo'): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Error in uploadImage:', error);
        return null;
    }
}

export const deleteImage = async (imageUrl: string, bucket: string = 'imagenes_equipo'): Promise<boolean> => {
    try {
        // Extraer el path del archivo de la URL pública
        // Formato típico: .../storage/v1/object/public/{bucket}/{fileName}
        const urlParts = imageUrl.split(`/${bucket}/`);
        if (urlParts.length < 2) {
            console.error('Invalid image URL format');
            return false;
        }

        const filePath = urlParts[1]; // El resto es el path (ej: "archivo.jpg")

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting image:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteImage:', error);
        return false;
    }
};
