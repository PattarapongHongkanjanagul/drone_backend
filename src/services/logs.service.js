// src/services/logs.service.js
import axios from 'axios';

const LOG_URL = process.env.LOG_URL;
const LOG_API_TOKEN = process.env.LOG_API_TOKEN;

if (!LOG_URL) throw new Error('LOG_URL is not set in .env');
if (!LOG_API_TOKEN) throw new Error('LOG_API_TOKEN is not set in .env');

function pbClient() {
    return axios.create({
        baseURL: LOG_URL,
        timeout: 10000,
        headers: { Authorization: `Bearer ${LOG_API_TOKEN}` }
    });
}

/**
 * ดึง logs ของ droneId จาก PocketBase
 * คืนเฉพาะ 5 ฟิลด์: drone_id, drone_name, created, country, celsius
 * เรียงใหม่สุดก่อน จำกัด perPage (ดีฟอลต์ 12) + รองรับ page
 */
export async function fetchLogsByDroneId(droneId, page = 1, perPage = 12) {
    const client = pbClient();

    const params = {
        filter: `(drone_id=${Number(droneId)})`,
        sort: '-created',
        page: Number(page) || 1,
        perPage: Number(perPage) || 12
    };

    const { data } = await client.get('', { params });
    const items = Array.isArray(data?.items) ? data.items : [];

    return items.map(x => ({
        drone_id: x.drone_id,
        drone_name: x.drone_name,
        created: x.created,
        country: x.country,
        celsius: x.celsius
    }));
}

/**
 * สร้าง log record ใหม่บน PocketBase
 * ต้องส่งไปแค่ 4 ฟิลด์: drone_id, drone_name, country, celsius
 */
export async function createLogRecord({ drone_id, drone_name, country, celsius }) {
    const client = pbClient();

    const payload = {
        drone_id: Number(drone_id),
        drone_name: String(drone_name),
        country: String(country),
        celsius: Number(celsius)
    };

    const { data } = await client.post('', payload);

    return {
        drone_id: data.drone_id,
        drone_name: data.drone_name,
        country: data.country,
        celsius: data.celsius,
        created: data.created
    };
}
