---
name: python-backend-architecture
description: >-
  Chuẩn mực kiến trúc backend Python (FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic) theo mô hình Role-based Modular Architecture. Bắt buộc tuân theo khi thiết kế, triển khai hoặc sửa đổi code backend Python trong dự án.
---

# CHUẨN MỰC KIẾN TRÚC BACKEND PYTHON (FASTAPI + PYDANTIC V2 + SQLALCHEMY)
## Mô hình: Role-based Modular Architecture (Tôn trọng Idiom Python)

Tài liệu này là quy chuẩn bắt buộc khi phát triển backend bằng Python (FastAPI / Pydantic v2 / SQLAlchemy 2.0 / Alembic).

---

## 🏛️ 1. NGUYÊN TẮC PHÂN CẤP TỔ CHỨC THƯ MỤC

$$\mathbf{Role\ (Vai\ trò)} \longrightarrow \mathbf{Feature\ (Chức\ năng)} \longrightarrow \mathbf{Layer\ (Router\ \vert\ Schema\ \vert\ Service\ \vert\ Repository)}$$

1. **Cấp 1 - Role (Vai trò hệ thống):**
   - `system_admin`: Quản trị viên hệ thống cấp cao.
   - `restaurant_manager`: Quản lý nhà hàng / chi nhánh.
   - `brand_owner`: Chủ thương hiệu chuỗi nhà hàng.
   - `staff`: Nhân viên phục vụ, thu ngân, bếp.
   - `customer`: Khách hàng sử dụng dịch vụ.
   - `public`: Các endpoint công khai không cần đăng nhập.
   - `shared`: Module dùng chung (auth, notifications, media, llm, vector).
2. **Cấp 2 - Feature (Nghiệp vụ độc lập):** Mỗi nghiệp vụ là một package riêng (ví dụ: `subscription`, `review`, `reservation`, `menu`).
3. **Cấp 3 - Layer (Mối quan tâm kỹ thuật theo Idiom Python):**
   - **Tuyệt đối không xé nhỏ file theo từng CRUD** (như `.create.py`, `.get.py`) vì gây circular import và làm phân mảnh namespace.
   - Gom theo **Entity Module** với các file chuyên trách: `router.py`, `schemas.py`, `service.py`, `repository.py`.

---

## 🧱 2. CẤU TRÚC HẠ TẦNG CỐT LÕI: `src/core/` VÀ CẤU HÌNH TRONG PYTHON

Hạ tầng dùng chung được đặt trong thư mục `src/core/`, chịu trách nhiệm cấu hình, bảo mật, kết nối CSDL và các middleware:

```text
be/
├── src/                                                # [THƯ MỤC MÃ NGUỒN CHÍNH - BẮT BUỘC, CẤM DÙNG APP/]
│   ├── core/                                           # [HẠ TẦNG KỸ THUẬT DÙNG CHUNG TOÀN ỨNG DỤNG]
│   │   ├── config.py                                   # Pydantic BaseSettings đọc biến môi trường .env
│   │   ├── database.py                                 # SQLAlchemy async_engine, async_sessionmaker, Base
│   │   ├── security.py                                 # Password hashing (passlib/bcrypt), JWT encode/decode
│   │   ├── dependencies.py                             # Reusable Depends: get_db, get_current_user, require_role
│   │   │
│   │   ├── middlewares/                                # CÁC FASTAPI/STARLETTE MIDDLEWARES
│   │   │   ├── cors.py                                 # Cấu hình CORSMiddleware
│   │   │   ├── logging.py                              # Middleware ghi log request time, path, client ip
│   │   │   └── error_handler.py                        # Exception handlers bắt HTTPException, RequestValidationError
│   │   │
│   │   ├── exceptions/                                 # HỆ THỐNG LỖI TÙY BIẾN (CUSTOM EXCEPTIONS)
│   │   │   ├── base.py                                 # AppException base class
│   │   │   ├── conflict.py                             # 409 ConflictException
│   │   │   ├── not_found.py                            # 404 NotFoundException
│   │   │   └── forbidden.py                            # 403 ForbiddenException
│   │   │
│   │   ├── utils/                                      # HÀM TIỆN ÍCH THUẦN TÚY (PURE UTILITIES)
│   │   │   ├── pagination.py                           # Helper phân trang Params (page, size, total)
│   │   │   ├── cloudinary_signer.py                    # Sinh signature upload ảnh lên Cloudinary
│   │   │   ├── payos_client.py                         # Client tích hợp cổng thanh toán PayOS
│   │   │   └── websocket_manager.py                    # Quản lý active WebSocket connections realtime
│   │   │
│   │   └── constants/                                  # HẰNG SỐ & CHUỖI CỐ ĐỊNH
│   │       ├── roles.py                                # Enums: "Admin", "Quản lý nhà hàng",...
│   │       └── messages.py                             # Chuỗi thông báo hệ thống
```

---

## 📂 3. CÂY CẤU TRÚC THƯ MỤC MODULES THEO ROLE (Ví dụ: `subscription` thuộc `system_admin`)

```text
be/src/modules/system_admin/
├── subscription/                                       # [CẤP 2] Tên tính năng
│   ├── __init__.py
│   ├── router.py                                       # [CẤP 3] APIRouter chứa các endpoints HTTP
│   ├── schemas.py                                      # [CẤP 3] Pydantic models (Create, Update, Response, Filter)
│   ├── service.py                                      # [CẤP 3] SubscriptionService chứa 100% business logic
│   └── repository.py                                   # [CẤP 3] SubscriptionRepository chứa queries SQLAlchemy
│
├── review/
│   ├── __init__.py
│   ├── router.py
│   ├── schemas.py
│   ├── service.py
│   └── repository.py
│
└── router.py                                           # Router tổng gom các router của system_admin
```

---

## 🌐 4. CẤU TRÚC THƯ MỤC CHỨC NĂNG DÙNG CHUNG (SHARED MODULES)

Khi một tính năng nghiệp vụ được **nhiều Role cùng sử dụng** (như Thông báo, Media/Cloudinary, Xác thực tài khoản), tính năng đó được đặt trong `src/modules/shared/`:

### 4.1. Bảng phân định: `core/` vs `modules/shared/` vs `modules/[role]/`

| Tiêu chí | `src/core/` | `src/modules/shared/` | `src/modules/[role]/` |
| :--- | :--- | :--- | :--- |
| **Bản chất** | Hạ tầng kỹ thuật (Technical Infra) | Nghiệp vụ dùng chung (Shared Business Feature) | Nghiệp vụ đặc thù (Role-Specific Feature) |
| **Chứa DB Model?** | **KHÔNG**. Không chứa SQLAlchemy queries nghiệp vụ. | **CÓ**. Tương tác CSDL (Notification, Media, User). | **CÓ**. Tương tác CSDL riêng của Role. |
| **Phạm vi dùng** | Toàn ứng dụng (Security, Config, Middlewares). | Nhiều Role cùng gọi (Admin, Manager, Customer). | Chỉ duy nhất 1 Role được quyền gọi. |
| **Ví dụ cụ thể** | `config.py`, `database.py`, JWT encode, `get_db`. | `notifications/`, `cloudinary/`, `auth/`, `llm/`. | `subscription/` (chỉ Admin), `reservations/` (chỉ Nhà hàng). |

---

### 4.2. Cây cấu trúc chi tiết thư mục `modules/shared/`:

```text
be/src/modules/shared/
├── notifications/                                      # Chức năng thông báo đa kênh toàn hệ thống
│   ├── __init__.py
│   ├── router.py                                       # Endpoints: GET /notifications, PATCH /read
│   ├── schemas.py                                      # NotificationResponse, NotificationFilter
│   ├── service.py                                      # NotificationService (get, mark_as_read, create_internal)
│   └── repository.py                                   # NotificationRepository (query DB)
│
├── cloudinary/                                         # Dịch vụ upload ảnh ký số (Signed Upload)
│   ├── __init__.py
│   ├── router.py                                       # GET /api/v1/shared/cloudinary/signature
│   ├── schemas.py                                      # SignatureRequest, SignatureResponse
│   └── service.py                                      # Tạo signature bằng Cloudinary SDK
│
├── auth/                                               # Đăng nhập, Đổi mật khẩu, Refresh Token
│   ├── router.py
│   ├── schemas.py
│   ├── service.py
│   └── repository.py
│
├── llm/                                                # Tương tác với LLM / Chatbot dùng chung
└── shared_router.py                                    # Router tổng gom các shared sub-routers
```

---

### 4.3. Quy tắc giao tiếp liên Module (Service-to-Service Injection)

Khi một Module của Role (ví dụ: `restaurant_manager/order`) muốn gửi thông báo cho khách hàng:

* ✅ **ĐÚNG (Service gọi Service):**
  Trong `order/service.py`, khởi tạo hoặc inject `NotificationService`:
  ```python
  from sqlalchemy.orm import Session
  from app.modules.shared.notifications.service import NotificationService
  from app.modules.shared.notifications.schemas import NotificationCreateInternal

  class OrderService:
      def __init__(self, db: Session):
          self.db = db
          self.order_repo = OrderRepository(db)
          self.notification_service = NotificationService(db)

      async def create_order(self, payload: OrderCreate) -> OrderResponse:
          # 1. Tạo đơn hàng trong DB
          new_order = await self.order_repo.create(payload)

          # 2. Gọi NotificationService dùng chung
          await self.notification_service.create_notification(
              NotificationCreateInternal(
                  user_id=payload.customer_id,
                  title="Đơn hàng mới đã được xác nhận",
                  content=f"Đơn hàng #{new_order.id} của bạn đang được xử lý.",
                  type="ORDER_CONFIRMED"
              )
          )
          return new_order
  ```

* ❌ **SAI (Cấm kỵ tuyệt đối):**
  1. **CẤM gọi chéo Router:** Không bao giờ gọi endpoint HTTP nội bộ giữa các module trong cùng 1 process.
  2. **CẤM gọi chéo Repository:** Module `order` không được import `NotificationRepository` vì sẽ làm bỏ sót logic validation và WebSocket broadcast của NotificationService.

---

## 🏷️ 5. QUY CHUẨN ĐẶT TÊN FILE & CODE TRONG PYTHON (PEP 8)

| Thành phần | Tên File (snake_case) | Tên Class (PascalCase) | Tên Hàm / Biến (snake_case) |
| :--- | :--- | :--- | :--- |
| **Config** | `config.py` | `Settings` (kế thừa `BaseSettings`) | `settings = Settings()` |
| **Router** | `router.py` | — | `get_subscriptions()`, `create_order()` |
| **Schema** | `schemas.py` | `SubscriptionCreate`, `SubscriptionResponse` | `name`, `duration_months`, `is_active` |
| **Service** | `service.py` | `SubscriptionService`, `NotificationService` | `create_subscription()`, `mark_as_read()` |
| **Repository** | `repository.py` | `SubscriptionRepository` | `get_by_id()`, `find_active_list()` |
| **Model** | `models.py` / `[entity].py` | `SubscriptionPlan`, `Notification` | `__tablename__ = "subscriptions"` |
| **Middleware** | `[name].py` | `LoggingMiddleware` | `dispatch(request, call_next)` |

---

## ⚙️ 6. QUY CHUẨN CODE MẪU PYTHON (FASTAPI)

### A. File Cấu hình (`core/config.py`)
```python
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Restaurant Management API"
    ENV: str = "development"
    PORT: int = 8000
    DATABASE_URL: str
    JWT_SECRET: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 ngày
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
```

### B. Custom Exception Handler (`core/exceptions/conflict.py`)
```python
from fastapi import HTTPException, status

class ConflictException(HTTPException):
    def __init__(self, detail: str = "Dữ liệu bị xung đột hoặc đã tồn tại"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)
```

### C. Dependency Injection Phân Quyền (`core/dependencies.py`)
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def require_role(allowed_roles: list[str]):
    def role_checker(token: str = Depends(oauth2_scheme)):
        payload = decode_access_token(token)
        user_role = payload.get("role")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền thực hiện hành động này"
            )
        return payload
    return role_checker
```

---

## 🚫 7. CÁC ĐIỀU CẤM KỴ TUYỆT ĐỐI Ở BACKEND PYTHON

1. **CẤM xé vụn file theo kiểu Node.js:** Không tạo `subscription.create.service.py`. Python gom các methods vào `service.py`, `schemas.py`, `repository.py` trong từng module.
2. **CẤM truy vấn CSDL trong Router:** Router chỉ nhận request, validate qua Pydantic và gọi Service.
3. **CẤM hardcode credentials:** Mọi thông tin nhạy cảm phải đọc từ `pydantic-settings` (`config.py`).
4. **CẤM bỏ qua type hinting:** Mọi hàm phải có type hint rõ ràng (`def get_user(user_id: str) -> User:`).
5. **CẤM dùng mutable default arguments:** Tuyệt đối không dùng `def func(items=[]):` trong Python (dùng `items: list | None = None`).
6. **CẤM file dài quá 300 dòng:** Mọi file Python backend (`.py`) phải có độ dài **TỐI ĐA 300 DÒNG**. Khi file chạm ngưỡng 300 dòng, bắt buộc phải tách các hàm, sub-router (`training_router.py`), helper thành các file riêng biệt mang tính module hóa.

