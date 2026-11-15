# ĐẶC TẢ CHI TIẾT BẢNG / COLLECTION: VIDEO_PROJECTS
## Tên Collection: `video_projects`
### Vai trò: Quản lý các dự án dựng video hoàn chỉnh (Tự động hóa ghép âm thanh, hình ảnh & phụ đề)

---

## 🎯 1. MỤC ĐÍCH NGHIỆP VỤ

Mục tiêu tối thượng của nền tảng **Video AI Platform** là giải quyết bài toán: **Từ một kịch bản chữ $\longrightarrow$ tự động tạo giọng nói $\longrightarrow$ tự động tạo video hoàn chỉnh có phụ đề bắt mắt để đăng TikTok / YouTube Shorts**.

Collection `video_projects` được thiết kế để:
- Lưu trữ toàn bộ cấu trúc dự án video của Creator.
- Liên kết trực tiếp với file thuyết minh trong `audio_generations`.
- Quản lý tỷ lệ khung hình video (`9:16` dọc cho TikTok/Shorts/Reels, `16:9` ngang cho YouTube thông thường).
- Lưu cấu hình tự động đồng bộ phụ đề (Animated Subtitles / Captions) với màu sắc, font chữ và hiệu ứng nổi bật (như phong cách phụ đề của CapCut).
- Lưu danh sách các phân cảnh (Timeline / Scenes) bao gồm hình ảnh hoặc video nền tương ứng với từng câu nói.
- Lưu trữ đường dẫn video xuất bản cuối cùng (`.mp4`) trên Cloudinary.

---

## 📋 2. TỪ ĐIỂN DỮ LIỆU CHI TIẾT (DATA DICTIONARY)

| Tên trường (Field) | Kiểu dữ liệu BSON | Kiểu Python / TS | Ràng buộc (Constraints) | Mặc định (Default) | Diễn giải nghiệp vụ chi tiết |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | `str / PyObjectId` | Khóa chính (PK), Bắt buộc | Tự sinh | Mã định danh duy nhất của dự án video. |
| `user_id` | `ObjectId` | `str / PyObjectId` | Khóa ngoại (FK) $\rightarrow$ `users._id` | Bắt buộc | Creator sở hữu dự án video này. |
| `audio_generation_id` | `ObjectId` | `str / PyObjectId` | Khóa ngoại (FK) $\rightarrow$ `audio_generations._id` | Bắt buộc | Âm thanh thuyết minh chính làm gốc để căn chỉnh timeline video. |
| `title` | `String` | `str` | Bắt buộc, Min 2, Max 150 ký tự | Không | Tên dự án video (VD: *"Video Review Tập 01 - Trải nghiệm Video AI"*). |
| `aspect_ratio` | `String` | `str` | Enum: `"9:16"`, `"16:9"`, `"1:1"` | `"9:16"` | Tỷ lệ khung hình hiển thị của video xuất bản. |
| `resolution` | `String` | `str` | Enum: `"1080p"`, `"720p"`, `"4k"` | `"1080p"` | Độ phân giải xuất bản video. |
| `fps` | `Integer` | `int` | Enum: `24`, `30`, `60` | `30` | Tốc độ khung hình trên giây. |
| `subtitles_config` | `Document` | `dict` | Bắt buộc | Xem bên dưới | Cấu hình tạo phụ đề tự động (Auto-Captions). |
| `subtitles_config.enabled` | `Boolean` | `bool` | Bắt buộc | `true` | Bật/tắt tự động hiển thị phụ đề nổi trên video. |
| `subtitles_config.font_family` | `String` | `str` | Tên font (VD: `"Montserrat"`, `"Inter"`) | `"Montserrat"` | Phông chữ của phụ đề video. |
| `subtitles_config.font_size` | `Integer` | `int` | $12 \le \text{size} \le 72$ | `28` | Cỡ chữ hiển thị. |
| `subtitles_config.primary_color` | `String` | `str` | Mã màu HEX (VD: `"#FFFFFF"`, `"#FFDF00"`) | `"#FFDF00"` | Màu chữ chính của phụ đề (màu vàng nổi bật). |
| `subtitles_config.stroke_color` | `String` | `str` | Mã màu HEX | `"#000000"` | Viền nét chữ để dễ đọc trên mọi hình nền. |
| `subtitles_config.animation` | `String` | `str` | Enum: `"karaoke"`, `"pop_in"`, `"fade"` | `"karaoke"` | Hiệu ứng chuyển động chữ theo giọng nói. |
| `scenes` | `Array[Document]` | `List[dict]` | Danh sách phân cảnh | `[]` | Mảng chứa các đoạn hình ảnh/video clip tương ứng với từng mốc thời gian. |
| `status` | `String` | `str` | Enum: `"draft"`, `"rendering"`, `"completed"`, `"failed"` | `"draft"` | Trạng thái dựng video (`draft`: nháp, `rendering`: đang ghép, `completed`: xong). |
| `rendered_video` | `Document` | `Optional[dict]` | Null khi chưa render xong | `null` | File MP4 xuất bản lưu trên Cloudinary. |
| `rendered_video.public_id` | `String` | `str` | Public ID | Không | Mã định vị video trên Cloudinary. |
| `rendered_video.secure_url` | `String` | `str` | URL HTTPS MP4 | Không | Link tải hoặc nhúng video xem trực tiếp. |
| `rendered_video.duration_seconds` | `Double` | `float` | Độ dài video (giây) | Không | Thời lượng tổng của video. |
| `rendered_video.bytes` | `Long / Integer`| `int` | Kích thước file video | Không | Dung lượng video (bytes). |
| `created_at` | `Date` | `datetime` | Bắt buộc | `datetime.utcnow()` | Thời điểm tạo dự án. |
| `updated_at` | `Date` | `datetime` | Bắt buộc | `datetime.utcnow()` | Thời điểm chỉnh sửa dự án gần nhất. |

---

## 🔗 3. MỐI QUAN HỆ (RELATIONSHIPS)

* `n - 1` với `users`: Thuộc về một Creator.
* `n - 1` với `audio_generations`: Sử dụng âm thanh thuyết minh AI đã tạo ra làm trục thời gian (timeline master).

---

## 📄 4. MẪU BẢN GHI THỰC TẾ (SAMPLE JSON DOCUMENT)

```json
{
  "_id": {
    "$oid": "664b24508a9d3c2b1a000005"
  },
  "user_id": {
    "$oid": "664b1f1e8a9d3c2b1a000001"
  },
  "audio_generation_id": {
    "$oid": "664b23808a9d3c2b1a000004"
  },
  "title": "Shorts 01 - Khám Phá Công Nghệ Video AI Mới Nhất",
  "aspect_ratio": "9:16",
  "resolution": "1080p",
  "fps": 30,
  "subtitles_config": {
    "enabled": true,
    "font_family": "Montserrat",
    "font_size": 28,
    "primary_color": "#FFDF00",
    "stroke_color": "#000000",
    "animation": "karaoke"
  },
  "scenes": [
    {
      "scene_index": 1,
      "start_time": 0.0,
      "end_time": 4.15,
      "text": "Chào mừng bạn đến với kênh Video AI.",
      "media_url": "https://res.cloudinary.com/video-ai-cloud/image/upload/v1/stock/tech_intro.jpg",
      "media_type": "image",
      "transition": "fade"
    },
    {
      "scene_index": 2,
      "start_time": 4.15,
      "end_time": 8.28,
      "text": "Hôm nay chúng ta sẽ cùng khám phá công nghệ mới.",
      "media_url": "https://res.cloudinary.com/video-ai-cloud/video/upload/v1/stock/ai_robot_chip.mp4",
      "media_type": "video",
      "transition": "slide_left"
    }
  ],
  "status": "completed",
  "rendered_video": {
    "public_id": "video_ai/rendered_videos/project_664b2450",
    "secure_url": "https://res.cloudinary.com/video-ai-cloud/video/upload/v1793580000/video_ai/rendered_videos/project_664b2450.mp4",
    "duration_seconds": 8.28,
    "bytes": 5242880
  },
  "created_at": {
    "$date": "2026-11-02T08:00:00.000Z"
  },
  "updated_at": {
    "$date": "2026-11-02T08:30:15.000Z"
  }
}
```

---

## ⚡ 5. QUY TẮC INDEXING (CHỈ MỤC TỐI ƯU TRUY VẤN)

1. **Compound Index:** `{ "user_id": 1, "created_at": -1 }`
   - Hiển thị danh sách các dự án video của người dùng trên trang quản lý dự án.
2. **Index theo trạng thái Render:** `{ "status": 1, "created_at": 1 }`
   - Phục vụ cụm máy chủ render video (FFmpeg worker) nhận job kết xuất video tự động.

