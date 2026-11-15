---
name: frontend-nextjs-architecture
description: >-
  Chuẩn mực kiến trúc Frontend (Next.js, React Query, Tailwind CSS) theo mô hình Role-based Feature-Sliced Design with Granular SRP. Bắt buộc tuân theo khi thiết kế, triển khai hoặc sửa đổi code frontend (fe/) trong dự án.
---

# CHUẨN MỰC KIẾN TRÚC FRONTEND (NEXT.JS + REACT QUERY + TAILWIND)
## Mô hình: Role-based Feature-Sliced Design with Granular SRP

Tài liệu này là quy chuẩn bắt buộc khi tạo mới hoặc bảo trì các thành phần hạ tầng (`core/`), giao diện tính năng (`features/`) và định tuyến (`app/`) trong dự án Frontend.

---

## 🏛️ 1. NGUYÊN TẮC PHÂN CẤP TỔ CHỨC THƯ MỤC

$$\mathbf{Role\ (Vai\ trò)} \longrightarrow \mathbf{Feature\ (Chức\ năng)} \longrightarrow \mathbf{Layer\ (Tầng\ kỹ\ thuật)} \longrightarrow \mathbf{Action\ (CRUD\ chia\ nhỏ)}$$

1. **Cấp 1 - Role (Vai trò / Phân quyền):**
   - `system_admin`: Giao diện Quản trị viên hệ thống (`app/(dashboard)/system/...`).
   - `quan_ly_nha_hang`: Giao diện Quản lý nhà hàng chi nhánh (`app/(dashboard)/quan-ly-nha-hang/...`).
   - `brand_owner`: Giao diện Chủ thương hiệu (`app/(dashboard)/brand_owner/...`).
   - `staff`: Giao diện Nhân viên / Bếp / POS.
   - `customer`: Giao diện Khách hàng đặt bàn, theo dõi đơn.
   - `public`: Giao diện công khai (Trang chủ, Menu, Giới thiệu, Đánh giá).
   - `shared`: Thành phần dùng chung (Profile cá nhân, Đổi mật khẩu, Chuông thông báo).
2. **Cấp 2 - Feature (Nghiệp vụ độc lập):** Mỗi tính năng là một thư mục riêng (ví dụ: `subscriptions`, `reviews`, `reservations`, `promotions`, `crm`).
3. **Cấp 3 - Layer (Mối quan tâm kỹ thuật):** `component/`, `hook/`, `service/`, `schema/`, `type/`, `constants/`.
4. **Cấp 4 - Action (CRUD chia nhỏ theo Single Responsibility Principle):**
   - **CẤM GỘP CHUNG TẤT CẢ VÀO 1 COMPONENT HOẶC 1 HOOK**. Phải tách nhỏ:
     - Component: `List.tsx`, `CreateForm.tsx`, `UpdateForm.tsx`, `DetailModal.tsx`, `StatsCards.tsx`.
     - Hook: `useGet...ts`, `useCreate...ts`, `useUpdate...ts`, `useDelete...ts`.
     - Service: `[feature].get.service.ts`, `[feature].create.service.ts`,...

---

## 🧱 2. CẤU TRÚC HẠ TẦNG CỐT LÕI: `fe/src/core/` (CORE INFRASTRUCTURE)

Toàn bộ hạ tầng kỹ thuật, thư viện wrapper, layout toàn cục và custom hooks dùng chung được đặt tại `fe/src/core/`:

```text
fe/src/core/
├── api/                                                # CẤU HÌNH HTTP CLIENT TOÀN CỤC
│   └── axios-instance.ts                               # [BẮT BUỘC] Instance axiosClient default export (Interceptors, JWT, Refresh Token)
│
├── components/                                         # THÀNH PHẦN GIAO DIỆN DÙNG CHUNG CỐT LÕI
│   ├── animation/                                      # CÁC WRAPPER HIỆU ỨNG (ANIMATION WRAPPERS)
│   │   ├── FadeIn.tsx                                  # [BẮT BUỘC] Bọc mọi Page/Card để tạo hiệu ứng mượt mà
│   │   └── SlideIn.tsx                                 # Hiệu ứng trượt từ các hướng
│   │
│   ├── layout/                                         # THÀNH PHẦN KHUNG SƯỜN TOÀN HỆ THỐNG
│   │   ├── public-header.tsx                           # Thanh điều hướng trên cùng (Logo, Menu, Chuông thông báo, User Avatar)
│   │   ├── public-sidebar.tsx                          # Thanh sidebar menu phân quyền theo Role
│   │   ├── public-footer.tsx                           # Chân trang hệ thống
│   │   ├── public-ConfirmModal.tsx                     # [BẮT BUỘC] Modal xác nhận xóa / cảnh báo (thay thế window.confirm)
│   │   ├── public-stat-Card.tsx                        # Thẻ Card hiển thị chỉ số thống kê KPI
│   │   └── home-sections/                              # Các block hiển thị trang chủ công khai
│   │
│   ├── providers/                                      # CÁC PROVIDER CONTEXT TOÀN CỤC
│   │   └── QueryProvider.tsx                           # Provider bọc @tanstack/react-query QueryClientProvider
│   │
│   ├── form/                                           # CÁC TRƯỜNG NHẬP LIỆU CHUẨN HÓA
│   │   ├── InputField.tsx                              # Input có label, error message, dấu sao đỏ
│   │   ├── SelectField.tsx                             # Dropdown chọn dữ liệu
│   │   └── TextareaField.tsx
│   │
│   └── ui/                                             # CÁC UI PRIMITIVES NHỎ GỌN
│       ├── Button.tsx                                  # Nút bấm chuẩn hiệu ứng hover, loading
│       ├── Modal.tsx                                   # Container modal cơ sở
│       ├── Badge.tsx                                   # Thẻ tag trạng thái màu
│       └── Table.tsx                                   # Bảng dữ liệu cơ sở
│
├── hooks/                                              # BỘ HOOK TIỆN ÍCH CAO CẤP DÙNG CHUNG
│   ├── useDebounce.ts                                  # [BẮT BUỘC] Debounce input tìm kiếm: useDebounce({ value, delay })
│   ├── usePagination.ts                                # Quản lý logic phân trang & rows per page
│   ├── useRandomColor.ts                               # Sinh cặp màu ngẫu nhiên hài hòa cho tags/badges
│   ├── useScrollSpy.ts & useScrollTo.ts                # Theo dõi và cuộn trang mượt mà
│   ├── useSocket.ts                                    # Kết nối realtime WebSocket / Socket.IO
│   └── useRealtimeUpdates.ts                           # Tự động lắng nghe sự kiện để invalidateQueries
│
├── lib/                                                # THƯ VIỆN & CẤU HÌNH PHỤ TRỢ
│   ├── validations.ts                                  # [BẮT BUỘC] validator templates cho Zod (validator.string, validator.phone)
│   ├── errorHandle.ts                                  # Trích xuất thông điệp lỗi từ API error response
│   └── Opentime.ts                                     # Định dạng giờ hoạt động nhà hàng
│
└── utils/                                              # HÀM THUẦN TÚY TIỆN ÍCH
    └── formatCurrency.ts                               # Định dạng tiền tệ VND: 100.000 đ
```

---

## 📂 3. CÂY CẤU TRÚC THƯ MỤC FEATURES THEO ROLE (Ví dụ: `subscriptions` thuộc `system_admin`)

```text
fe/src/features/system_admin/
├── subscriptions/                                      # [CẤP 2] Tên tính năng nghiệp vụ
│   ├── component/                                      # [CẤP 3] Tầng Giao diện người dùng
│   │   ├── SubscriptionsList.tsx                       # [CẤP 4] Bảng dữ liệu phân trang & actions
│   │   ├── CreateSubscriptionForm.tsx                  # [CẤP 4] Form modal thêm mới gói
│   │   ├── UpdateSubscriptionForm.tsx                  # [CẤP 4] Form modal chỉnh sửa gói
│   │   ├── SubscriptionDetailModal.tsx                 # [CẤP 4] Modal xem chi tiết thông tin
│   │   ├── SubscriptionStatusToggle.tsx                # [CẤP 4] Nút bật/tắt trạng thái gói
│   │   └── SubscriptionStatsCards.tsx                  # [CẤP 4] Các thẻ thống kê KPI phía trên
│   │
│   ├── hook/                                           # [CẤP 3] Tầng React Query Hooks
│   │   ├── useGetSubscription.ts                       # [CẤP 4] useQuery lấy danh sách (staleTime 1m)
│   │   ├── useCreateSubscription.ts                    # [CẤP 4] useMutation tạo mới (toast + invalidate)
│   │   ├── useUpdateSubscription.ts                    # [CẤP 4] useMutation cập nhật
│   │   ├── useDeleteSubscription.ts                    # [CẤP 4] useMutation xóa (gắn ConfirmModal)
│   │   └── useUpdateSubscriptionStatus.ts              # [CẤP 4] useMutation đổi trạng thái
│   │
│   ├── service/                                        # [CẤP 3] Tầng Gọi API HTTP (axiosClient)
│   │   ├── subscription.get.service.ts                 # [CẤP 4] axiosClient.get(...)
│   │   ├── subscription.create.service.ts              # [CẤP 4] axiosClient.post(...)
│   │   ├── subscription.update.service.ts              # [CẤP 4] axiosClient.put(...)
│   │   ├── subscription.delete.service.ts              # [CẤP 4] axiosClient.delete(...)
│   │   └── subscription.status.service.ts              # [CẤP 4] axiosClient.patch(...)
│   │
│   ├── schema/                                         # [CẤP 3] Tầng Form Validation (Zod)
│   │   ├── subscription.create.schema.ts               # [CẤP 4] Zod schema form tạo mới
│   │   ├── subscription.update.schema.ts               # [CẤP 4] Zod schema form chỉnh sửa
│   │   └── subscription.status.schema.ts               # [CẤP 4] Zod schema đổi trạng thái
│   │
│   ├── type/                                           # [CẤP 3] Tầng TypeScript Type Definitions
│   │   └── subscription.type.ts                        # [CẤP 4] Interfaces Subscription, Payload, ApiResponse
│   │
│   └── constants/                                      # [CẤP 3] (Tùy chọn) Hằng số nội bộ
│       └── subscription.constant.ts                    # [CẤP 4] Màu sắc badge trạng thái, default filters
```

---

## 🌐 4. CẤU TRÚC TÍNH NĂNG DÙNG CHUNG (SHARED FEATURES)

Khi một tính năng giao diện được **nhiều Role cùng dùng** (ví dụ: Quản lý thông tin cá nhân, Đổi mật khẩu, Chuông thông báo Header, Upload ảnh Cloudinary), tính năng đó được đặt trong `fe/src/features/shared/`:

### 4.1. Bảng phân định: `core/` vs `features/shared/` vs `features/[role]/`

| Tiêu chí | `fe/src/core/` | `fe/src/features/shared/` | `fe/src/features/[role]/` |
| :--- | :--- | :--- | :--- |
| **Bản chất** | Hạ tầng kỹ thuật, Wrapper, Primitives | Tính năng nghiệp vụ dùng chung | Tính năng nghiệp vụ đặc thù của Role |
| **Chứa API Call?** | **KHÔNG** (Chỉ chứa `axiosClient` rỗng). | **CÓ**. Có gọi API riêng (Profile, Notification). | **CÓ**. Gọi API nghiệp vụ của Role đó. |
| **Chứa Form/Schema?**| **KHÔNG**. Chỉ chứa primitives input. | **CÓ**. Có Zod schema (Form đổi MK, Form profile). | **CÓ**. Có Zod schema riêng của tính năng. |
| **Ví dụ cụ thể** | `<FadeIn>`, `<ConfirmModal>`, `useDebounce`. | `shared/profile/`, `shared/cloudinary/`. | `system_admin/subscriptions/`, `customer/orders/`. |

---

### 4.2. Cây cấu trúc chi tiết thư mục `features/shared/`:

```text
fe/src/features/shared/
├── profile/                                            # Chức năng xem & chỉnh sửa Profile cá nhân
│   ├── profile_component/
│   │   ├── information_profile.tsx                     # Component hiển thị & form cập nhật thông tin cá nhân
│   │   └── changePassword.tsx                          # Component form đổi mật khẩu tài khoản
│   ├── hook/
│   │   ├── useGetProfile.ts                            # useQuery lấy thông tin cá nhân
│   │   ├── useUpdateProfile.ts                         # useMutation cập nhật họ tên, sđt, avatar
│   │   └── useChangePassword.ts                        # useMutation đổi mật khẩu
│   ├── service/
│   │   ├── profile.get.service.ts
│   │   ├── profile.update.service.ts
│   │   └── profile.password.service.ts
│   ├── schema/
│   │   ├── profile.update.schema.ts
│   │   └── changePassword.schema.ts
│   └── type/
│       └── profile.type.ts
│
├── cloudinary/                                         # Tiện ích upload ảnh lên Cloudinary
│   ├── hook/
│   │   └── useUploadCloudinary.ts                      # Hook nhận file -> lấy signature -> upload trực tiếp Cloudinary
│   ├── service/
│   │   ├── cloudinary.sign.service.ts                  # Gọi BE lấy signature
│   │   └── cloudinary.upload.service.ts                # POST trực tiếp lên Cloudinary API
│   └── type/
│       └── cloudinary.type.ts
│
└── notifications/                                      # Popover danh sách thông báo trên Header
    ├── component/
    │   ├── NotificationBell.tsx                        # Icon chuông kèm badge số lượng chưa đọc
    │   └── NotificationDropdown.tsx                    # Danh sách thông báo ngắn dạng dropdown
    ├── hook/
    │   ├── useGetUnreadNotifications.ts
    │   └── useMarkAsRead.ts
    └── service/
        └── notification.shared.service.ts
```

---

## 🚦 5. CẤU TRÚC ĐỊNH TUYẾN NEXT.JS APP ROUTER (`fe/src/app/`)

Thư mục `app/` được giữ ở mức mỏng tối đa, **không chứa mã nguồn xử lý form hay fetch API phức tạp**, chỉ làm nhiệm vụ layout và mount component:

```text
fe/src/app/
├── (dashboard)/                                        # NHÓM ROUTE CẦN ĐĂNG NHẬP (CÓ SIDEBAR & HEADER)
│   ├── layout.tsx                                      # Layout chung: Render <Sidebar />, <Header />, <main>{children}</main>
│   │
│   ├── system/                                         # [ROLE 1: SYSTEM ADMIN]
│   │   ├── dashboard/page.tsx                          # Thống kê tổng quan hệ thống
│   │   ├── subscriptions/page.tsx                      # Mount <SubscriptionsList /> bên trong <FadeIn>
│   │   ├── reviews/page.tsx                            # Quản lý đánh giá toàn hệ thống
│   │   ├── notifications/page.tsx                      # Quản lý thông báo
│   │   ├── profile/page.tsx                            # Mount <InformationProfile /> từ features/shared
│   │   └── ...
│   │
│   ├── quan-ly-nha-hang/                               # [ROLE 2: QUẢN LÝ NHÀ HÀNG]
│   │   ├── dashboard/page.tsx
│   │   ├── reservations/page.tsx                       # Quản lý đặt bàn
│   │   ├── promotions/page.tsx                         # Khuyến mãi chi nhánh
│   │   └── crm/page.tsx                                # Khách hàng thân thiết
│   │
│   └── brand_owner/                                    # [ROLE 3: CHỦ THƯƠNG HIỆU]
│       ├── dashboard/page.tsx
│       └── crm/page.tsx
│
├── (public)/                                           # NHÓM ROUTE CÔNG KHAI (KHÔNG CẦN LOGIN)
│   ├── layout.tsx                                      # Layout công khai: <PublicHeader />, {children}, <PublicFooter />
│   ├── page.tsx                                        # Trang chủ giới thiệu
│   ├── about/page.tsx                                  # Giới thiệu
│   ├── contact/page.tsx                                # Liên hệ
│   └── reviews/page.tsx                                # Đánh giá công khai
│
├── globals.css                                         # Tailwind directives & global utility classes
└── layout.tsx                                          # Root layout: bọc <html>, <body>, <QueryProvider>, <Toaster>
```

---

## 🏷️ 6. BẢNG QUY CHUẨN ĐẶT TÊN FILE FRONTEND (NAMING CONVENTIONS)

| Thành phần | Quy tắc đặt tên File | Ví dụ cụ thể | Quy tắc Export |
| :--- | :--- | :--- | :--- |
| **Component** | PascalCase theo tính năng | `SubscriptionsList.tsx`<br>`CreateSubscriptionForm.tsx`<br>`NotificationBell.tsx` | Named export (`export const SubscriptionsList = ...`) |
| **Hook** | camelCase bắt đầu bằng `use` | `useGetSubscription.ts`<br>`useCreateSubscription.ts`<br>`useDebounce.ts` | Named export (riêng `useDebounce` export default) |
| **Service** | `[feature].[action].service.ts` | `subscription.get.service.ts`<br>`subscription.create.service.ts` | Named export functions |
| **Schema** | `[feature].[action].schema.ts` | `subscription.create.schema.ts`<br>`changePassword.schema.ts` | Export Zod Schema + Inferred Type |
| **Type** | `[feature].type.ts` | `subscription.type.ts`<br>`profile.type.ts` | Export TypeScript interfaces |
| **Constant**| `[feature].constant.ts` | `subscription.constant.ts` | Export const objects |
| **App Route**| Chữ thường theo Next.js | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` | Export default function |

---

## ⚙️ 7. QUY CHUẨN CODE MẪU FRONTEND

### A. HTTP Service (`service/subscription.get.service.ts`)
*Luôn import `axiosClient` dạng DEFAULT export:*
```typescript
import axiosClient from "@/src/core/api/axios-instance";
import { SubscriptionListResponse, SubscriptionFilterParams } from "../type/subscription.type";

export const getSubscriptionsService = async (params?: SubscriptionFilterParams) => {
  return await axiosClient.get<SubscriptionListResponse>("/api/v1/system_admin/subscription", {
    params,
  });
};
```

### B. Custom Hook React Query (`hook/useGetSubscription.ts`)
*Luôn đặt `staleTime: 60 * 1000`:*
```typescript
import { useQuery } from "@tanstack/react-query";
import { getSubscriptionsService } from "../service/subscription.get.service";
import { SubscriptionFilterParams } from "../type/subscription.type";

export const useGetSubscriptions = (params?: SubscriptionFilterParams) => {
  return useQuery({
    queryKey: ["subscriptions", params],
    queryFn: () => getSubscriptionsService(params),
    staleTime: 60 * 1000, // 1 phút chống gọi API dư thừa
  });
};
```

### C. Custom Hook Mutation (`hook/useCreateSubscription.ts`)
*Tự động invalidateQueries và bắn toast `sonner`:*
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSubscriptionService } from "../service/subscription.create.service";
import { CreateSubscriptionFormValues } from "../schema/subscription.create.schema";

export const useCreateSubscription = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionFormValues) => createSubscriptionService(data),
    onSuccess: () => {
      toast.success("Tạo gói dịch vụ thành công!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo gói!");
    },
  });
};
```

### D. Component Form (`component/CreateSubscriptionForm.tsx`)
*Dùng `zodResolver as any`, hiển thị dấu sao đỏ `<span className="text-red-500">*</span>`, disable nút khi `isPending`:*
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubscriptionSchema, CreateSubscriptionFormValues } from "../schema/subscription.create.schema";
import { useCreateSubscription } from "../hook/useCreateSubscription";

interface Props {
  onClose: () => void;
}

export const CreateSubscriptionForm: React.FC<Props> = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSubscriptionFormValues>({
    resolver: zodResolver(createSubscriptionSchema) as any,
  });

  const { mutate: createSub, isPending } = useCreateSubscription(onClose);

  const onSubmit = (values: CreateSubscriptionFormValues) => {
    createSub(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Tên gói dịch vụ <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name")}
          placeholder="Nhập tên gói..."
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Lưu gói dịch vụ"}
        </button>
      </div>
    </form>
  );
};
```

---

## 🚫 8. CÁC ĐIỀU CẤM KỴ TUYỆT ĐỐI Ở FRONTEND NEXT.JS

1. **CẤM dùng icon từ `lucide-react`:** Chỉ sử dụng `react-icons` (ví dụ `import { FaUser } from "react-icons/fa"`).
2. **CẤM gọi `axiosClient` trong Component:** Mọi tương tác API phải đi qua tầng `hook/` (React Query).
3. **CẤM import axiosClient dạng named export:** Luôn dùng `import axiosClient from "@/src/core/api/axios-instance";` (default export).
4. **CẤM dùng `window.confirm()`:** Mọi hành động xóa hoặc tác vụ nguy hiểm phải dùng component `<ConfirmModal>`.
5. **CẤM quên Animation:** Mọi màn hình hoặc card lớn phải bọc trong component animation từ `fe/src/core/components/animation/` (như `<FadeIn>`).
6. **CẤM thiếu Pagination:** Bất kỳ bảng danh sách nào cũng phải có thanh phân trang kèm dropdown chọn số lượng dòng (rows per page: 10, 20, 50).
7. **CẤM quên `staleTime`:** Mọi `useQuery` phải có `staleTime: 60 * 1000` để tránh spam request làm nghẽn mạng.
8. **CẤM hardcode `z.string()` từ đầu:** Bắt buộc tái sử dụng các hàm mẫu từ `validator` trong `@/src/core/lib/validations.ts`.
9. **CẤM import thư viện `date-fns`:** Thư viện này không được cài đặt, luôn dùng native JavaScript `Date` methods.
10. **CẤM file dài quá 300 dòng:** Mọi file component, hook, modal, form tối đa **300 dòng**. Khi chạm ngưỡng 300 dòng, bắt buộc phải tách các sub-components (`Form`, `List`, `Pagination`, `Step`) theo nguyên tắc Granular SRP.

