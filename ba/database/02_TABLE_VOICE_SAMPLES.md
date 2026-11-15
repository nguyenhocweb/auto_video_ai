# ĐẶC TẢ CHI TIẾT BẢNG / COLLECTION: VOICE_SAMPLES
## Tên Collection: `voice_samples`
### Vai trò: Quản lý các mẫu âm thanh ghi âm gốc do người dùng tải lên hệ thống

---

## 🎯 1. MỤC ĐÍCH NGHIỆP VỤ

Trong luồng **Zero-shot Voice Cloning (Nhái Giọng Tức Thì)**, người dùng cần cung cấp một đoạn âm thanh mẫu từ 3 đến 10 giây (như file `Ghi tiêu chuẩn 19.mp3`). Collection `voice_samples` chịu trách nhiệm:
- Lưu vết toàn bộ các file âm thanh thô hoặc đã qua làm sạch mà người dùng đã tải lên.
- Quản lý liên kết tới dịch vụ lưu trữ đám mây **Cloudinary** (không lưu trữ file cục bộ trên máy chủ).
- Lưu trữ các thông số kỹ thuật âm thanh (thời lượng, tần số lấy mẫu 24kHz, số kênh Mono).
- Lưu mã băm `file_hash` (SHA-256) để phát hiện file trùng lặp, tiết kiệm băng thông và dung lượng Cloudinary.
- Lưu trữ mảng `waveform_peaks` để Frontend có thể hiển thị sóng âm trực quan tức thì mà không cần tải lại toàn bộ file âm thanh.

---

## 📋 2. TỪ ĐIỂN DỮ LIỆU CHI TIẾT (DATA DICTIONARY)

| Tên trường (Field) | Kiểu dữ liệu BSON | Kiểu Python / TS | Ràng buộc (Constraints) | Mặc định (Default) | Diễn giải nghiệp vụ chi tiết |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | `str / PyObjectId` | Khóa chính (PK), Bắt buộc | Tự sinh | Mã định danh duy nhất của mẫu âm thanh. |
| `user_id` | `ObjectId` | `str / PyObjectId` | Khóa ngoại (FK) $\rightarrow$ `users._id` | Bắt buộc | Định danh người dùng đã tải lên mẫu âm thanh này. |
| `original_filename` | `String` | `str` | Bắt buộc, Min 1, Max 255 | Không | Tên file gốc từ máy tính/điện thoại người dùng (VD: `Ghi tiêu chuẩn 19.mp3`). |
| `file_hash` | `String` | `str` | Bắt buộc, Độ dài 64 ký tự (SHA-256) | Không | Mã băm toàn vẹn nội dung file. Giúp kiểm tra xem user đã từng tải file này lên trước đó chưa. |
| `duration_seconds` | `Double` | `float` | $1.0 \le \text{duration} \le 30.0$ | Không | Thời lượng thực tế của đoạn âm thanh (tính bằng giây, thường từ 3 – 10s sau khi cắt tỉa). |
| `sample_rate` | `Integer` | `int` | Bắt buộc, Thường là 24000 hoặc 44100 | `24000` | Tần số lấy mẫu âm thanh (Hz) sau khi đã được Audio Sanitizer chuẩn hóa. |
| `channels` | `Integer` | `int` | Enum: `1` (Mono) hoặc `2` (Stereo) | `1` | Số kênh âm thanh. Mô hình OmniVoice yêu cầu chuẩn hóa 1 kênh (Mono). |
| `format` | `String` | `str` | Enum: `"wav"`, `"mp3"`, `"m4a"`, `"ogg"` | `"wav"` | Định dạng lưu trữ âm thanh chuẩn hóa trên đám mây. |
| `size_bytes` | `Long / Integer`| `int` | $\le 20 \times 1024 \times 1024$ (20MB) | Không | Dung lượng file tính bằng bytes. |
| `cloudinary` | `Document` | `dict` | Bắt buộc | Xem bên dưới | Thông tin định vị file trên CDN Cloudinary. |
| `cloudinary.public_id` | `String` | `str` | Bắt buộc, Duy nhất | Không | Mã ID công khai trên Cloudinary (VD: `video_ai/voice_samples/sample_34ecff8c`). Dùng để xóa hoặc chuyển đổi file. |
| `cloudinary.secure_url` | `String` | `str` | Bắt buộc, URL định dạng HTTPS | Không | Đường dẫn tải / phát âm thanh tốc độ cao qua giao thức HTTPS của Cloudinary. |
| `cloudinary.resource_type` | `String` | `str` | Giá trị: `"video"` | `"video"` | Cloudinary phân loại file âm thanh (Audio) thuộc nhóm tài nguyên `"video"`. |
| `cloudinary.format` | `String` | `str` | Giá trị: `"wav"` hoặc `"mp3"` | `"wav"` | Định dạng lưu trên Cloudinary. |
| `cloudinary.bytes` | `Long / Integer`| `int` | $> 0$ | Không | Kích thước file ghi nhận trên Cloudinary. |
| `whisper_transcript` | `String` | `Optional[str]` | Max 2000 ký tự | `null` | Bản bóc băng chữ của file âm thanh do mô hình Whisper tự động nhận dạng. |
| `waveform_peaks` | `Array[Double]` | `List[float]` | Mảng số thực từ `0.0` đến `1.0` | `[]` | Tập hợp các điểm biên độ âm thanh (thường 50-100 điểm) để vẽ biểu đồ sóng âm thanh trên UI. |
| `created_at` | `Date` | `datetime` | Bắt buộc | `datetime.utcnow()` | Thời điểm file được tải lên và lưu vào hệ thống. |

---

## ☁️ 2. QUY HOẠCH ĐƯỜNG DẪN TRÊN CLOUDINARY

Mỗi file mẫu sẽ được lưu trên Cloudinary theo quy ước:
```text
Bucket Folder: video_ai/voice_samples/
File Naming:   sample_{uuid_hex_8}.wav
Ví dụ URL:     https://res.cloudinary.com/your-cloud/video/upload/v1793576000/video_ai/voice_samples/sample_34ecff8c.wav
```

---

## 🔗 3. MỐI QUAN HỆ (RELATIONSHIPS)

* `n - 1` với `users`: Thuộc về một người dùng cụ thể.
* `1 - 0..1` với `voice_profiles`: Một sample có thể được dùng làm dữ liệu gốc để trích xuất thành 1 Hồ Sơ Giọng Nói (`voice_profiles`).
* `1 - n` với `audio_generations`: Một sample có thể được tái sử dụng nhiều lần để nhái giọng cho các kịch bản khác nhau.

---

## 📄 4. MẪU BẢN GHI THỰC TẾ (SAMPLE JSON DOCUMENT)

```json
{
  "_id": {
    "$oid": "664b21008a9d3c2b1a000002"
  },
  "user_id": {
    "$oid": "664b1f1e8a9d3c2b1a000001"
  },
  "original_filename": "Ghi tiêu chuẩn 19.mp3",
  "file_hash": "b4c81a97d51e7399872561956101918342718104891240182947192418491024",
  "duration_seconds": 8.25,
  "sample_rate": 24000,
  "channels": 1,
  "format": "wav",
  "size_bytes": 396044,
  "cloudinary": {
    "public_id": "video_ai/voice_samples/sample_34ecff8c",
    "secure_url": "https://res.cloudinary.com/video-ai-cloud/video/upload/v1793576000/video_ai/voice_samples/sample_34ecff8c.wav",
    "resource_type": "video",
    "format": "wav",
    "bytes": 396044
  },
  "whisper_transcript": "Chào mừng bạn đến với kênh Video AI. Hôm nay chúng ta sẽ cùng khám phá công nghệ mới.",
  "waveform_peaks": [
    0.05, 0.12, 0.28, 0.65, 0.89, 0.72, 0.45, 0.30, 0.15, 0.08, 0.42, 0.85, 0.95, 0.60, 0.25, 0.04
  ],
  "created_at": {
    "$date": "2026-11-02T06:38:15.000Z"
  }
}
```

---

## ⚡ 5. QUY TẮC INDEXING (CHỈ MỤC TỐI ƯU TRUY VẤN)

1. **Compound Index:** `{ "user_id": 1, "created_at": -1 }`
   - Giúp người dùng xem lại danh sách các file audio mẫu mình đã từng tải lên gần đây một cách tức thì.
2. **Index tìm kiếm trùng lặp:** `{ "user_id": 1, "file_hash": 1 }`
   - Khi người dùng chọn tải lên một file, hệ thống băm SHA-256 ngay trên client/server. Nếu hash đã tồn tại với user này, hệ thống tái sử dụng ngay link Cloudinary cũ mà không cần upload lại, tiết kiệm 100% chi phí truyền tải.

