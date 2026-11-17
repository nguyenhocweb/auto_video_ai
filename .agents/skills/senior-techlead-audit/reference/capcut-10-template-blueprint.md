# 📐 BLUEPRINT KIẾN TRÚC MÔ PHỎNG 10 MẪU CAPCUT (GPU HYBRID ENGINE)
## Thiết kế chuẩn hóa cho NVIDIA RTX 3050 (4GB VRAM) & CPU 16 Luồng

---

## 1. Cấu Trúc Tổ Chức Module

```text
be/src/core/engines/template_renderer/
├── __init__.py
├── engine.py                  # Lõi điều phối timeline và pipeline FFmpeg/NVENC
├── spec_parser.py             # Parser đọc file JSON đặc tả của từng mẫu
├── audio_beat_tracker.py      # Phân tích nhịp trống (Kick/Snare onset)
├── shader_filters.py          # Bộ sinh chuỗi FFmpeg Filtergraph / Shaders
└── templates/                 # Thư mục lưu 10 mẫu JSON độc lập
    ├── t01_beat_shake.json    # Mẫu 1: Giật theo beat + White Flash
    ├── t02_zoom_bounce.json   # Mẫu 2: Phóng to nảy Bezier + Motion Blur
    ├── t03_rgb_split.json     # Mẫu 3: Tách màu 3D Glitch + Bass drop
    ├── t04_split_quad.json    # Mẫu 4: Chia 4 màn hình lật gương (Mirror)
    ├── t05_slowmo_flash.json  # Mẫu 5: Tua chậm mượt Optical Flow + Flash
    ├── t06_cinematic_bars.json# Mẫu 6: Khung điện ảnh + Nền mờ nghệ thuật
    ├── t07_vhs_retro.json     # Mẫu 7: Hiệu ứng băng từ cổ điển (Scanlines)
    ├── t08_speed_ramp.json    # Mẫu 8: Biến thiên tốc độ (Speed Ramping)
    ├── t09_carousel_slide.json# Mẫu 9: Trượt cuộn ngang liên tục
    └── t10_karaoke_glow.json  # Mẫu 10: Chữ Karaoke sáng đèn đồng bộ giọng
```

---

## 2. Chuẩn Hóa Cấu Trúc File Mẫu JSON (`template_spec.json`)

```json
{
  "template_id": "t01_beat_shake",
  "name": "Giật Beat & Chớp Trắng Siêu Tốc",
  "version": "1.0.0",
  "resolution": { "width": 1080, "height": 1920, "fps": 30 },
  "slots": [
    { "slot_id": 1, "start_time": 0.0, "end_time": 2.4, "type": "image_or_video" },
    { "slot_id": 2, "start_time": 2.4, "end_time": 5.0, "type": "image_or_video" }
  ],
  "effects": [
    {
      "name": "camera_shake",
      "trigger": "beat_sync",
      "intensity": 0.08,
      "decay": 0.15
    },
    {
      "name": "white_flash",
      "trigger": "slot_transition",
      "duration": 0.2
    }
  ],
  "export_settings": {
    "encoder": "h264_nvenc",
    "preset": "p4",
    "cq": 23,
    "max_vram_mb": 2048
  }
}
```

---

## 3. Bộ Quy Tắc 5 Hiệu Ứng Shader Lõi Siêu Tốc

1. **Hiệu ứng White Flash (Chớp trắng):**
   - Không render lớp ảnh trắng đè lên.
   - Dùng filter `eq=brightness='0.5*exp(-10*mod(t,0.5))'` trực tiếp trong stream video để đạt tốc độ xử lý phần cứng tối đa.
2. **Hiệu ứng Camera Shake (Giật nhịp):**
   - Dùng ma trận biến đổi tọa độ `crop=w='iw*0.95':h='ih*0.95':x='(iw-ow)/2+15*sin(t*50)':y='(ih-oh)/2+15*cos(t*50)'`.
3. **Hiệu ứng Blurred Background (Nền mờ):**
   - Bắt buộc áp dụng kỹ thuật: **Downscale $108\times 192$ $\longrightarrow$ Boxblur $5\times 5$ $\longrightarrow$ Upscale $1080\times 1920$** (Tăng tốc 25 lần).
4. **Hiệu ứng Chuyển cảnh (GL-Transitions):**
   - Biên dịch shader GLSL hoặc dùng filter `xfade` của FFmpeg với các kiểu: `fadeblack`, `fadefast`, `wipeleft`, `circleopen`.
5. **Hiệu ứng RGB Split (Tách màu):**
   - Tách stream thành `[r], [g], [b]` qua filter `split`, dịch chuyển nhẹ vị trí trục X của kênh Red và Blue rồi gộp lại bằng `mergeplanes`.

---

## 4. Chỉ Tiêu Kỹ Thuật Nghiệm Thu (Acceptance Criteria)

* **Tốc độ:** Render 1 video 30s độ phân giải $1080 \times 1920$ (30fps) bắt buộc hoàn tất trong **dưới 10 giây**.
* **Mức tiêu hao VRAM:** Không được vượt quá **2.5 GB / 4 GB** của RTX 3050 trong suốt quá trình chạy.
* **Ổn định:** Chạy liên tục batch 10 video không được xảy ra lỗi timeout hay đọng lại file tạm trong thư mục `storage/temp/`.
