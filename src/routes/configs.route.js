import { Router } from 'express';
import { fetchConfigByDroneId, pickConfigFields } from '../services/config.service.js';

const router = Router();

router.get('/:droneId', async (req, res) => {
    try {
        const { droneId } = req.params;

        // กัน input แปลก ๆ
        if (!/^\d+$/.test(String(droneId))) {
            return res.status(400).json({ error: 'droneId must be a number' });
        }

        const cfg = await fetchConfigByDroneId(droneId);
        if (!cfg) return res.status(404).json({ error: 'Drone config not found' });

        return res.json(pickConfigFields(cfg));
    } catch (err) {
        console.error('GET /configs error', err?.response?.data || err.message);
        return res.status(502).json({ error: 'Upstream (Server1) error' });
    }
});

export default router;
