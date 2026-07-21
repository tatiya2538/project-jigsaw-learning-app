# project-jigsaw-learning-app

ศูนย์สื่อการเรียนรู้ดิจิทัลพระพุทธศาสนา

สื่อการเรียนรู้ดิจิทัลพระพุทธศาสนา สำหรับนักเรียนมัธยมต้น (Next.js + Tailwind CSS)

## เริ่มต้นใช้งาน

```bash
yarn install --ignore-engines
yarn dev
```

เปิดที่ [http://localhost:3000](http://localhost:3000)

## Scripts

- `yarn dev` — development server
- `yarn build` — production build
- `yarn start` — start production server

## เพิ่มบุคคลใหม่

ไม่ต้องแก้โค้ดทุกครั้ง — ใช้ Admin ได้เลย

1. เข้า `/admin` แล้วล็อกอิน
2. กรอกฟอร์ม **เพิ่มบุคคลใหม่** (ชื่อ + slug เช่น `ananda`)
3. ระบบจะสร้าง:
   - รายการใน `catalog.json` บน Blob
   - เนื้อหาเริ่มต้นใน `content/{slug}.json`
4. แต่งเนื้อหาในหน้าแก้ไข แล้วกดบันทึก
5. ใช้ปุ่ม **Active / Inactive** ในรายการ Admin เพื่อเปิด-ปิดการแสดงผลให้นักเรียน
6. ถ้ายังไม่มีไฟล์เสียง `.wav` ให้กด **สร้างเสียงจากชีวประวัติ** ในหน้าแก้ไข
7. อัปรูปไปที่ Blob path มาตรฐาน: `charactor/{slug}.webp`  
   (หรือใส่ URL รูปตอนสร้าง)

- **Active** = แสดงในหน้าแรกและเปิด URL ของบัตรได้
- **Inactive** = ซ่อนจากนักเรียน แต่แอดมินยังแก้ไขได้

หมายเหตุ: บุคคลที่มากับโปรเจกต์ยังมี seed ใน `src/data/` สำหรับรีเซ็ตจากไฟล์โค้ด

## Git branches

Branch หลักในเครื่องมักอยู่ที่ `main` และมี remote `origin/develop`

### สลับ branch

```bash
git switch main
git switch develop
```

### สร้าง branch ใหม่แล้วสลับไปเลย

```bash
git switch -c feature/tts-edge-cache
```

### สร้างจาก remote (เช่น develop)

```bash
git fetch origin
git switch -c feature/tts-edge-cache origin/develop
```

### ดึง branch จาก remote ที่ยังไม่มีในเครื่อง

```bash
git fetch origin
git switch develop
```
