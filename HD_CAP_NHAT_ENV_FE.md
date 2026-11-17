# 🌐 HƯỚNG DẪN CẬP NHẬT BIẾN MÔI TRƯỜNG (ENV) CHO FRONTEND & WEBSOCKET

> **ĐIỂM ĐẶC BIỆT:** Hệ thống Frontend hiện tại **CHỈ DÙNG DUY NHẤT 1 BIẾN ENV** là `NEXT_PUBLIC_API_URL`.
> Toàn bộ kết nối Realtime WebSocket (`ws://` hoặc `wss://`) được **tự động cắt ghép và chuyển đổi trực tiếp** từ biến này mà không cần cấu hình thêm bất kỳ biến nào khác!

---

## ⚡ 1. Cơ chế tự động hóa WebSocket từ `NEXT_PUBLIC_API_URL`

Trong mã nguồn Frontend (`fe/src/features/shared/ws/useNotificationSocket.ts`), hệ thống tự động nhận diện và chuyển đổi giao thức:

* Khi bạn điền URL HTTPS (ví dụ Cloudflare Tunnel):
  $$\text{https://imposed-partition-rug-colin.trycloudflare.com} \longrightarrow \textbf{wss://}\text{imposed-partition-rug-colin.trycloudflare.com}$$
* Khi bạn điền URL HTTP (ví dụ chạy Localhost):
  $$\text{http://127.0.0.1:8001} \longrightarrow \textbf{ws://}\text{127.0.0.1:8001}$$
* Tự động loại bỏ dấu gạch chéo cuối (`/`) hoặc đoạn `/api/v1` nếu bạn lỡ điền thừa.

👉 **Kết luận:** Bạn chỉ cần quản lý duy nhất biến `NEXT_PUBLIC_API_URL`. Cả gọi API lẫn bắn thông báo WebSocket Realtime đều chạy mượt mà 100%.

---

## 🚀 2. Cách cập nhật biến trên Vercel (Khi chạy Online)

Mỗi khi bạn khởi động lại `run_be.bat` (chế độ Cloudflare Tunnel) và nhận được một đường link Tunnel mới (ví dụ: `https://xxxx-yyyy-zzzz.trycloudflare.com`), hãy làm theo các bước sau để Frontend trên Vercel kết nối về máy:

### Bước 1: Vào mục Cấu hình Biến trên Vercel
1. Mở trang quản trị dự án trên Vercel: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Chọn dự án: `auto-video-ai` (hoặc tên dự án của bạn).
3. Bấm vào tab **Settings** ở thanh menu trên cùng.
4. Chọn mục **Environment Variables** ở cột bên trái.

### Bước 2: Cập nhật giá trị `NEXT_PUBLIC_API_URL`
1. Tìm dòng có Key là `NEXT_PUBLIC_API_URL`:
   * Nếu đã có: Bấm vào biểu tượng dấu **3 chấm `...`** bên phải $\longrightarrow$ Chọn **Edit**.
   * Nếu chưa có: Bấm nút **Add New**.
2. Nhập thông tin:
   * **Key:** `NEXT_PUBLIC_API_URL`
   * **Value:** Dán link Cloudflare Tunnel vừa tạo (Ví dụ: `https://xxxx-yyyy-zzzz.trycloudflare.com`)
   * **Type:** Có thể chọn *Plaintext* hoặc *Secret*.
   * **Environments:** Tích chọn cả **Production**, **Preview**, và **Development**.
3. Bấm nút **Save** để lưu.

### Bước 3: Redeploy để Next.js nạp biến mới (BẮT BUỘC)
> ⚠️ **LƯU Ý CỰC KỲ QUAN TRỌNG:** Vì Next.js biên dịch biến `NEXT_PUBLIC_*` vào gói JavaScript lúc Build, việc chỉ Save biến sẽ **chưa áp dụng ngay** nếu không Redeploy.

1. Bấm vào tab **Deployments** trên menu đầu trang.
2. Tìm bản deploy trên cùng (Production đang chạy).
3. Bấm vào dấu **3 chấm `...`** ở góc phải bản deploy đó.
4. Chọn **Redeploy**.
5. Giữ nguyên các tùy chọn và bấm nút **Redeploy** màu xanh.
6. Đợi khoảng 1 phút để Vercel hoàn tất build. Giờ đây web `https://nguyen-video.vercel.app` sẽ kết nối thành công 100% đến máy chủ Backend của bạn!

---

## 💻 3. Cách cập nhật khi chạy trên Máy tính cá nhân (Localhost)

Nếu bạn chạy cả Frontend và Backend trực tiếp trên máy tính của bạn:

1. Mở file [fe/.env.local](file:///d:/DuAnCaNhan/video_ai/fe/.env.local).
2. Điền nội dung:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
   ```
3. Lưu file lại.
4. Mở Terminal tại thư mục `fe/` và khởi động lại:
   ```bash
   npm run dev
   ```
5. Mở trình duyệt tại [http://localhost:3002](http://localhost:3002) hoặc [http://localhost:3000](http://localhost:3000) để sử dụng.
