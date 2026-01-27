// SECURE: All storage operations go through backend API
// Backend handles Supabase credentials securely

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const uploadImage = async (file: File, bucket: string = 'imagenes_equipo'): Promise<string | null> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);

        const response = await fetch(`${API_URL}/storage/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error uploading image:', error);
            return null;
        }

        const result = await response.json();
        return result.url;
    } catch (error) {
        console.error('Error in uploadImage:', error);
        return null;
    }
}

export const deleteImage = async (imageUrl: string, bucket: string = 'imagenes_equipo'): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/storage/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl, bucket }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error deleting image:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteImage:', error);
        return false;
    }
};
