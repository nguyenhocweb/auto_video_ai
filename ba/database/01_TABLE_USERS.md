# ĐẶC TẢ CHI TIẾT BẢNG / COLLECTION: USERS
## Tên Collection: `users`
### Vai trò: Quản lý thông tin tài khoản, phân quyền hệ thống và hạn ngạch tài nguyên

> [!NOTE]
> **Trạng thái triển khai:** Ở giai đoạn hiện tại (Giai đoạn 1), hệ thống ưu tiên tối đa vào **Bộ 3 bảng cốt lõi phục vụ Training & Sinh Giọng Nói** (`voice_samples`, `voice_profiles`, `audio_generations`). Bảng `users` đã được đặc tả sẵn cấu trúc và sẽ kích hoạt khi hệ thống mở rộng tính năng đăng ký tài khoản & thanh toán gói cước đa người dùng.


---

## 🎯 1. MỤC ĐÍCH NGHIỆP VỤ

Collection `users` đóng vai trò trung tâm trong việc quản lý người dùng của hệ thống **Video AI Studio**. Nó lưu trữ:
- Định danh và thông tin cá nhân của người dùng.
- Cơ chế xác thực an toàn (mật khẩu băm Bcrypt, cờ kích hoạt tài khoản).
- Phân quyền (Role-based Authorization: `creator`, `system_admin`, `free_user`).
- Quản lý tài chính số / hạn ngạch tài nguyên (Credits balance, giới hạn số giây sinh âm thanh hàng tháng, số lượng hồ sơ giọng tối đa được lưu trữ).

---

## 📋 2. TỪ ĐIỂN DỮ LIỆU CHI TIẾT (DATA DICTIONARY)

| Tên trường (Field) | Kiểu dữ liệu BSON | Kiểu Python / TS | Ràng buộc (Constraints) | Mặc định (Default) | Diễn giải nghiệp vụ chi tiết |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | `str / PyObjectId` | Khóa chính (PK), Bắt buộc | Tự sinh | Mã định danh duy nhất của người dùng trong hệ thống. |
| `email` | `String` | `str` | Bắt buộc, Duy nhất (Unique), Định dạng email | Không | Email dùng để đăng nhập và nhận thông báo từ hệ thống. |
| `password_hash` | `String` | `str` | Bắt buộc, Độ dài $\ge 60$ ký tự | Không | Mật khẩu đăng nhập đã được băm an toàn bằng thuật toán Bcrypt. Tuyệt đối không lưu plain text. |
| `full_name` | `String` | `str` | Bắt buộc, Min 2, Max 100 ký tự | Không | Họ và tên hoặc nghệ danh hiển thị trên thanh Navigation và Studio. |
| `avatar_url` | `String` | `Optional[str]` | Hợp lệ URL hoặc null | `null` | Đường dẫn ảnh đại diện của người dùng (lưu trên Cloudinary hoặc Gravatar). |
| `role` | `String` | `str` | Enum: `"system_admin"`, `"creator"`, `"free_user"` | `"creator"` | Phân quyền vai trò của người dùng trong hệ sinh thái. |
| `status` | `String` | `str` | Enum: `"active"`, `"suspended"`, `"pending_verification"` | `"active"` | Trạng thái tài khoản (Đang hoạt động / Bị tạm khóa / Chờ xác thực). |
| `credits` | `Integer` | `int` | Bắt buộc, Min $\ge 0$ | `100` | Số điểm tín dụng dùng để thanh toán lượt sinh audio hoặc render video. |
| `usage_quota` | `Document` | `dict` | Bắt buộc | Xem bên dưới | Đối tượng con lưu hạn ngạch sử dụng theo gói cước (Tier). |
| `usage_quota.tier` | `String` | `str` | Enum: `"free"`, `"starter"`, `"pro"`, `"enterprise"` | `"pro"` | Gói thuê bao người dùng đang đăng ký. |
| `usage_quota.max_monthly_duration_seconds` | `Double` | `float` | $\ge 0$ | `3600.0` | Thời lượng âm thanh tối đa (giây) được phép sinh ra trong chu kỳ tháng (3600s = 60 phút). |
| `usage_quota.used_duration_seconds` | `Double` | `float` | $\ge 0$ | `0.0` | Thời lượng âm thanh thực tế đã sinh ra trong tháng hiện tại. |
| `usage_quota.max_voice_profiles` | `Integer` | `int` | $\ge 1$ | `20` | Số lượng hồ sơ giọng nói (`voice_profiles`) tối đa mà người dùng được phép lưu trữ vĩnh viễn. |
| `usage_quota.reset_date` | `Date` | `datetime` | Bắt buộc | Ngày đầu tháng sau | Ngày hệ thống tự động reset lại số giây đã dùng (`used_duration_seconds`) về 0. |
| `created_at` | `Date` | `datetime` | Bắt buộc | `datetime.utcnow()` | Thời điểm tài khoản được khởi tạo lần đầu. |
| `updated_at` | `Date` | `datetime` | Bắt buộc | `datetime.utcnow()` | Thời điểm thông tin người dùng được cập nhật gần nhất. |

---

## 🏷️ 3. CÁC ENUM & TRẠNG THÁI (STATUS / ROLES)

### 3.1. Phân quyền người dùng (`role`)
* `system_admin`: Quản trị viên cấp cao nhất. Có quyền cấu hình phần cứng, quản lý toàn bộ người dùng, xem thống kê tải GPU/CPU và quản lý mẫu giọng hệ thống.
* `creator`: Người dùng trả phí hoặc người sáng tạo nội dung chính. Có toàn quyền sử dụng Voice Studio, clone giọng, thiết kế giọng và lưu kho giọng riêng.
* `free_user`: Người dùng trải nghiệm miễn phí với giới hạn nghiêm ngặt (tối đa 3 lượt clone, không được lưu quá 1 hồ sơ giọng).

### 3.2. Trạng thái tài khoản (`status`)
* `active`: Tài khoản đang hoạt động bình thường.
* `suspended`: Tài khoản bị khóa do vi phạm chính sách hoặc hết hạn sử dụng.
* `pending_verification`: Tài khoản vừa đăng ký, đang chờ xác nhận qua email.

---

## 🔗 4. QUAN HỆ VỚI CÁC BẢNG KHÁC (RELATIONSHIPS)

* `1 - n` với `voice_samples`: Một user có thể tải lên nhiều đoạn thu âm mẫu.
* `1 - n` với `voice_profiles`: Một user có thể sở hữu nhiều hồ sơ giọng độc quyền trong kho.
* `1 - n` với `audio_generations`: Một user lưu giữ toàn bộ lịch sử các lần sinh giọng.
* `1 - n` với `video_projects`: Một user có thể tạo nhiều dự án video.

---

## 📄 5. MẪU BẢN GHI THỰC TẾ (SAMPLE JSON DOCUMENT)

```json
{
  "_id": {
    "$oid": "664b1f1e8a9d3c2b1a000001"
  },
  "email": "creator.pro@videoai.studio",
  "password_hash": "$2b$12$K1Q2W3E4R5T6Y7U8I9O0P1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
  "full_name": "Phan Minh Khang",
  "avatar_url": "https://res.cloudinary.com/video-ai-cloud/image/upload/v1793500000/avatars/user_664b1f1e.png",
  "role": "creator",
  "status": "active",
  "credits": 250,
  "usage_quota": {
    "tier": "pro",
    "max_monthly_duration_seconds": 7200.0,
    "used_duration_seconds": 645.8,
    "max_voice_profiles": 20,
    "reset_date": {
      "$date": "2026-12-01T00:00:00.000Z"
    }
  },
  "created_at": {
    "$date": "2026-11-01T10:15:30.000Z"
  },
  "updated_at": {
    "$date": "2026-11-02T06:40:12.000Z"
  }
}
```

---

## ⚡ 6. QUY TẮC INDEXING (CHỈ MỤC TỐI ƯU TRUY VẤN)

1. **Unique Index:** `{ "email": 1 }` với option `unique: true`
   - Đảm bảo tốc độ đăng nhập nhanh tức thì ($O(1)$) và ngăn chặn đăng ký trùng email.
2. **Compound Index:** `{ "role": 1, "status": 1 }`
   - Phục vụ Admin Dashboard khi cần lọc danh sách Creator đang hoạt động.

