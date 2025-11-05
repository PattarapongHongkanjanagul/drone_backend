# Drone API (Assignment #1)

API Server ด้วย Node.js + Express ที่เชื่อม **Server 1 (Drone Config Server)** และ **Server 2 (Drone Log Server/PocketBase)**  
- โค้ดวางบน GitHub และมี README อธิบายการรันตามข้อกำหนดงาน  
- ใช้ `.env` เก็บ URL/TOKEN ของ API ภายนอก (ไม่ hard-code)  
- Deploy ขึ้น cloud host ให้เรียกใช้งานได้จริง  

> Assignment ข้อกำหนด: README + ใช้ env + วางโค้ดบน GitHub + deploy cloud + เรียก 2 servers ที่กำหนดไว้ในงาน  

---

## 1) Requirements
- Node.js 18+
- ไฟล์ `.env` (ดู `.env.example` เป็นตัวอย่าง)

## 2) Setup
```bash
npm install
cp .env.example .env   # แล้วใส่ค่าจริง (LOG_API_TOKEN, ฯลฯ)
npm run dev            # โหมดพัฒนา (nodemon)
# หรือ
npm start              # โหมด production
