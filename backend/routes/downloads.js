const express = require('express');
const router = express.Router();
const multer = require('multer');
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// GET all downloads
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = supabasePublic.from('downloads').select('*').order('upload_date', { ascending: false });
        if (category) query = query.eq('category', category);

        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch downloads' });
    }
});

// POST new download
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!req.file) return res.status(400).json({ error: 'File is required' });

        const filename = `dl_${Date.now()}_${req.file.originalname}`;
        const { error: uploadError } = await supabaseAdmin.storage
            .from('uploads')
            .upload(`downloads/${filename}`, req.file.buffer, { contentType: req.file.mimetype });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(`downloads/${filename}`);

        const { data, error } = await supabaseAdmin
            .from('downloads')
            .insert([{ title, category: category || 'General', file_path: urlData.publicUrl }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add download' });
    }
});

// DELETE download
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabaseAdmin.from('downloads').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete download' });
    }
});

// UPDATE download info
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, category } = req.body;
        const { data, error } = await supabaseAdmin
            .from('downloads')
            .update({ title, category })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update download' });
    }
});

module.exports = router;
