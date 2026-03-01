const express = require('express');
const router = express.Router();
const { getLocationFarmPlan } = require('../services/Gemini');

router.post('/farm-plan', async (req, res) => {
    try {
        console.log('Received request for farm plan with data:', req.body);
        const data = await getLocationFarmPlan(req.body);
        res.json(data);
    } catch (error) {
        console.error('Error fetching location farm plan:', error);
        res.status(500).json({ error: 'Failed to fetch location farm plan' });
    }
});



module.exports = router;