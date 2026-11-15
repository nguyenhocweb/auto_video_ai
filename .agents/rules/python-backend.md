# Quy chuẩn bắt buộc khi viết code Python Backend

Mọi thao tác liên quan đến backend Python (FastAPI, Pydantic v2, SQLAlchemy 2.0) trong dự án phải tuân thủ chuẩn mực tại:
[.agents/skills/python-backend-architecture/SKILL.md](file:///d:/DuAnCaNhan/video_ai/.agents/skills/python-backend-architecture/SKILL.md)

- **Thư mục mã nguồn bắt buộc**: Toàn bộ code backend BẮT BUỘC nằm trong `be/src/`. CẤM TUYỆT ĐỐI tạo thư mục `app/` (Cấm `be/app/`).
- **Mô hình**: Role-based Modular Architecture (`src/modules/[role]/[feature]/...`).
- **Layers chuẩn**: Mỗi module feature gồm 4 file chính: `router.py`, `schemas.py`, `service.py`, `repository.py`. Không xé nhỏ file theo từng CRUD.
- **Hạ tầng cốt lõi**: Nằm trong `src/core/` (config, database, security, dependencies, middlewares, exceptions, utils, constants, engines).
- **Giao tiếp liên module**: Chỉ qua Service (`Service-to-Service Injection`). Cấm gọi chéo Router hoặc import chéo Repository.
- **Quy chuẩn thư mục Tests**: Mọi file kiểm thử/test/debug/probe BẮT BUỘC nằm trong `be/tests/`. CẤM TUYỆT ĐỐI tạo file test ở thư mục gốc `be/` (`test_*.py`, `inspect_*.py`, `debug_*.py`).
- **Quy chuẩn thư mục Shared**: Mọi file tiện ích, dịch vụ, module dùng chung cho nhiều vai trò BẮT BUỘC đặt trong `src/modules/shared/` (nghiệp vụ dùng chung) hoặc `src/core/` (hạ tầng/engine/tiện ích dùng chung). CẤM TUYỆT ĐỐI để file mồ côi nằm ngoài root như trường hợp `be/inspect_headers.py`.

