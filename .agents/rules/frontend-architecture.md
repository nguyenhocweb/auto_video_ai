# Quy chuẩn bắt buộc khi viết code Frontend Next.js

Mọi thao tác liên quan đến frontend (Next.js App Router, React Query, Tailwind CSS, Zod, TypeScript) trong dự án phải tuân thủ nghiêm ngặt chuẩn mực tại:
[.agents/skills/frontend-nextjs-architecture/SKILL.md](file:///d:/DuAnCaNhan/video_ai/.agents/skills/frontend-nextjs-architecture/SKILL.md)

### Tóm tắt các nguyên tắc cốt lõi:
1. **Mô hình Role-based Feature-Sliced Design with Granular SRP:**
   - Phân cấp: `Role (fe/src/features/[role]/)` $\longrightarrow$ `Feature ([feature]/)` $\longrightarrow$ `Layer (component/, hook/, service/, schema/, type/, constants/)` $\longrightarrow$ `Action (CRUD chia nhỏ)`.
   - Các tính năng dùng chung đặt trong `fe/src/features/shared/`.
   - Hạ tầng kỹ thuật, wrapper, layout dùng chung đặt trong `fe/src/core/`.
   - Routing `fe/src/app/` giữ ở mức mỏng tối đa, không chứa mã xử lý form hay fetch API phức tạp.
2. **Nguyên tắc Granular SRP (Single Responsibility Principle):**
   - **CẤM gộp chung tất cả vào 1 component hoặc 1 hook.**
   - Component chia nhỏ: `List.tsx`, `CreateForm.tsx`, `UpdateForm.tsx`, `DetailModal.tsx`, `StatsCards.tsx`.
   - Hook chia nhỏ: `useGet...ts`, `useCreate...ts`, `useUpdate...ts`, `useDelete...ts`.
   - Service chia nhỏ: `[feature].get.service.ts`, `[feature].create.service.ts`,...
3. **9 Điều cấm kỵ tuyệt đối ở Frontend:**
   - CẤM dùng icon từ `lucide-react` (chỉ dùng `react-icons`).
   - CẤM gọi `axiosClient` trong Component (phải qua React Query `hook/`).
   - CẤM import named export `axiosClient` (luôn dùng `import axiosClient from "@/src/core/api/axios-instance"`).
   - CẤM dùng `window.confirm()` (bắt buộc dùng `<ConfirmModal>`).
   - CẤM quên Animation (mọi page/card lớn phải bọc trong `<FadeIn>`).
   - CẤM thiếu Pagination (bảng danh sách phải có phân trang và dropdown chọn rows per page).
   - CẤM quên `staleTime: 60 * 1000` trong `useQuery`.
   - CẤM hardcode `z.string()` (tái sử dụng `validator` trong `@/src/core/lib/validations.ts`).
   - CẤM import `date-fns` (dùng native `Date`).

