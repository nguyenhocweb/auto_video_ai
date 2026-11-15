# ĐẶC TẢ CHI TIẾT BẢNG / COLLECTION: VOICE_PROFILES
## Tên Collection: `voice_profiles`
### Vai trò: Quản lý hồ sơ giọng nói đặc trưng (Kiểu giọng đã training/trích xuất embedding vector) để tái sử dụng lâu dài

---

## 🎯 1. MỤC ĐÍCH NGHIỆP VỤ

Đây là collection quan trọng nhất để giải quyết bài toán: **"Chuyển nhái giọng training và lưu lại kiểu giọng đó cho sau này dùng"**.

Thay vì phải giữ file âm thanh mẫu và yêu cầu AI chạy qua mạng nơ-ron nhận dạng lại từ đầu (mất ~15-20s xử lý audio), hệ thống AI OmniVoice thực hiện:
1. **Trích xuất (Extract & Embed):** Nén toàn bộ màu giọng, âm sắc (timbre), cao độ (pitch), độ vang và đặc trưng phát âm thành một **File Vector Nhúng PyTorch (`.pt`)**.
2. **Lưu trữ Cloudinary (Raw Asset):** File `.pt` này (~10MB) được tải lên thư mục an toàn của Cloudinary dưới dạng Raw Asset.
3. **Quản lý trong Collection `voice_profiles`:** Lưu định danh, tên giọng do người dùng đặt (VD: *"Giọng MC Review Công Nghệ"*), giới tính, nhãn tag phong cách và đường dẫn file `.pt`.
4. **Sử dụng lâu dài (Tab 3):** Khi người dùng muốn sản xuất video mới, chỉ cần chọn tên giọng trong danh sách Dropdown. AI chỉ việc nạp thẳng vector nhúng vào tầng giải mã (Diffusion Decoder), đọc kịch bản mới với tốc độ **nhanh gấp 3 lần** và đảm bảo chất giọng **đồng nhất 100% xuyên suốt 100 tập video**.

---

## 📋 2. TỪ ĐIỂN DỮ LIỆU CHI TIẾT (DATA DICTIONARY)

| Tên trường (Field) | Kiểu dữ liệu BSON | Kiểu Python / TS | Ràng buộc (Constraints) | Mặc định (Default) | Diễn giải nghiệp vụ chi tiết |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | `str / PyObjectId` | Khóa chính (PK), Bắt buộc | Tự sinh | Mã định danh duy nhất của hồ sơ giọng nói. |
| `user_id` | `ObjectId` | `str / PyObjectId` | Khóa ngoại (FK) $\rightarrow$ `users._id` | Bắt buộc | Người dùng sở hữu hồ sơ giọng nói này. |
| `source_sample_id` | `ObjectId` | `Optional[str]` | Khóa ngoại (FK) $\rightarrow$ `voice_samples._id` | `null` | Mẫu âm thanh gốc đã được dùng để trích xuất ra profile này (nếu có). |
| `profile_name` | `String` | `str` | Bắt buộc, Min 2, Max 100 ký tự | Không | Tên do người dùng đặt để dễ nhận biết (VD: *"Giọng Review Minh Khang"*). |
| `description` | `String` | `Optional[str]` | Max 500 ký tự | `null` | Mô tả chi tiết phong cách, ngữ cảnh phù hợp sử dụng giọng này. |
| `gender` | `String` | `str` | Enum: `"male"`, `"female"`, `"neutral"` | `"neutral"` | Giới tính của chất giọng (Nam / Nữ / Trung tính). |
| `language` | `String` | `str` | Mã ISO 639-1 (VD: `"vi"`, `"en"`, `"zh"`) | `"vi"` | Ngôn ngữ tối ưu nhất của chất giọng này. |
| `tags` | `Array[String]` | `List[str]` | Danh sách nhãn (tối đa 10 tags) | `[]` | Các từ khóa mô tả phong cách (VD: `["review", "tram-am", "mien-bac", "tiktok"]`). |
| `cloudinary_embedding` | `Document` | `dict` | Bắt buộc | Xem bên dưới | Thông tin lưu trữ file vector PyTorch `.pt` trên Cloudinary. |
| `cloudinary_embedding.public_id` | `String` | `str` | Bắt buộc | Không | Public ID trên Cloudinary (VD: `video_ai/voice_profiles/embedding_a89bc21e`). |
| `cloudinary_embedding.secure_url` | `String` | `str` | Bắt buộc, URL HTTPS | Không | Đường dẫn tải file `.pt` tốc độ cao vào bộ nhớ RAM của AI khi cần đọc kịch bản. |
| `cloudinary_embedding.resource_type` | `String` | `str` | Giá trị: `"raw"` | `"raw"` | File `.pt` không phải ảnh hay video, được Cloudinary lưu dưới dạng `"raw"` asset. |
| `cloudinary_embedding.bytes` | `Long / Integer`| `int` | Dung lượng file vector (~5MB - 15MB) | Không | Dung lượng file `.pt`. |
| `is_preset` | `Boolean` | `bool` | Bắt buộc | `false` | `true`: Mẫu giọng mặc định của hệ thống; `false`: Giọng do người dùng tự tạo. |
| `usage_count` | `Integer` | `int` | Min $\ge 0$ | `0` | Số lần chất giọng này đã được sử dụng để đọc kịch bản video. |
| `created_at` | `Date` | `datetime` | Bắt buộc | `datetime.utcnow()` | Thời điểm tạo và lưu hồ sơ giọng. |
| `updated_at` | `Date` | `datetime` | Bắt buộc | `datetime.utcnow()` | Thời điểm cập nhật tên hoặc mô tả hồ sơ. |

---

## ☁️ 2. QUY HOẠCH ĐƯỜNG DẪN TRÊN CLOUDINARY

Mỗi hồ sơ giọng sẽ có một file vector nhúng đặc trưng lưu tại:
```text
Bucket Folder: video_ai/voice_profiles/
File Naming:   embedding_{profile_uuid}.pt
Resource Type: raw
Ví dụ URL:     https://res.cloudinary.com/your-cloud/raw/upload/v1793576500/video_ai/voice_profiles/embedding_a89bc21e.pt
```

---

## 🔗 3. MỐI QUAN HỆ (RELATIONSHIPS)

* `n - 1` với `users`: Thuộc quyền quản lý của một Creator.
* `1 - 1` (tùy chọn) với `voice_samples`: Có liên kết với file audio gốc đã dùng để trích xuất.
* `1 - n` với `audio_generations`: Một hồ sơ giọng có thể dùng để sinh hàng trăm, hàng nghìn tập video khác nhau trong Tab 3 ("Đọc Kịch Bản Video").

---

## 📄 4. MẪU BẢN GHI THỰC TẾ (SAMPLE JSON DOCUMENT)

```json
{
  "_id": {
    "$oid": "664b22508a9d3c2b1a000003"
  },
  "user_id": {
    "$oid": "664b1f1e8a9d3c2b1a000001"
  },
  "source_sample_id": {
    "$oid": "664b21008a9d3c2b1a000002"
  },
  "profile_name": "Giọng Review Công Nghệ Nam - Trầm Ấm",
  "description": "Giọng nam miền Bắc độ tuổi 25-30, phát âm chuẩn, nhịp điệu nhanh và dứt khoát, chuyên review đồ công nghệ TikTok Shorts.",
  "gender": "male",
  "language": "vi",
  "tags": [
    "review",
    "cong-nghe",
    "mien-bac",
    "nam-tre",
    "tram-am"
  ],
  "cloudinary_embedding": {
    "public_id": "video_ai/voice_profiles/embedding_a89bc21e",
    "secure_url": "https://res.cloudinary.com/video-ai-cloud/raw/upload/v1793576500/video_ai/voice_profiles/embedding_a89bc21e.pt",
    "resource_type": "raw",
    "bytes": 10485760
  },
  "is_preset": false,
  "usage_count": 24,
  "created_at": {
    "$date": "2026-11-02T06:40:22.000Z"
  },
  "updated_at": {
    "$date": "2026-11-02T08:15:00.000Z"
  }
}
```

---

## ⚡ 5. QUY TẮC INDEXING (CHỈ MỤC TỐI ƯU TRUY VẤN)

1. **Compound Index (Lọc danh sách giọng của tôi + giọng mặc định):**
   - `{ "user_id": 1, "is_preset": 1, "created_at": -1 }`
   - Giúp nạp danh sách vào Dropdown Tab 3 và bảng quản lý Tab 4 trong vòng $< 3\text{ms}$.
2. **Text Index (Tìm kiếm toàn văn theo từ khóa phong cách):**
   - `{ "profile_name": "text", "tags": "text", "description": "text" }`
   - Cho phép người dùng gõ tìm kiếm thông minh: gõ *"trầm ấm"*, *"review"* hay *"miền bắc"* là gợi ý ngay các chất giọng phù hợp.
3. **Usage Count Index:**
   - `{ "user_id": 1, "usage_count": -1 }`
   - Đưa các giọng đọc được dùng nhiều nhất (Frequent Voices) lên đầu danh sách chọn.

