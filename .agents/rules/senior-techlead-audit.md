# QUY CHUẨN THẨM ĐỊNH KỸ THUẬT SENIOR TECH LEAD (REALITY-CHECK AUDIT)

Khi thiết kế giải pháp kỹ thuật, phân tích tính khả thi, lựa chọn tech stack hoặc tối ưu hiệu năng đồ họa / render video:
👉 [senior-techlead-audit](file:///d:/DuAnCaNhan/video_ai/.agents/skills/senior-techlead-audit/SKILL.md)

### Nguyên tắc thẩm định cốt lõi:
1. **Triệt tiêu bẫy Over-engineering:** Tuyệt đối không tự viết C/C++ thuần từ đầu khi đã có các giải pháp pipeline GPU lai (Hybrid FFmpeg/NVENC/GLSL) nhanh hơn gấp nhiều lần với chi phí bảo trì thấp hơn.
2. **Khung thẩm định 10 trục chi tiết:** Bắt buộc đối chiếu qua 10 trục: Phần cứng, Kiến trúc, Thuật toán, Quản lý bộ nhớ VRAM, Đồng bộ nhịp Beat, Độ trung thực đồ họa, Khả năng mở rộng qua JSON Spec, Chịu lỗi, Tốc độ ra mắt và Giám sát vận hành.
3. **Thang điểm 10 chuẩn hóa:** Đánh giá khách quan, chỉ rõ thiếu sót chí mạng trước khi code hoặc trước khi đưa vào sản xuất.
