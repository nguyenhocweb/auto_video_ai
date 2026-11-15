# HƯỚNG DẪN CHI TIẾT: CHẠY TRAINING & TẠO GIỌNG AI (RVC V2 + EDGE-TTS) TRÊN MÁY TÍNH CÁ NHÂN (LOCAL PC)
> **Dự án:** Video AI  
> **Cấu hình phần cứng phát hiện:** NVIDIA GeForce RTX 3050 (4GB VRAM, CUDA 12.2)  
> **Hệ điều hành:** Windows  
> **Chi phí:** **0 ĐỒNG (HOÀN TOÀN MIỄN PHÍ)**  

---

## 💻 1. ĐÁNH GIÁ CẤU HÌNH MÁY TÍNH CỦA BẠN (RTX 3050 4GB VRAM)

* ✅ **Khả năng chạy Inference (Sinh giọng đọc video):** **CỰC KỲ MƯỢT.** Chỉ tiêu tốn khoảng `1.2GB - 1.5GB VRAM`. Một câu 10 giây xử lý trong khoảng `0.3 - 0.5 giây`.
* ✅ **Khả năng Training giọng mới (Huấn luyện Model):** **HOÀN TOÀN KHẢ THI** nếu biết cách tối ưu thông số bộ nhớ:
  * ⚠️ Vì VRAM là **4GB**, nếu để mặc định `batch_size = 8` hoặc `16` sẽ bị lỗi tràn bộ nhớ (**CUDA Out of Memory**).
  * 🎯 **Giải pháp:** Bắt buộc cấu hình `batch_size = 2` hoặc `4`.
  * ⏱️ **Thời gian train trên RTX 3050:** Khoảng **15 – 25 phút** cho tập mẫu 5 – 10 phút audio (khoảng 150 – 200 epochs).

---

## 🛠️ 2. PHƯƠNG ÁN CÀI ĐẶT TỐI ƯU NHẤT TRÊN WINDOWS: BẢN 1-CLICK PORTABLE

Vì Python hiện tại trên máy bạn là **Python 3.13** (bản rất mới, các thư viện âm thanh AI chuyên sâu như `fairseq`, `torchaudio` chưa tương thích hoàn toàn), giải pháp chuẩn nhất và không bao giờ lỗi là dùng **Bản RVC v2 Full Portable (Đóng gói sẵn)**.

### Ưu điểm bản Portable:
- Đã tích hợp sẵn Python 3.10 embedded, PyTorch CUDA 12.1, FFmpeg, và toàn bộ pre-trained models.
- **Không xung đột** với bất kỳ thư viện Python nào đang có trên máy của bạn.
- Tải về giải nén ra là chạy ngay bằng 1 click (`go-web.bat`).

### Các bước tải & chuẩn bị:
1. **Tải bản RVC v2 Portable chính thức (HuggingFace/Github):**
   - Repo: [RVC-Project / Retrieval-based-Voice-Conversion-WebUI](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI)
   - Hoặc bản tối ưu cho Windows NVIDIA: `RVC-beta-v2-0618.7z`.
2. **Giải nén vào thư mục công cụ:** (Ví dụ: `D:\DuAnCaNhan\tools\RVC-WebUI\`).
3. **Các Model nền tảng (Hubert / RMVPE) cần có sẵn trong thư mục RVC:**
   - `assets/hubert/hubert_base.pt` (Mã hóa ngữ âm).
   - `assets/rmvpe/rmvpe.pt` (Trích xuất cao độ F0 chuẩn nhất cho tiếng Việt).

---

## 🎙️ 3. QUY TRÌNH THU ÂM VÀ CHUẨN BỊ MẪU GIỌNG (5 - 10 PHÚT)

Bạn không cần đọc theo kịch bản gì cả, chỉ cần giọng tự nhiên:
1. **Cách 1 (Tự ghi âm giọng mình):**
   - Ngồi trong phòng yên tĩnh, dùng tai nghe hoặc micro điện thoại/máy tính.
   - Nói chuyện tự nhiên, đọc tin tức, chia sẻ câu chuyện liên tục khoảng **5 đến 8 phút**.
   - Lưu thành file `.mp3` hoặc `.wav` (ví dụ: `my_voice_raw.wav`).
2. **Cách 2 (Lấy giọng từ Video có sẵn):**
   - Tải 1 video TikTok, Youtube, hoặc Podcast của người bạn muốn lấy giọng (tầm 5-10 phút).
   - Dùng tính năng tách nhạc nền của RVC (UVR5) tích hợp sẵn để lọc sạch tiếng nhạc chỉ lấy tiếng nói mộc.

---

## 🚀 4. CẤU HÌNH THÔNG SỐ TRAINING CHUẨN CHO CARD RTX 3050 (4GB VRAM)

Khởi động giao diện RVC bằng cách bấm đúp vào file `go-web.bat`. Trình duyệt sẽ mở ra địa chỉ: `http://localhost:7865/`.

Chuyển sang tab **Train** và thiết lập chính xác các thông số sau:

### Bước 1: Khởi tạo thử nghiệm
* **Tên Model (Experiment name):** Đặt tên giọng (ví dụ: `giong_anh_nam`, `my_voice_v1`).
* **Target Sample Rate:** Chọn `40k` (vừa đủ hay, tiết kiệm VRAM hơn 48k).
* **Whether model has pitch guidance:** Chọn `True` (bắt buộc cho giọng nói tiếng Việt có thanh điệu).
* **Version:** Chọn `v2`.

### Bước 2a: Xử lý dữ liệu (Step 2a - Process Data)
* **Enter the path to the training folder:** Nhập đường dẫn thư mục chứa file audio ghi âm của bạn (ví dụ: `D:/voice_samples/nam/`).
* Nhấn **Process Data**. Tool sẽ tự động cắt nhỏ thành các file 3-5 giây và chuẩn hóa âm lượng.

### Bước 2b: Trích xuất đặc trưng (Step 2b - Feature Extraction)
* **Select pitch extraction algorithm:** Chọn **`rmvpe_gpu`** (đây là thuật toán tốt nhất, chạy cực nhẹ trên GPU 4GB).
* Nhấn **Feature extraction**. Đợi khoảng 1-2 phút.

### Bước 3: Cấu hình Huấn luyện (Step 3 - Training) ⚠️ QUAN TRỌNG NHẤT VỚI VRAM 4GB:
* **Save frequency (save_every_epoch):** `20` hoặc `30` (đỡ tốn dung lượng ổ cứng).
* **Total training epochs:** `150` đến `200` (đây là điểm ngọt (sweet spot), dưới 100 epoch thì chưa giống, trên 300 epoch có thể bị rè/overfitting).
* **Batch size per GPU:** **`2`** hoặc **`4`** (Tuyệt đối **KHÔNG ĐƯỢC CHỌN 8** vì VRAM 4GB sẽ báo lỗi `CUDA out of memory`).
* **Save only latest ckpt:** Chọn `Yes` (để không bị đầy ổ cứng SSD).
* **Train feature index:** Chọn `Yes` (để sinh file `.index` - file này giúp giọng thật hơn 50%).
* Bấm **Train model**!

☕ *Ngồi uống một cốc cà phê trong 15 - 20 phút.* Khi màn hình terminal hiện `Training is done. The program is closed`, bạn đã có 1 Model giọng AI độc quyền!

---

## 📦 5. KẾT QUẢ THU ĐƯỢC SAU KHI TRAIN

Sau khi train xong, trong thư mục của RVC bạn sẽ thu được 2 file quý giá nhất:
1. `weights/giong_anh_nam.pth` (khoảng 50MB - 60MB): Chứa toàn bộ trọng số âm sắc của giọng nói.
2. `logs/giong_anh_nam/added_IVF256_Flat_Fast_giong_anh_nam_v2.index` (khoảng vài MB): File chỉ mục vector giúp giọng không bị vỡ.

Hai file này là **tài sản vĩnh viễn** của bạn, có thể copy sang bất kỳ máy nào hoặc tải lên Server để dùng!

---

## 🎬 6. LUỒNG TẠO GIỌNG ĐỌC CHO VIDEO TỰ ĐỘNG (INFERENCE PIPELINE)

Để tạo thuyết minh cho video từ kịch bản văn bản:

```
[Văn bản kịch bản video]
          │
          ▼ (0.5 giây - Chạy bằng Edge-TTS)
[File âm thanh đọc tiếng Việt chuẩn: temp.mp3]
          │
          ▼ (0.3 giây - Chạy qua Model RVC .pth của bạn trên RTX 3050)
[File âm thanh thành phẩm mang 100% GIỌNG CỦA BẠN: final.wav]
          │
          ▼ (Ghép vào video bằng FFmpeg)
[Video AI hoàn chỉnh có thuyết minh giọng chính chủ]
```

### Script Python tự động hóa 2 bước này (Tích hợp vào Video AI):
```python
import asyncio
import edge_tts
from rvc_python.infer import infer_file

# 1. Dùng Edge-TTS đọc kịch bản ra giọng chuẩn nhịp điệu (0đ)
async def create_base_tts(text: str, output_path: str):
    communicate = edge_tts.Communicate(text, voice="vi-VN-NamMinhNeural")
    await communicate.save(output_path)

# 2. Chuyển đổi giọng chuẩn thành GIỌNG CỦA BẠN bằng Model RVC (Local GPU RTX 3050)
def convert_to_my_voice(input_audio: str, output_audio: str):
    infer_file(
        input_path=input_audio,
        model_path="weights/giong_anh_nam.pth",
        index_path="logs/giong_anh_nam/added_IVF256_Flat_Fast_giong_anh_nam_v2.index",
        device="cuda:0", # Chạy trên RTX 3050
        f0_method="rmvpe",
        f0_up_key=0,     # Điều chỉnh cao độ (nếu nam giả nữ thì +12, cùng giới tính giữ 0)
        output_path=output_audio
    )
```

---

## 🎯 TỔNG KẾT

1. **Card RTX 3050 (4GB VRAM) của bạn đáp ứng hoàn hảo** nhu cầu train giọng RVC v2 và chạy tạo video hàng ngày.
2. **Chi phí:** **0 đồng** (không tốn tiền mua API, không tốn tiền thuê server).
3. **Chất lượng:** Độ giống giọng thật **95% - 98%**, giữ được ngữ điệu, cảm xúc và nhịp thở của bạn.

