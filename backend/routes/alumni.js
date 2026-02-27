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

// GET all alumni
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabasePublic
            .from('alumni')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch alumni' });
    }
});

// POST new alumni
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, batch, story, designation } = req.body;
        let publicUrl = null;

        if (req.file) {
            const filename = `alumni_${Date.now()}_${req.file.originalname}`;
            const { data, error } = await supabaseAdmin.storage
                .from('uploads')
                .upload(`alumni/${filename}`, req.file.buffer, { contentType: req.file.mimetype });

            if (error) throw error;
            const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(`alumni/${filename}`);
            publicUrl = urlData.publicUrl;
        }

        const { data, error } = await supabaseAdmin
            .from('alumni')
            .insert([{ name, batch, story, designation, image_path: publicUrl }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add alumni story' });
    }
});

// PUT update alumni
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, batch, story, designation } = req.body;
        const updateData = { name, batch, story, designation };

        if (req.file) {
            const filename = `alumni_${Date.now()}_${req.file.originalname}`;
            await supabaseAdmin.storage.from('uploads').upload(`alumni/${filename}`, req.file.buffer, { contentType: req.file.mimetype });
            const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(`alumni/${filename}`);
            updateData.image_path = urlData.publicUrl;
        }

        const { data, error } = await supabaseAdmin
            .from('alumni')
            .update(updateData)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update alumni' });
    }
});

// DELETE alumni
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabaseAdmin.from('alumni').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete alumni' });
    }
});

module.exports = router;
