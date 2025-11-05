import { Router } from 'express';
import { fetchLogsByDroneId, createLogRecord } from '../services/logs.service.js';

const router = Router();

// debug middleware — ใส่แค่ชั่วคราว
router.use((req, _res, next) => {
    console.log('[LOGS ROUTER]', req.method, req.originalUrl);
    console.log('headers:', req.headers['content-type']);
    console.log('body:', req.body);
    next();
});

// (แค่ไว้เตือนเวลาเรียก GET /logs เฉยๆ)
router.get('/', (req, res) => {
    res.status(400).json({ error: 'Please POST /logs or GET /logs/:droneId' });
});

// ✅ ดึงรายการ logs
router.get('/:droneId', async (req, res) => {
    try {
        const { droneId } = req.params;
        const { page = 1, perPage = 12 } = req.query;
        if (!/^\d+$/.test(String(droneId))) {
            return res.status(400).json({ error: 'droneId must be a number' });
        }
        const rows = await fetchLogsByDroneId(droneId, page, perPage);
        return res.json(rows); // [] ก็ได้ ไม่จำเป็นต้อง 404
    } catch (err) {
        console.error('GET /logs/:droneId error', err?.response?.data || err.message);
        return res.status(502).json({ error: 'Upstream (Server2) error' });
    }
});

// ✅ สร้าง log (รับแค่ 4 ฟิลด์)
router.post('/', async (req, res) => {
    try {
        const { drone_id, drone_name, country, celsius } = req.body || {};
        const missing = (drone_id === undefined) || !drone_name || !country || (celsius === undefined);
        if (missing) return res.status(400).json({ error: 'Missing required fields (drone_id, drone_name, country, celsius)' });
        if (Number.isNaN(Number(drone_id)) || Number.isNaN(Number(celsius))) {
            return res.status(400).json({ error: 'drone_id and celsius must be numeric' });
        }
        const created = await createLogRecord({
            drone_id: Number(drone_id),
            drone_name: String(drone_name),
            country: String(country),
            celsius: Number(celsius)
        });
        return res.status(201).json(created);
    } catch (err) {
        console.error('POST /logs error', err?.response?.data || err.message);
        return res.status(502).json({ error: 'Upstream (Server2) error' });
    }
});

export default router;
