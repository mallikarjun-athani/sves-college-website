const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/admissions
// @desc    Submit a new admission application
// @access  Public
router.post('/', async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone,
            course_interest,
            previous_qualification,
            address,
            message
        } = req.body;

        // Validation
        if (!full_name || !email || !phone || !course_interest) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const { data, error } = await supabaseAdmin
            .from('admissions')
            .insert([{
                full_name,
                email,
                phone,
                course_interest,
                previous_qualification,
                address,
                message,
                status: 'pending',
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.error('Supabase error:', error);
            // If table doesn't exist, we might get an error. 
            // In a real scenario, we'd ensure table exists via migrations or manual setup.
            return res.status(500).json({ error: 'Database error occurred', details: error.message });
        }

        res.status(201).json({
            message: 'Application submitted successfully!',
            data: data
        });
    } catch (error) {
        console.error('Admission submission error:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// @route   GET /api/admissions
// @desc    Get all admission applications
// @access  Private (Admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('admissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data || []);
    } catch (error) {
        console.error('Fetch admissions error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// @route   PATCH /api/admissions/:id/status
// @desc    Update application status
// @access  Private (Admin)
router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('admissions')
            .update({ status })
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

module.exports = router;
