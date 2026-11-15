# CHIẾN LƯỢC QUAN HỆ & CHỈ MỤC TRUY VẤN (INDEXING & RELATIONSHIPS)
## Nền tảng: MongoDB + Cloudinary trong Video AI Platform

---

## 📌 1. CHIẾN LƯỢC THIẾT KẾ DỮ LIỆU NOSQL (REFERENCING VS EMBEDDING)

Trong MongoDB, câu hỏi cốt lõi là **Khi nào nên nhúng (Embed) và khi nào nên tham chiếu (Reference)?**

### 1.1. Khi nào nhúng (Embed inside Document):
* **Dữ liệu thuộc về 1 thực thể cha và không bao giờ tách rời:**
  - `usage_quota` nhúng bên trong `users`.
  - `voice_settings` nhúng bên trong `audio_generations`.
  - `cloudinary` / `cloudinary_audio` nhúng bên trong chính tài nguyên đó.
  - `waveform_peaks` nhúng trong `voice_samples`.
  - `scenes` và `subtitles_config` nhúng trong `video_projects`.
* **Lợi ích:** Đọc 1 lần duy nhất ($1\text{ IO Operation}$) là lấy đủ toàn bộ thông tin render UI, loại bỏ hoàn toàn các lệnh `JOIN` đắt đỏ.

### 1.2. Khi nào tham chiếu (Reference qua ObjectId):
* **Dữ liệu có kích thước tăng dần không giới hạn:**
  - `user_id` trong `voice_samples`, `voice_profiles`, `audio_generations`.
* **Dữ liệu có tính độc lập cao, được tái sử dụng nhiều lần:**
  - `voice_profile_id` trong `audio_generations` (1 hồ sơ giọng có thể được tái sử dụng hàng ngàn lần bởi các video khác nhau).
* **Lợi ích:** Tránh vượt quá giới hạn 16MB/document của MongoDB, giữ cho document gọn nhẹ.

---

## ⚡ 2. MA TRẬN CHỈ MỤC TỔNG THỂ (COMPREHENSIVE INDEX MATRIX)

Bảng tổng hợp tất cả Index bắt buộc phải đánh trong MongoDB để đảm bảo thời gian truy vấn $< 10\text{ms}$:

| Collection | Tên Index | Định nghĩa Index (Keys) | Loại Index | Mục đích & Nghiệp vụ tối ưu |
| :--- | :--- | :--- | :--- | :--- |
| **`users`** | `idx_users_email_unique` | `{ "email": 1 }` | **Unique** | Xác thực đăng nhập nhanh $O(1)$, chặn trùng email. |
| **`users`** | `idx_users_role_status` | `{ "role": 1, "status": 1 }` | Compound | Admin lọc danh sách tài khoản theo vai trò. |
| **`voice_samples`** | `idx_samples_user_created` | `{ "user_id": 1, "created_at": -1 }` | Compound | Tải danh sách file mẫu đã upload của user theo thứ tự mới nhất. |
| **`voice_samples`** | `idx_samples_hash` | `{ "user_id": 1, "file_hash": 1 }` | Compound | Kiểm tra file trùng lặp khi người dùng kéo thả audio mẫu. |
| **`voice_profiles`** | `idx_profiles_user_preset` | `{ "user_id": 1, "is_preset": 1, "created_at": -1 }` | Compound | Tải danh sách hồ sơ giọng ở Dropdown Tab 3 & bảng Tab 4. |
| **`voice_profiles`** | `idx_profiles_text_search` | `{ "profile_name": "text", "tags": "text", "description": "text" }` | **Text Index** | Tìm kiếm giọng thông minh theo từ khóa (VD: *"review"*, *"ấm áp"*). |
| **`voice_profiles`** | `idx_profiles_usage` | `{ "user_id": 1, "usage_count": -1 }` | Compound | Đưa các chất giọng hay dùng nhất lên đầu danh sách. |
| **`audio_generations`** | `idx_generations_user_created` | `{ "user_id": 1, "created_at": -1 }` | Compound | Tải lịch sử các file âm thanh đã sinh của người dùng. |
| **`audio_generations`** | `idx_generations_status_queue` | `{ "status": 1, "created_at": 1 }` | Compound | Hàng đợi cho worker xử lý sinh âm thanh (FIFO). |
| **`video_projects`** | `idx_projects_user_created` | `{ "user_id": 1, "created_at": -1 }` | Compound | Tải danh sách các dự án video của Creator. |
| **`video_projects`** | `idx_projects_status_render` | `{ "status": 1, "created_at": 1 }` | Compound | Hàng đợi render video của hệ thống FFmpeg. |

---

## 🛡️ 3. CHIẾN LƯỢC BẢO TOÀN DỮ LIỆU & XÓA LIÊN TẦNG (CASCADE DELETE)

Khi người dùng thực hiện xóa dữ liệu, hệ thống tuân theo các nguyên tắc an toàn:

### 3.1. Khi xóa một `voice_profile`:
1. **Kiểm tra ràng buộc:** Kiểm tra xem hồ sơ này có đang được gắn vào job nào đang ở trạng thái `pending`/`processing` không. Nếu có $\rightarrow$ Báo lỗi không cho xóa.
2. **Xóa trên Cloudinary:** Gọi Cloudinary API xóa file `.pt` tương ứng (`cloudinary.uploader.destroy(public_id, resource_type="raw")`).
3. **Cập nhật MongoDB:** Xóa document trong `voice_profiles`. Các bản ghi trong `audio_generations` đã sinh từ trước vẫn được giữ nguyên để nghe lại, nhưng trường `voice_profile_id` được set về `null` (Soft orphan).

### 3.2. Khi xóa một `audio_generation`:
1. Xóa file âm thanh trên Cloudinary (`resource_type="video"`).
2. Xóa document trong `audio_generations`.

---

## 🚀 4. TOP 3 TRUY VẤN CỐT LÕI (QUERY PATTERNS TRONG FASTAPI)

### 4.1. Truy vấn nạp danh sách giọng nói cho Dropdown Tab 3:
```python
# Lấy các giọng mẫu mặc định của app + giọng riêng của user hiện tại
profiles = await VoiceProfileDocument.find(
    {"$or": [{"is_preset": True}, {"user_id": current_user.id}]}
).sort("-usage_count", "-created_at").to_list()
```
*Index sử dụng:* `idx_profiles_user_preset` $\longrightarrow$ **Execution time: $< 2\text{ms}$**.

### 4.2. Truy vấn lịch sử tạo giọng kèm phân trang (Pagination):
```python
# Phân trang lịch sử sinh giọng nói
skip = (page - 1) * page_size
history = await AudioGenerationDocument.find(
    {"user_id": current_user.id}
).sort("-created_at").skip(skip).limit(page_size).to_list()
```
*Index sử dụng:* `idx_generations_user_created` $\longrightarrow$ **Execution time: $< 3\text{ms}$**.

### 4.3. Kiểm tra file audio mẫu trùng lặp trước khi upload:
```python
# Kiểm tra nếu file đã từng được upload
existing_sample = await VoiceSampleDocument.find_one(
    {"user_id": current_user.id, "file_hash": file_hash}
)
if existing_sample:
    # Tái sử dụng URL Cloudinary cũ, không cần upload lại
    return existing_sample.cloudinary.secure_url
```
*Index sử dụng:* `idx_samples_hash` $\longrightarrow$ **Execution time: $< 1\text{ms}$**.

