import { Router } from 'express';
import { fetchConfigByDroneId, pickStatusField } from '../services/config.service.js';

const router = Router();

router.get('/:droneId', async (req, res) => {
    try {
        const { droneId } = req.params;
        if (!/^\d+$/.test(String(droneId))) {
            return res.status(400).json({ error: 'droneId must be a number' });
        }

        const cfg = await fetchConfigByDroneId(droneId);
        if (!cfg) return res.status(404).json({ error: 'Drone config not found' });

        return res.json(pickStatusField(cfg));
    } catch (err) {
        console.error('GET /status error', err?.response?.data || err.message);
        return res.status(502).json({ error: 'Upstream (Server1) error' });
    }
});

export default router;
