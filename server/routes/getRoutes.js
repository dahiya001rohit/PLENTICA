const express = require('express');
const router = express.Router();
const { getLocationFarmPlan } = require('../services/Gemini');
const FarmPlan = require('../models/FarmPlan');
const auth = require('../middlewares/auth');

// POST /farm-plan - generate and save a farm plan
router.post('/farm-plan', auth, async (req, res) => {
    try {
        console.log('Received request for farm plan with data:', req.body);
        const data = await getLocationFarmPlan(req.body);

        // Save the plan to the database
        const farmPlan = await FarmPlan.create({
            userId: req.user.id,
            location: req.body.location,
            landSize: req.body.landSize,
            stats: data.stats || {},
            crops: data.crops || [],
            profits: data.profits || [],
            plantingGrid: data.plantingGrid || [],
            fields: data.fields || [],
            insights: data.insights || {},
            irrigation: data.irrigation || {},
            rawPlan: data,
        });

        res.json({ ...data, planId: farmPlan._id });
    } catch (error) {
        console.error('Error fetching location farm plan:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: 'Failed to fetch location farm plan', details: error.message });
    }
});

// GET /farm-plans - get all saved plans for the logged-in user
router.get('/farm-plans', auth, async (req, res) => {
    try {
        const plans = await FarmPlan.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ plans });
    } catch (error) {
        console.error('Error fetching farm plans:', error);
        res.status(500).json({ error: 'Failed to fetch farm plans' });
    }
});

// GET /farm-plan/:id - get a specific saved plan
router.get('/farm-plan/:id', auth, async (req, res) => {
    try {
        const plan = await FarmPlan.findOne({ _id: req.params.id, userId: req.user.id });
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        res.json({ plan });
    } catch (error) {
        console.error('Error fetching farm plan:', error);
        res.status(500).json({ error: 'Failed to fetch farm plan' });
    }
});

module.exports = router;