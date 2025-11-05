// src/services/config.service.js
import axios from 'axios';

const CONFIG_URL = process.env.CONFIG_URL;
if (!CONFIG_URL) throw new Error('CONFIG_URL is not set in .env');

// ดึงข้อมูลดิบจาก Server 1 พร้อม debug logs (เปิด/ปิดได้)
const DEBUG_SERVER1 = process.env.DEBUG_SERVER1 === '1';

/**
 * คืน array ของ config ไม่ว่าจะอยู่ใต้ data/items หรือ root
 * โค้ดนี้จะพยายามเดา keys ยอดฮิต (items, data, list)
 */
export async function fetchAllConfigs() {
    const { data } = await axios.get(CONFIG_URL, { timeout: 15000 });

    if (DEBUG_SERVER1) {
        // ดูรูปหน้าตา response ครั้งแรก ๆ จะช่วยมาก
        console.log('[Server1 raw keys] =>', Object.keys(typeof data === 'object' ? data : {}));
        if (Array.isArray(data)) console.log('[Server1] root is array, length=', data.length);
        if (Array.isArray(data?.items)) console.log('[Server1] items length=', data.items.length);
        if (Array.isArray(data?.data)) console.log('[Server1] data length=', data.data.length);
        if (Array.isArray(data?.list)) console.log('[Server1] list length=', data.list.length);
    }

    // ลองหลายทาง
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.list)) return data.list;

    // กรณีเป็น object เดียว (เช่นเป็น record เดียว)
    if (data && typeof data === 'object' && data.drone_id) return [data];

    // สุดท้ายหา array ไม่เจอ → คืนว่าง
    return [];
}

/**
 * หา config ตาม droneId (ตัวเลขหรือสตริงก็ได้)
 * - แปลง id เป็น number แล้วจับคู่แบบหลวม ๆ
 */
export async function fetchConfigByDroneId(droneId) {
    const idNum = Number(droneId);
    const list = await fetchAllConfigs();

    // normalize เปรียบเทียบแบบหลวม: 3001 == "3001"
    const found = list.find((x) => Number(x?.drone_id) === idNum);
    return found || null;
}

/** map สำหรับ /configs/:droneId */
export function pickConfigFields(cfg) {
    return {
        drone_id: Number(cfg.drone_id),
        drone_name: String(cfg.drone_name ?? ''),
        light: String(cfg.light ?? ''),
        country: String(cfg.country ?? ''),
        weight: Number(cfg.weight ?? 0)
    };
}

/** map สำหรับ /status/:droneId */
export function pickStatusField(cfg) {
    return { condition: String(cfg.condition ?? '') };
}
