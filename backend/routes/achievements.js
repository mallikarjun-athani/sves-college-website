const express = require('express');
const router = express.Router();
const multer = require('multer');
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// Configure multer for RAM storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// @route   GET /api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('achievements')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

// @route   POST /api/achievements
// @desc    Add new achievement
// @access  Private (Admin)
router.post('/', authMiddleware, upload.single('image_file'), async (req, res) => {
    try {
        const { title, description, achievement_date } = req.body;

        if (!title || !description || !achievement_date) {
            return res.status(400).json({ error: 'Title, description, and date are required' });
        }

        let publicUrl = null;

        // Upload image if provided
        if (req.file) {
            const filename = `achievement_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
            const filePath = `achievements/${filename}`;

            const { data: uploadData, error: uploadError } = await supabaseAdmin
                .storage
                .from('uploads')
                .upload(filePath, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl: url } } = supabaseAdmin
                .storage
                .from('uploads')
                .getPublicUrl(filePath);

            publicUrl = url;
        }

        const { data, error } = await supabaseAdmin
            .from('achievements')
            .insert([{
                title,
                description,
                achievement_date,
                image_path: publicUrl
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: 'Achievement added successfully',
            achievement: data
        });
    } catch (error) {
        console.error('Post achievement error:', error);
        res.status(500).json({ error: 'Failed to add achievement' });
    }
});

// @route   DELETE /api/achievements/:id
// @desc    Delete achievement
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Find image path first
        const { data: achievement, error: fetchError } = await supabaseAdmin
            .from('achievements')
            .select('image_path')
            .eq('id', req.params.id)
            .single();

        if (fetchError) throw fetchError;

        if (achievement && achievement.image_path) {
            const parts = achievement.image_path.split('/uploads/');
            if (parts.length > 1) {
                const storagePath = parts[1];
                await supabaseAdmin.storage.from('uploads').remove([storagePath]);
            }
        }

        const { error: deleteError } = await supabaseAdmin
            .from('achievements')
            .delete()
            .eq('id', req.params.id);

        if (deleteError) throw deleteError;

        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        console.error('Delete achievement error:', error);
        res.status(500).json({ error: 'Failed to delete achievement' });
    }
});

module.exports = router;
