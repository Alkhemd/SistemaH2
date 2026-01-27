const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Upload image to Supabase Storage
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const bucket = req.body.bucket || 'imagenes_equipo';
        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return res.status(500).json({ error: 'Failed to upload image', details: uploadError.message });
        }

        // Get public URL
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return res.json({
            success: true,
            url: data.publicUrl,
            fileName: fileName
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Delete image from Supabase Storage
router.delete('/delete', async (req, res) => {
    try {
        const { imageUrl, bucket = 'imagenes_equipo' } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        // Extract file path from URL
        const urlParts = imageUrl.split(`/${bucket}/`);
        if (urlParts.length < 2) {
            return res.status(400).json({ error: 'Invalid image URL format' });
        }

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Supabase delete error:', error);
            return res.status(500).json({ error: 'Failed to delete image', details: error.message });
        }

        return res.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
