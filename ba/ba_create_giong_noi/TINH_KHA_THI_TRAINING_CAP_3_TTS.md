# BÁO CÁO PHÂN TÍCH TÍNH KHẢ THI: HUẤN LUYỆN AI GIỌNG NÓI CẤP 3 (FINE-TUNING CUSTOM TTS)
> **Dự án:** Video AI Platform  
> **Module:** `ba/ba_create_giong_noi`  
> **Tài liệu:** Đánh giá thông số kỹ thuật, quy trình và tính khả thi triển khai Custom TTS Model  
> **Ngày lập:** 01/11/2026  

---

## 📌 ĐỊNH NGHĨA CẤP 3 (FINE-TUNING CUSTOM TEXT-TO-SPEECH)
**Huấn luyện Cấp 3** là quy trình can thiệp sâu vào mô hình âm học (Acoustic Model) và bộ giải mã sóng âm (Neural Vocoder) để dạy AI học toàn diện:
1. **Âm sắc (Timbre):** Màu giọng đặc trưng của một người cụ thể.
2. **Quy tắc phát âm (Phonetics):** Cách người đó phát âm từng nguyên âm, phụ âm, dấu thanh tiếng Việt.
3. **Nhịp điệu & Cảm xúc (Prosody):** Tốc độ nói, cách ngắt nghỉ câu, phong cách nhấn nhá đặc thù.

Các mô hình tiêu biểu: **VITS / Bert-VITS2**, **GPT-SoVITS (v2/v3)**, **StyleTTS 2**, **Piper TTS**.

---

## ⚙️ 1. CÁC THÔNG SỐ KỸ THUẬT BẮT BUỘC (PARAMETERS)

### 1.1. Thông số tập dữ liệu (Dataset Parameters)
| Thông số | Mức tối thiểu (MVP) | Mức khuyến nghị (Chuẩn sản phẩm) | Chuẩn phòng thu (Studio Grade) |
| :--- | :--- | :--- | :--- |
| **Tổng thời lượng audio sạch** | **15 – 30 phút** | **1 – 2 giờ** | 5 – 10 giờ |
| **Số lượng mẫu audio ngắn (Clips)** | 200 – 400 câu | 800 – 1.500 câu | 3.000 – 8.000 câu |
| **Độ dài mỗi câu (Segment Duration)** | 2s – 10s (tối ưu: 3s – 6s) | 2s – 10s (tối ưu: 3s – 6s) | 2s – 8s |
| **Định dạng âm thanh** | WAV (PCM 16-bit / 24-bit) | WAV (PCM 16-bit / 24-bit) | WAV (PCM 24-bit) |
| **Sample Rate** | 22.050 Hz | **44.100 Hz hoặc 48.000 Hz** | 48.000 Hz |
| **Số kênh âm thanh (Channels)** | Mono (1 kênh) | Mono (1 kênh) | Mono (1 kênh) |
| **Độ ồn nền (SNR)** | > 25 dB | > 35 dB (không tạp âm/reverb) | > 45 dB (buồng cách âm) |
| **Độ chính xác nhãn văn bản (Text)** | **100% khớp từng chữ** | **100% khớp từng chữ** | 100% chuẩn ngữ âm |

---

### 1.2. Thông số phần cứng (Hardware Requirements)
| Cấu hình | Cấu hình tối thiểu (Dev/Test) | Cấu hình khuyến nghị (Production Worker) |
| :--- | :--- | :--- |
| **GPU** | NVIDIA RTX 3060 12GB VRAM | **NVIDIA RTX 4090 24GB VRAM** hoặc **A100 40GB/80GB** |
| **RAM hệ thống** | 16 GB | 32 GB – 64 GB |
| **CPU** | 6 Cores / 12 Threads (AMD Ryzen 5 / Intel i5) | 12 Cores trở lên (xử lý audio & feature extraction) |
| **Lưu trữ** | 50 GB SSD NVMe | 200 GB SSD NVMe (tốc độ đọc ghi > 3000 MB/s) |
| **CUDA / PyTorch** | CUDA 11.8 / 12.1, PyTorch >= 2.1 | CUDA 12.2+, PyTorch 2.3+ |

---

### 1.3. Thông số huấn luyện mô hình (Training Hyperparameters)
- **Batch Size:**
  - VRAM 8GB – 12GB: `batch_size = 4` hoặc `6`
  - VRAM 16GB – 24GB: `batch_size = 8` hoặc `16`
  - VRAM 40GB – 80GB (A100): `batch_size = 32`
- **Learning Rate:**
  - Generator: $1 \times 10^{-4}$ (với AdamW, $\beta_1 = 0.8, \beta_2 = 0.99$)
  - Discriminator: $1 \times 10^{-4}$
  - Learning Rate Decay: Hệ số giảm dần $0.999^{epoch}$
- **Epochs & Steps (Khi Fine-tune từ Base Checkpoint):**
  - **Số Epochs:** **100 – 300 epochs** (tùy dung lượng dataset).
  - **Số Steps:** Khoảng **15.000 – 50.000 steps**.
- **Thời gian huấn luyện trung bình:**
  - Trên RTX 3060 (12GB): **2 – 4 giờ**.
  - Trên RTX 4090 (24GB): **35 – 60 phút**.
  - Trên NVIDIA A100: **15 – 25 phút**.
- **Hàm mất mát (Loss Weights):**
  - $Loss_{mel} = 45.0$ (Đo độ khớp phổ âm thanh).
  - $Loss_{kl} = 1.0$ (Phân phối tiềm ẩn theo Monotonic Alignment Search).
  - $Loss_{dur} = 1.0$ (Dự đoán trường độ/độ dài từng từ).
  - $Loss_{gen} = 1.0$ & $Loss_{fm} = 2.0$ (GAN Generator & Feature Matching Loss).

---

## 🔄 2. QUY TRÌNH 6 BƯỚC ĐỂ HUẤN LUYỆN CẤP 3

```
┌────────────────────────────────────────────────────────────────────────┐
│ BƯỚC 1: Thu thập âm thanh gốc (Recording / Extraction)                │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ BƯỚC 2: Tiền xử lý âm thanh tự động (Denoise, Slice, Normalization)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ BƯỚC 3: Gán nhãn & Hiệu đính văn bản (ASR + Human Correction)         │
│         ★ RÀO CẢN LỚN NHẤT: Bắt buộc text khớp 100% với giọng nói      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ BƯỚC 4: Trích xuất đặc trưng âm học (Phonemize, F0, Mel-spec)          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ BƯỚC 5: Huấn luyện lặp (Training Loop với Base Checkpoint)             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ BƯỚC 6: Đánh giá (Evaluation), Đóng gói (Export ONNX) & Inference      │
└────────────────────────────────────────────────────────────────────────┘
```

### Bước 1: Thu thập âm thanh gốc (Data Sourcing)
- Nguồn dữ liệu:
  - Người dùng tự đọc danh sách câu mẫu hiển thị trên màn hình qua Micro.
  - Hoặc upload các file Video/Podcast dài 30 - 60 phút của chính họ.

### Bước 2: Tiền xử lý âm thanh tự động (Audio Preprocessing)
1. **Khử tạp âm (Denoise):** Dùng `DeepFilterNet` hoặc `UVR5` loại bỏ hoàn toàn tiếng quạt gió, tiếng vang phòng (dereverb).
2. **Cắt đoạn theo khoảng lặng (VAD Slicing):** Dùng `Silero-VAD` cắt thành các phân đoạn 3s – 8s tại các điểm ngắt hơi thở.
3. **Chuẩn hóa âm lượng:** Đưa về chuẩn đồng nhất `-16 LUFS` (tránh hiện tượng clip này to, clip kia bé).

### Bước 3: Gán nhãn văn bản & Chuẩn hóa ngữ âm (Transcription & Labeling)
1. **Bóc băng tự động (Auto-ASR):** Dùng `faster-whisper` (model `large-v3`) để phiên âm từng audio clip thành text.
2. **Chuẩn hóa số và ký hiệu (Text Normalization):**
   - Ví dụ: `100.000đ` $\rightarrow$ `một trăm nghìn đồng`.
   - `COVID-19` $\rightarrow$ `cô vít mười chín`.
3. **Hiệu đính bắt buộc (Human Correction):** Nếu Whisper nghe nhầm 1 từ mà đưa vào train, mô hình sẽ bị "ngọng" hoặc nói lắp ở từ đó.
4. **Chuyển đổi Ngữ âm (Grapheme-to-Phoneme - G2P):** Chuyển từ tiếng Việt sang mã ký hiệu ngữ âm quốc tế (IPA) có kèm dấu thanh (Sắc, Huyền, Hỏi, Ngã, Nặng).

### Bước 4: Trích xuất đặc trưng (Feature Pre-calculation)
- Trích xuất Mel-spectrogram (80 bins).
- Trích xuất cao độ F0 (Pitch) bằng thuật toán RMVPE.
- Lưu trữ vào cache dưới dạng file `.npy` hoặc `.pt` để tăng tốc độ nạp dữ liệu trong quá trình train.

### Bước 5: Huấn luyện mô hình (Training Execution)
- Nạp **Base Pre-trained Model** (mô hình đã được luyện trước trên 5.000+ giờ tiếng Việt).
- Đóng băng các tầng Text Encoder cấp thấp, chỉ fine-tune:
  - Duration Predictor (Nhịp điệu).
  - Speaker Embedding / Flow Layers (Âm sắc).
  - Decoder HiFi-GAN (Chất lượng âm thanh).
- Mỗi 1.000 steps sinh ra 1 audio kiểm thử để đánh giá độ hội tụ của loss.

### Bước 6: Đánh giá & Đóng gói (Packaging & Inference)
- **Đánh giá:**
  - Khách quan: Kiểm tra $Loss_{mel} < 15.0$, $Loss_{dur} < 1.0$.
  - Thử nghiệm các câu kiểm tra "hóc búa": từ ghép, từ tượng thanh, tiếng Anh pha tiếng Việt.
- **Export tối ưu hóa:**
  - Lược bỏ Discriminator (chỉ giữ Generator).
  - Xuất ra định dạng **ONNX Runtime** hoặc **TensorRT** để chạy inference với tốc độ siêu nhanh (RTF < 0.1s).

---

## 📊 3. ĐÁNH GIÁ TÍNH KHẢ THI (FEASIBILITY ASSESSMENT)

| Tiêu chí | Đánh giá | Chi tiết phân tích & Thách thức |
| :--- | :---: | :--- |
| **1. Tính khả thi Kỹ thuật (Technical)** | **8.5 / 10** (Khả thi tốt) | Các framework mã nguồn mở (GPT-SoVITS, VITS) hiện rất hoàn thiện, tài liệu phong phú, hỗ trợ Base Checkpoint tiếng Việt tốt. |
| **2. Tính khả thi Dữ liệu từ Người dùng (User Data UX)** | **4.0 / 10** (RẤT KHÓ CHO NGƯỜI DÙNG PHỔ THÔNG) | **Rào cản chí mạng:** Bắt người dùng thông thường ngồi thu âm 30 phút hoặc tự sửa lỗi transcript cho 500 câu là điều bất khả thi (tỷ lệ bỏ cuộc > 90%). Chỉ khả thi với Creator/KOC chuyên nghiệp hoặc Admin hệ thống chủ động train sẵn kho giọng. |
| **3. Tính khả thi Hạ tầng & Chi phí (Infra & Cost)** | **7.5 / 10** (Khả thi nếu tính phí) | Chi phí thuê GPU Cloud (RTX 4090 / A10G) khoảng **\$0.35 – \$0.50 / giờ**. Một lượt train tốn khoảng **\$0.30 – \$0.80** (~8.000đ – 20.000đ). Cần xây dựng kiến trúc Serverless GPU để không lãng phí tiền khi nhàn rỗi. |
| **4. Thời gian phản hồi của sản phẩm (Time to Value)** | **5.0 / 10** (Khá chậm) | Người dùng phải đợi từ 30 phút đến 1 giờ mới có giọng để dùng. Cần hệ thống thông báo đẩy (Push Notification / Email / WebSocket) khi hoàn thành. |

---

## 🥊 4. BẢNG SO SÁNH QUYẾT ĐỊNH: CẤP 3 (CUSTOM TTS) VS CẤP 2 (RVC)

| Tiêu chí so sánh | Cấp 3: Fine-tuning Custom TTS (VITS / GPT-SoVITS) | Cấp 2: Voice Conversion (RVC v2 + Edge-TTS) |
| :--- | :--- | :--- |
| **Dữ liệu người dùng cần nộp** | 30 – 60 phút audio + **bắt buộc Text transcript** | 5 – 10 phút audio **(KHÔNG CẦN TEXT)** |
| **Công sức người dùng (UX)** | Phức tạp, phải đọc theo kịch bản hoặc sửa phụ đề | Cực kỳ dễ (Chỉ cần gửi 1 video Youtube/TikTok cũ) |
| **Thời gian train** | 35 – 120 phút | **10 – 15 phút** |
| **Độ giống người thật** | 92 – 96% | **95 – 98%** |
| **Cảm xúc / Tiếng cười / Ngữ điệu** | Phụ thuộc vào Text Prompt (đôi khi bị đều đều) | **Thừa hưởng 100% ngữ điệu sống động của giọng gốc** |
| **Tốc độ đọc kịch bản (Inference)** | **1 bước (Nhanh, RTF ~ 0.1)** | 2 bước: Edge-TTS $\rightarrow$ RVC (Chậm hơn ~0.5s) |

---

## 🎯 5. KẾT LUẬN & KHUYẾN NGHỊ CHO DỰ ÁN VIDEO AI

1. **Về tính khả thi tổng thể:**
   - **NÊN LÀM CẤP 3 KHI:** Bạn (Admin/Nhóm phát triển) muốn tạo ra một **Bộ sưu tập giọng đọc độc quyền (Preset Voice Library)** cho nền tảng của mình (ví dụ: tạo sẵn 20 giọng đọc hay nhất Bắc - Trung - Nam, giọng MC tin tức, giọng kể chuyện cổ tích). Khi đó bạn chủ động đầu tư thời gian làm dữ liệu chuẩn phòng thu 1 lần và cho hàng triệu user dùng mãi mãi.
   - **KHÔNG NÊN BẮT END-USER TỰ LÀM CẤP 3:** Người dùng sẽ chán nản vì khâu chuẩn bị dữ liệu quá mệt mỏi.
2. **Chiến lược tối ưu cho End-User tự tạo giọng:**
   - Cung cấp **Cấp 1 (Zero-shot với F5-TTS / CosyVoice):** Chỉ cần 10s audio mẫu, sinh giọng trong 3 giây.
   - Hoặc cung cấp **Cấp 2 (RVC v2):** Chỉ cần gửi video TikTok 5 phút, 15 phút sau có giọng clone chuẩn 98%.

