/**
 * SVES College Website - Admissions API Routes
 * Handles admission form submissions and admin viewing
 */

const express = require('express');
const router = express.Router();
const { supabasePublic, supabaseAdmin } = require('../config/supabase');
const authenticateToken = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * POST /api/admissions
 * Submit a new admission application (Public)
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, course, academic_background } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !course) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Name, email, phone, and course are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate phone (10+ digits)
        const cleanPhone = phone.replace(/[\s\-\+]/g, '');
        if (cleanPhone.length < 10 || !/^\d+$/.test(cleanPhone)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        // Map course code to full name
        const courseNames = {
            'bca': 'Bachelor of Computer Applications (BCA)',
            'bcom': 'Bachelor of Commerce (B.Com)',
            'ba': 'Bachelor of Arts (BA)',
            'bsc': 'Bachelor of Science (B.Sc)'
        };
        const courseName = courseNames[course.toLowerCase()] || course;

        // Insert into database
        const { data, error } = await supabaseAdmin
            .from('admission_applications')
            .insert([{
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                course: courseName,
                academic_background: academic_background?.trim() || null,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            // Check for duplicate email
            if (error.code === '23505') {
                return res.status(400).json({
                    error: 'An application with this email already exists'
                });
            }
            throw error;
        }

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: data.id
        });

    } catch (error) {
        console.error('Admission submission error:', error);
        res.status(500).json({ error: 'Failed to submit application. Please try again.' });
    }
});

// ============================================
// ADMIN ROUTES (Protected)
// ============================================

/**
 * GET /api/admissions
 * Get all admission applications (Admin only)
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { status, course, search, limit = 50, offset = 0 } = req.query;

        let query = supabaseAdmin
            .from('admission_applications')
            .select('*', { count: 'exact' })
            .order('submitted_at', { ascending: false });

        // Apply filters
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (course && course !== 'all') {
            query = query.ilike('course', `%${course}%`);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            applications: data,
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

    } catch (error) {
        console.error('Get admissions error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

/**
 * GET /api/admissions/stats
 * Get application statistics (Admin only)
 */
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // Get counts by status
        const { data: pending } = await supabaseAdmin
            .from('admission_applications')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending');

        const { data: contacted } = await supabaseAdmin
            .from('admission_applications')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'contacted');

        const { data: admitted } = await supabaseAdmin
            .from('admission_applications')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'admitted');

        const { data: rejected } = await supabaseAdmin
            .from('admission_applications')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'rejected');

        const { count: total } = await supabaseAdmin
            .from('admission_applications')
            .select('id', { count: 'exact', head: true });

        // Get today's applications
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: todayCount } = await supabaseAdmin
            .from('admission_applications')
            .select('id', { count: 'exact', head: true })
            .gte('submitted_at', today.toISOString());

        res.json({
            total: total || 0,
            pending: pending?.length || 0,
            contacted: contacted?.length || 0,
            admitted: admitted?.length || 0,
            rejected: rejected?.length || 0,
            today: todayCount || 0
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

/**
 * PUT /api/admissions/:id
 * Update application status (Admin only)
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const validStatuses = ['pending', 'contacted', 'admitted', 'rejected'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status',
                validStatuses
            });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.admin_notes = notes;
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabaseAdmin
            .from('admission_applications')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json({
            success: true,
            message: 'Application updated successfully',
            application: data
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Failed to update application' });
    }
});

/**
 * DELETE /api/admissions/:id
 * Delete an application (Admin only)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabaseAdmin
            .from('admission_applications')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Application deleted successfully'
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete application' });
    }
});

module.exports = router;
