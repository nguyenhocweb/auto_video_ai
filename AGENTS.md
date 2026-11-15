# Project Instructions & Coding Standards

## 📌 1. Quy chuẩn bắt buộc khi viết code Python Backend

Khi phát triển, thiết kế, triển khai hoặc chỉnh sửa mã nguồn backend Python (FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, MongoDB, Prisma) trong thư mục `be/`, **BẮT BUỘC** phải tuân thủ nghiêm ngặt chuẩn kiến trúc đã được quy định tại:
👉 [python-backend-architecture](file:///d:/DuAnCaNhan/video_ai/.agents/skills/python-backend-architecture/SKILL.md)

### Tóm tắt các nguyên tắc cốt lõi:
1. **Quy định tên thư mục Backend và vị trí Code:**
   - Thư mục backend duy nhất của dự án là `be/`.
   - **Mọi mã nguồn backend BẮT BUỘC phải nằm trong `be/src/`** (tương tự như `fe/src/` ở frontend).
   - **TUYỆT ĐỐI CẤM** tạo thư mục `backend/` hoặc thư mục `app/` (Cấm dùng `be/app/`, chỉ dùng `be/src/`).
   - Cấu trúc cơ sở dữ liệu (Prisma multi-file schema, seeders, connection script) bắt buộc đặt tại: `be/src/databases/`.
     - `be/src/databases/prisma/schema/` (chứa các file `.prisma` con).
     - `be/src/databases/seed/` (chứa scripts seeder và json data).
     - `be/src/databases/init.mongodb.js` (instance kết nối Prisma Client).
   - Entry point chính của ứng dụng: `be/src/main.py` (khởi động bằng `uvicorn src.main:app`).
2. **Mô hình Role-based Modular Architecture:**
   - Phân cấp: `Role (src/modules/[role]/)` $\longrightarrow$ `Feature ([feature]/)` $\longrightarrow$ `Layer (router.py, schemas.py, service.py, repository.py)`.
   - Các module dùng chung (Shared) được đặt trong `src/modules/shared/`.
   - Hạ tầng kỹ thuật chung đặt trong `src/core/`.
3. **Quy tắc giao tiếp:** Service gọi Service. Tuyệt đối **CẤM** gọi chéo Router hoặc gọi chéo Repository giữa các module.
4. **Pythonic Idioms:**
   - **KHÔNG** xé nhỏ file theo từng CRUD (như `.create.py`, `.get.py`).
   - Gom theo Entity Module (`router.py`, `schemas.py`, `service.py`, `repository.py`).
5. **Các điều cấm kỵ:**
   - CẤM tạo thư mục `backend/` trùng lặp hoặc thư mục `app/` (Toàn bộ code BẮT BUỘC nằm trong `be/src/`).
   - CẤM truy vấn CSDL trong Router.
   - CẤM hardcode credentials (luôn dùng `pydantic-settings`).
   - CẤM bỏ qua type hinting.
   - CẤM mutable default arguments (`items=[]`).
   - CẤM tạo file kiểm thử, debug, probe (`test_*.py`, `inspect_*.py`, `debug_*.py`) nằm tự do ở thư mục gốc `be/` (BẮT BUỘC đặt trong `be/tests/`).
   - CẤM để file code xử lý nghiệp vụ/tiện ích nằm tự do ở thư mục gốc `be/` (như `be/inspect_headers.py`). Mọi file dùng chung đa vai trò BẮT BUỘC đặt trong `be/src/modules/shared/` hoặc `be/src/core/`.

---

## 📌 2. Quy chuẩn bắt buộc khi viết code Frontend (Next.js)

Khi phát triển, thiết kế, triển khai hoặc chỉnh sửa mã nguồn frontend Next.js (React Query, Tailwind CSS, Zod, TypeScript) trong thư mục `fe/`, **BẮT BUỘC** phải tuân thủ nghiêm ngặt chuẩn kiến trúc đã được quy định tại:
👉 [frontend-nextjs-architecture](file:///d:/DuAnCaNhan/video_ai/.agents/skills/frontend-nextjs-architecture/SKILL.md)

### Tóm tắt các nguyên tắc cốt lõi:
1. **Mô hình Role-based Feature-Sliced Design with Granular SRP:**
   - Phân cấp: `Role (fe/src/features/[role]/)` $\longrightarrow$ `Feature ([feature]/)` $\longrightarrow$ `Layer (component/, hook/, service/, schema/, type/, constants/)` $\longrightarrow$ `Action (CRUD chia nhỏ)`.
   - Các tính năng dùng chung đặt trong `fe/src/features/shared/`.
   - Hạ tầng kỹ thuật, wrapper, layout toàn cục đặt trong `fe/src/core/`.
   - Routing `fe/src/app/` giữ ở mức mỏng tối đa, chỉ làm nhiệm vụ layout và mount component, không chứa logic form hay fetch API phức tạp.
2. **Nguyên tắc Granular SRP (Single Responsibility Principle):**
   - **CẤM gộp chung tất cả vào 1 component hoặc 1 hook.**
   - Component: `List.tsx`, `CreateForm.tsx`, `UpdateForm.tsx`, `DetailModal.tsx`, `StatsCards.tsx`.
   - Hook: `useGet...ts`, `useCreate...ts`, `useUpdate...ts`, `useDelete...ts`.
   - Service: `[feature].get.service.ts`, `[feature].create.service.ts`,...
3. **9 Điều cấm kỵ tuyệt đối ở Frontend:**
   - CẤM dùng icon từ `lucide-react` (chỉ dùng `react-icons`).
   - CẤM gọi `axiosClient` trong Component (phải qua React Query `hook/`).
   - CẤM import named export `axiosClient` (luôn dùng `import axiosClient from "@/src/core/api/axios-instance"`).
   - CẤM dùng `window.confirm()` (bắt buộc dùng `<ConfirmModal>`).
   - CẤM quên Animation (mọi page/card lớn phải bọc trong `<FadeIn>`).
   - CẤM thiếu Pagination (bảng danh sách phải có phân trang và dropdown chọn rows per page).
   - CẤM quên `staleTime: 60 * 1000` trong `useQuery`.
   - CẤM hardcode `z.string()` (tái sử dụng `validator` trong `@/src/core/lib/validations.ts`).
   - CẤM import `date-fns` (dùng native `Date`).

---

## 📌 3. Chuẩn mực Thiết kế Giao diện & Thẩm mỹ UI/UX (Impeccable Design System)

Khi thiết kế, tạo mới màn hình, thẩm định (critique), làm đẹp (polish), tạo hoạt ảnh (animation) hoặc hoàn thiện giao diện người dùng, sử dụng bộ kỹ năng:
👉 [impeccable](file:///d:/DuAnCaNhan/video_ai/.agents/skills/impeccable/SKILL.md)

### Nguyên tắc thiết kế cốt lõi:
- **Triệt tiêu "AI Slop":** Không tạo các giao diện AI rập khuôn, nhàm chán (tránh gradient tím xanh lặp lại vô nghĩa, tránh lạm dụng card lồng trong card).
- **Phân định rõ Mode:**
  - *Persuade:* Landing page, marketing (táo bạo, giàu điểm nhấn, thuyết phục hành động).
  - *Operate:* Dashboard, admin, studio tool (tối ưu khả năng quét mắt, trật tự thông tin, tính tiện dụng).
  - *Read:* Tài liệu, hướng dẫn, blog (trọng tâm vào typography và trải nghiệm đọc).
- **Bộ công cụ đánh giá & tinh chỉnh:**
  - `critique`: Đánh giá UX theo thang điểm và tìm lỗi cảm nhận.
  - `audit`: Kiểm tra chất lượng kỹ thuật (responsive, accessibility a11y, contrast).
  - `polish`: Hoàn thiện chi tiết cuối cùng trước khi bàn giao.
  - `bolder` / `quieter`: Tăng/giảm độ tương phản và năng lượng thị giác của UI.
  - `animate`: Tích hợp chuyển động có mục đích, mượt mà và tinh tế.

---

## 📌 4. Quy tắc giới hạn độ dài file (File Length Constraint: Tối đa 300 dòng)

**QUY TẮC BẮT BUỘC CHO TOÀN BỘ DỰ ÁN (CẢ BACKEND `be/` VÀ FRONTEND `fe/`):**
1. **Giới hạn cứng:** Mọi file mã nguồn (`.py`, `.ts`, `.tsx`) **TUYỆT ĐỐI KHÔNG ĐƯỢC VƯỢT QUÁ 300 DÒNG**.
2. **Nguyên tắc tách file (Single Responsibility & Modularization):**
   - Khi một file đạt tiệm cận hoặc vượt quá 300 dòng, **BẮT BUỘC** phải tách các hàm, sub-components, helpers, sub-routers sang các file mới riêng biệt.
   - **Backend (`be/`):**
     - Router dài $\longrightarrow$ Chia thành các sub-routers (`training_router.py`, `synthesize_router.py`, `profile_router.py`) và gắn qua `router.include_router(...)`.
     - Service dài $\longrightarrow$ Tách logic xử lý nặng, worker, helper ra các module con (`model_loader.py`, `synthesizer.py`, `training_worker.py`).
   - **Frontend (`fe/`):**
     - Component/Modal dài $\longrightarrow$ Tách thành các sub-components nhỏ (`VoiceLongAudioForm.tsx`, `VoiceBoothRecorder.tsx`, `VoicePagination.tsx`,...).
     - Hook dài $\longrightarrow$ Tách riêng từng mutation/query hook theo Granular SRP.
3. **Cấm tuyệt đối:** CẤM gộp tất cả logic form, bảng, modal, helper vào một file duy nhất gây phình to khó đọc và khó bảo trì.

---

## 📌 5. Quy chuẩn bắt buộc về kiểm thử và thư mục Tests (Mandatory Test Folder Standard)

**QUY TẮC BẮT BUỘC CHO TOÀN BỘ DỰ ÁN:**
1. **Vị trí bắt buộc:** Mọi file kiểm thử, unit test, integration test, script probe/inspect/debug **BẮT BUỘC PHẢI NẰM TRONG THƯ MỤC `tests/`** (`be/tests/` đối với backend và `fe/tests/` đối với frontend).
2. **Cấu trúc phân mục `be/tests/` chuẩn:**
   - `be/tests/unit/`: Test các unit functions, schemas, logic xử lý chuỗi, validation.
   - `be/tests/integration/`: Test các API endpoints, database queries, authentication flows.
   - `be/tests/engines/`: Test các engine/adapter hạ tầng (Douyin extractor, crawler, OmniVoice synthesis, Cloudinary).
   - `be/tests/scratch/`: Dành cho các script probe, inspect headers/payloads tạm thời (phải tự động dọn dẹp hoặc chuyển thành test suite chuẩn sau khi kiểm thử).
3. **CẤM TUYỆT ĐỐI:**
   - **CẤM** tạo bất kỳ file `test_*.py`, `inspect_*.py`, `debug_*.py`, `scratch_*.py` nằm tự do trực tiếp ở thư mục gốc `be/` hoặc thư mục gốc dự án.
   - Mọi file test tạo sai vị trí ngoài `tests/` đều bị coi là vi phạm chuẩn kiến trúc nghiêm trọng và phải bị xóa hoặc chuyển vị trí ngay lập tức.

---

## 📌 6. Quy chuẩn tổ chức Module/File dùng chung đa vai trò (Multi-Role Shared Standards)

**QUY TẮC BẮT BUỘC KHI TÍCH HỢP CODE:**
1. **Nguyên tắc phân tầng Shared:** Khi tích hợp một chức năng, tiện ích, công cụ, hoặc service vào hệ thống mà có phạm vi sử dụng chung cho nhiều vai trò (Multi-role / All roles), **BẮT BUỘC** phải đưa vào đúng thư mục Shared theo cấp độ:
   - **Cấp độ Nghiệp vụ dùng chung (Shared Business Feature):** Đặt trong `be/src/modules/shared/[feature_name]/` (Backend) hoặc `fe/src/features/shared/[feature_name]/` (Frontend).
     - *Ví dụ:* `auth/`, `notifications/`, `cloudinary/`, `media/`, `llm/`.
   - **Cấp độ Hạ tầng kỹ thuật & Engine dùng chung (Technical Infra & Engines):** Đặt trong `be/src/core/` (Backend) hoặc `fe/src/core/` (Frontend).
     - *Ví dụ:* `be/src/core/engines/` (Douyin, OmniVoice), `be/src/core/utils/` (network inspect, helpers, pagination), `be/src/core/database_mongo.py`, `be/src/core/config.py`.
2. **Quy định đối với các file công cụ / tiện ích (Bài học từ trường hợp `be/inspect_headers.py`):**
   - **CẤM TUYỆT ĐỐI** để các file rời rạc nằm ngang hàng ở thư mục gốc `be/` (như file `be/inspect_headers.py`).
   - Nếu là công cụ inspect/network helper dùng chung $\longrightarrow$ Bắt buộc đặt trong `be/src/core/utils/` hoặc `be/src/core/engines/`.
   - Nếu là script test kiểm tra luồng $\longrightarrow$ Bắt buộc đặt trong `be/tests/`.
   - Mọi file mã nguồn thực thi của Backend chỉ được phép nằm bên trong `be/src/` (cho source code chính thức) hoặc `be/tests/` (cho test suite). Tuyệt đối cấm tạo thư mục `be/app/` hoặc để file mồ côi ngoài root.

---

## 📌 7. Quy chuẩn bắt buộc về Modal / Dialog / Section Overlay (Full Màn Hình & Căn Giữa Tuyệt Đối)

**QUY TẮC BẮT BUỘC KHI XÂY DỰNG GIAO DIỆN FRONTEND (NEXT.JS):**
1. **Bắt buộc Full màn hình (Full Viewport Overlay):**
   - Mọi Modal, Popup, Dialog, Drawer, Confirm, Overlay **BẮT BUỘC** lớp nền mờ (Backdrop overlay) phải phủ kín $100\%$ toàn bộ khung nhìn trình duyệt (`fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm`).
   - **TUYỆT ĐỐI CẤM** để modal bị cắt ngang, che khuất một phần, hoặc bị bó hẹp bên trong một container con (như `main`, `max-w-7xl`, `FadeIn`, card, div phân trang).
2. **Bắt buộc sử dụng React Portal (`createPortal(..., document.body)`):**
   - Mọi component Modal/Dialog **BẮT BUỘC** phải được mount trực tiếp ra thẻ `document.body` thông qua `createPortal` của `react-dom`.
   - *Nguyên nhân kỹ thuật:* Khi các component cha sử dụng CSS `transform`, `filter`, `perspective`, hoạt ảnh `<FadeIn>`, hoặc `overflow: hidden`, thuộc tính `position: fixed` của modal con sẽ bị cô lập bên trong thẻ cha thay vì toàn màn hình. Dùng `createPortal` triệt tiêu hoàn toàn lỗi này.
3. **Bắt buộc Section / Hộp thoại Modal phải nằm chính giữa màn hình (Perfect Center Alignment):**
   - Hộp thoại modal, popup hoặc section trung tâm **BẮT BUỘC PHẢI CĂN GIỮA TUYỆT ĐỐI** theo cả 2 trục ngang (X) và dọc (Y) (`flex items-center justify-center my-auto`).
   - Khoảng cách lề xung quanh tối thiểu `p-4` để đảm bảo giao diện hiển thị hoàn hảo trên cả Mobile, Tablet lẫn Desktop.

---

## 📌 8. Quy chuẩn bắt buộc về Múi giờ và Định dạng Ngày giờ (Vietnam Time Standard - UTC+7)

**QUY TẮC BẮT BUỘC CHO TOÀN BỘ DỰ ÁN (CẢ BACKEND `be/` VÀ FRONTEND `fe/`):**
1. **Múi giờ chuẩn duy nhất:**
   - Toàn bộ thời gian hiển thị trên giao diện người dùng và lưu trữ/phản hồi API **BẮT BUỘC PHẢI DÙNG MÚI GIỜ VIỆT NAM (UTC+7 / Asia/Ho_Chi_Minh)**.
   - **TUYỆT ĐỐI CẤM** hiển thị giờ quốc tế UTC (như `02:46` thay vì `09:46`) trên giao diện làm người dùng hiểu nhầm.
2. **Quy chuẩn Backend Python (`be/`):**
   - **CẤM TUYỆT ĐỐI** sử dụng `datetime.datetime.utcnow()` không kèm múi giờ (naive datetime).
   - Mọi thao tác lấy thời gian hiện tại **BẮT BUỘC** gọi `get_vn_now()` từ `src.core.utils.date_utils` hoặc `datetime.now(timezone(timedelta(hours=7)))`.
   - Chuỗi thời gian lưu Database hoặc trả về JSON API **BẮT BUỘC** chuẩn hóa qua `to_vn_iso(...)` để luôn có định dạng ISO kèm múi giờ `+07:00` (VD: `2026-11-07T09:46:15+07:00`).
   - Lọc theo ngày hôm nay (`only_today`) **BẮT BUỘC** lấy ngày theo lịch Việt Nam (`get_vn_now().strftime("%Y-%m-%d")`).
3. **Quy chuẩn Frontend Next.js (`fe/`):**
   - **BẮT BUỘC** tái sử dụng các hàm helper chuẩn múi giờ trong `@/src/core/lib/date-utils.ts`:
     - `formatVietnamTime(dateInput)`: Định dạng đầy đủ `HH:mm:ss DD/MM/YYYY`.
     - `formatVietnamShortTime(dateInput)`: Định dạng ngắn `HH:mm DD/MM` (dùng cho card, badge, kế tiếp).
     - `formatVietnamDateOnly(dateInput)`: Định dạng chỉ ngày `DD/MM/YYYY`.
   - Mọi hàm format native `Date` **BẮT BUỘC** chỉ định rõ thuộc tính `{ timeZone: "Asia/Ho_Chi_Minh" }`.
   - Tự động chuẩn hóa chuỗi ISO đầu vào: Nếu chuỗi chưa có offset hoặc `Z`, tự động coi là UTC (`+ "Z"`) trước khi parse để đảm bảo `new Date(...)` bù đúng $+7$ tiếng sang giờ Việt Nam.

