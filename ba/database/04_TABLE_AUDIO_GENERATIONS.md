# ĐẶC TẢ CHI TIẾT BẢNG / COLLECTION: AUDIO_GENERATIONS
## Tên Collection: `audio_generations`
### Vai trò: Nhật ký toàn bộ các phiên sinh âm thanh thuyết minh (Voice Jobs & Generation History)

---

## 🎯 1. MỤC ĐÍCH NGHIỆP VỤ

Mỗi lần người dùng bấm nút:
- **"Tạo Giọng Nói Ngay Tức Thì"** (Tab 1 - Clone)
- **"Thiết Kế & Sinh Giọng Nói"** (Tab 2 - Design)
- **"Tạo Thuyết Minh Kịch Bản"** (Tab 3 - Synthesize)

Hệ thống sẽ tạo ra một bản ghi trong collection `audio_generations`. Collection này chịu trách nhiệm:
- Lưu vết kịch bản chữ đã đọc (`input_text`) và câu lệnh prompt thiết kế (`instruct_prompt`).
- Lưu các tham số tinh chỉnh AI (`speed`, `num_step`, `guidance_scale`).
- Theo dõi trạng thái tiến trình xử lý (`pending` $\rightarrow$ `processing` $\rightarrow$ `completed` / `failed`).
- Đo lường hiệu năng: thời gian AI tính toán trên CPU/GPU (`process_time_seconds`).
- Lưu trữ liên kết file âm thanh thành phẩm trên **Cloudinary** (cả định dạng WAV nguyên gốc và URL phát trực tiếp MP3 nhẹ).
- Cung cấp dữ liệu để người dùng nghe lại, tải lại file WAV về máy bất cứ lúc nào mà không sợ mất file.

---

## 📋 2. TỪ ĐIỂN DỮ LIỆU CHI TIẾT (DATA DICTIONARY)

| Tên trường (Field) | Kiểu dữ liệu BSON | Kiểu Python / TS | Ràng buộc (Constraints) | Mặc định (Default) | Diễn giải nghiệp vụ chi tiết |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | `str / PyObjectId` | Khóa chính (PK), Bắt buộc | Tự sinh | Mã định danh duy nhất của lượt sinh âm thanh. |
| `user_id` | `ObjectId` | `str / PyObjectId` | Khóa ngoại (FK) $\rightarrow$ `users._id` | Bắt buộc | Người dùng thực hiện yêu cầu sinh âm thanh này. |
| `generation_type` | `String` | `str` | Enum: `"clone"`, `"design"`, `"synthesize"` | Bắt buộc | Phương thức sinh giọng: Nhái giọng tức thì (`clone`), Thiết kế giọng mới (`design`), hay Đọc từ hồ sơ đã lưu (`synthesize`). |
| `voice_profile_id` | `ObjectId` | `Optional[str]` | Khóa ngoại (FK) $\rightarrow$ `voice_profiles._id` | `null` | Được gắn nếu sinh âm thanh bằng Tab 3 (dùng profile đã lưu). |
| `source_sample_id` | `ObjectId` | `Optional[str]` | Khóa ngoại (FK) $\rightarrow$ `voice_samples._id` | `null` | Được gắn nếu sinh bằng Tab 1 (nhái trực tiếp từ mẫu audio). |
| `input_text` | `String` | `str` | Bắt buộc, Min 2, Max 5000 ký tự | Không | Nội dung văn bản kịch bản mà AI đã đọc thành tiếng. |
| `instruct_prompt` | `String` | `Optional[str]` | Max 500 ký tự | `null` | Câu lệnh miêu tả phong cách giọng (chỉ có khi `generation_type` = `"design"`). |
| `voice_settings` | `Document` | `dict` | Bắt buộc | Xem bên dưới | Các thông số kỹ thuật cấu hình mô hình AI lúc chạy. |
| `voice_settings.speed` | `Double` | `float` | $0.5 \le \text{speed} \le 2.0$ | `1.0` | Tốc độ đọc của giọng nói (1.0 là bình thường, 1.2 là nhanh nhẹn). |
| `voice_settings.num_step` | `Integer` | `int` | $8 \le \text{num\_step} \le 64$ | `28` | Số bước tính toán Diffusion (càng cao âm thanh càng chi tiết, mượt mà). |
| `voice_settings.guidance_scale` | `Double` | `float` | $1.0 \le \text{scale} \le 5.0$ | `2.0` | Độ bám sát vào phong cách giọng mẫu / prompt. |
| `voice_settings.engine` | `String` | `str` | Tên model | `"k2-fsa/OmniVoice"` | Định danh mô hình AI được sử dụng. |
| `voice_settings.device_used` | `String` | `str` | Enum: `"cuda:0"`, `"cpu"` | `"cpu"` | Phần cứng thực tế đã tính toán phiên này. |
| `status` | `String` | `str` | Enum: `"pending"`, `"processing"`, `"completed"`, `"failed"` | `"pending"` | Trạng thái của job sinh âm thanh. |
| `cloudinary_audio` | `Document` | `Optional[dict]` | Null khi đang xử lý | `null` | Thông tin file âm thanh thành phẩm lưu trên Cloudinary. |
| `cloudinary_audio.public_id` | `String` | `str` | Bắt buộc khi completed | Không | Public ID trên Cloudinary (VD: `video_ai/audio_outputs/clone_aed93819`). |
| `cloudinary_audio.secure_url` | `String` | `str` | URL HTTPS | Không | Đường dẫn tải file WAV gốc chất lượng cao 24kHz. |
| `cloudinary_audio.mp3_stream_url` | `String` | `str` | URL HTTPS | Không | Đường dẫn streaming nén MP3 tối ưu để nghe thử ngay trên trình duyệt mà không tốn dung lượng 4G/Wifi. |
| `cloudinary_audio.duration_seconds` | `Double` | `float` | $> 0$ | Không | Độ dài file âm thanh thành phẩm tính bằng giây (VD: `8.28`). |
| `cloudinary_audio.sample_rate` | `Integer` | `int` | Giá trị: `24000` | `24000` | Tần số mẫu chuẩn đầu ra của OmniVoice. |
| `cloudinary_audio.bytes` | `Long / Integer`| `int` | $> 0$ | Không | Kích thước file âm thanh (bytes). |
| `process_time_seconds` | `Double` | `Optional[float]` | $\ge 0$ | `null` | Tổng thời gian AI thực hiện tính toán (tính bằng giây). |
| `error_message` | `String` | `Optional[str]` | Max 1000 ký tự | `null` | Chi tiết thông báo lỗi nếu trạng thái là `"failed"`. |
| `created_at` | `Date` | `datetime` | Bắt buộc | `datetime.utcnow()` | Thời điểm bắt đầu tạo yêu cầu sinh giọng. |

---

## ☁️ 2. QUY HOẠCH ĐƯỜNG DẪN TRÊN CLOUDINARY

File âm thanh thành phẩm được tải lên Cloudinary theo chuẩn:
```text
Bucket Folder: video_ai/audio_outputs/
File Naming:   {type}_{uuid_hex_8}.wav (VD: clone_aed93819.wav)
Resource Type: video
Ví dụ URL:     https://res.cloudinary.com/your-cloud/video/upload/v1793576400/video_ai/audio_outputs/clone_aed93819.wav
Ví dụ MP3 CDN: https://res.cloudinary.com/your-cloud/video/upload/f_mp3,br_128k/v1793576400/video_ai/audio_outputs/clone_aed93819.mp3
```

---

## 🔗 3. MỐI QUAN HỆ (RELATIONSHIPS)

* `n - 1` với `users`: Thuộc về người dùng đã yêu cầu sinh giọng.
* `n - 1` (tùy chọn) với `voice_profiles`: Nếu đọc bằng hồ sơ giọng đã lưu.
* `n - 1` (tùy chọn) với `voice_samples`: Nếu nhái trực tiếp từ mẫu audio tải lên.
* `1 - 0..1` với `video_projects`: File âm thanh này có thể được chuyển thẳng sang trình dựng video để làm audio thuyết minh chính.

---

## 📄 4. MẪU BẢN GHI THỰC TẾ (SAMPLE JSON DOCUMENT)

```json
{
  "_id": {
    "$oid": "664b23808a9d3c2b1a000004"
  },
  "user_id": {
    "$oid": "664b1f1e8a9d3c2b1a000001"
  },
  "generation_type": "clone",
  "voice_profile_id": null,
  "source_sample_id": {
    "$oid": "664b21008a9d3c2b1a000002"
  },
  "input_text": "Chào mừng bạn đến với kênh Video AI. Hôm nay chúng ta sẽ cùng khám phá công nghệ mới.",
  "instruct_prompt": null,
  "voice_settings": {
    "speed": 1.0,
    "num_step": 28,
    "guidance_scale": 2.0,
    "engine": "k2-fsa/OmniVoice",
    "device_used": "cpu"
  },
  "status": "completed",
  "cloudinary_audio": {
    "public_id": "video_ai/audio_outputs/clone_aed93819",
    "secure_url": "https://res.cloudinary.com/video-ai-cloud/video/upload/v1793576400/video_ai/audio_outputs/clone_aed93819.wav",
    "mp3_stream_url": "https://res.cloudinary.com/video-ai-cloud/video/upload/f_mp3,br_128k/v1793576400/video_ai/audio_outputs/clone_aed93819.mp3",
    "duration_seconds": 8.28,
    "sample_rate": 24000,
    "format": "wav",
    "bytes": 397484
  },
  "process_time_seconds": 32.4,
  "error_message": null,
  "created_at": {
    "$date": "2026-11-02T06:39:27.000Z"
  }
}
```

---

## ⚡ 5. QUY TẮC INDEXING (CHỈ MỤC TỐI ƯU TRUY VẤN)

1. **Compound Index (Lịch sử gần đây của User):**
   - `{ "user_id": 1, "created_at": -1 }`
   - Hiển thị danh sách lịch sử sinh âm thanh ở trang Dashboard của Creator ngay lập tức.
2. **Compound Index (Hàng đợi xử lý Job):**
   - `{ "status": 1, "created_at": 1 }`
   - Phục vụ background worker lấy các job `pending` hoặc `processing` theo thứ tự FIFO (First In First Out).
3. **Compound Index (Thống kê theo phương thức):**
   - `{ "user_id": 1, "generation_type": 1, "status": 1 }`
   - Phục vụ tính toán lượng credit tiêu hao và thời lượng sử dụng.

