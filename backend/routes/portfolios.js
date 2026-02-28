const express = require('express');
const router = express.Router();
const multer = require('multer');
const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// Configure multer for RAM storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// @route   GET /api/portfolios
// @desc    Get all student portfolios (optionally filter by category)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        let query = supabasePublic
            .from('portfolios')
            .select('*')
            .order('created_at', { ascending: false });

        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Get portfolios error:', error);
        res.status(500).json({ error: 'Failed to fetch portfolios' });
    }
});

// @route   POST /api/portfolios
// @desc    Add new student portfolio
// @access  Private (Admin)
router.post('/', authMiddleware, upload.single('image_file'), async (req, res) => {
    try {
        const { student_name, student_course, title, description, category, project_link } = req.body;

        if (!student_name || !title || !description) {
            return res.status(400).json({ error: 'Student name, title and description are required' });
        }

        let publicUrl = null;

        if (req.file) {
            const filename = `portfolio_${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
            const filePath = `portfolios/${filename}`;

            const { error: uploadError } = await supabaseAdmin
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

        const validCategories = ['Web Development', 'Research Papers', 'Fine Arts', 'Commerce Projects', 'Social Work', 'Science', 'Other'];
        const safeCategory = validCategories.includes(category) ? category : 'Other';

        const { data, error } = await supabaseAdmin
            .from('portfolios')
            .insert([{
                student_name,
                student_course: student_course || '',
                title,
                description,
                category: safeCategory,
                project_link: project_link || null,
                image_path: publicUrl
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            message: 'Portfolio added successfully',
            portfolio: data
        });
    } catch (error) {
        console.error('Post portfolio error:', error);
        res.status(500).json({ error: 'Failed to add portfolio' });
    }
});

// @route   DELETE /api/portfolios/:id
// @desc    Delete a portfolio entry
// @access  Private (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { data: portfolio, error: fetchError } = await supabaseAdmin
            .from('portfolios')
            .select('image_path')
            .eq('id', req.params.id)
            .single();

        if (fetchError) throw fetchError;

        if (portfolio && portfolio.image_path) {
            const parts = portfolio.image_path.split('/uploads/');
            if (parts.length > 1) {
                await supabaseAdmin.storage.from('uploads').remove([parts[1]]);
            }
        }

        const { error: deleteError } = await supabaseAdmin
            .from('portfolios')
            .delete()
            .eq('id', req.params.id);

        if (deleteError) throw deleteError;

        res.json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        console.error('Delete portfolio error:', error);
        res.status(500).json({ error: 'Failed to delete portfolio' });
    }
});

module.exports = router;
