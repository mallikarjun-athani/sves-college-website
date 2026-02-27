const express = require('express');
const router = express.Router();
const multer = require('multer');
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// GET all stories
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('stories')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

// POST new story
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, category } = req.body;
        let publicUrl = null;

        if (req.file) {
            const filename = `story_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
            const { error: uploadError } = await supabaseAdmin.storage
                .from('uploads')
                .upload(`stories/${filename}`, req.file.buffer, { contentType: req.file.mimetype });

            if (uploadError) throw uploadError;
            const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(`stories/${filename}`);
            publicUrl = urlData.publicUrl;
        }

        const { data, error } = await supabaseAdmin
            .from('stories')
            .insert([{ title, content, author, category: category || 'General', image_path: publicUrl }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Story create error:', error);
        res.status(500).json({ error: 'Failed to add story' });
    }
});

// PUT update story
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, category } = req.body;
        const updateData = { title, content, author, category };

        if (req.file) {
            const filename = `story_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
            await supabaseAdmin.storage.from('uploads').upload(`stories/${filename}`, req.file.buffer, { contentType: req.file.mimetype });
            const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(`stories/${filename}`);
            updateData.image_path = urlData.publicUrl;
        }

        const { data, error } = await supabaseAdmin
            .from('stories')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update story' });
    }
});

// DELETE story
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabaseAdmin.from('stories').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete story' });
    }
});

module.exports = router;
