# 🌟 Trang Profile Cá Nhân

Một trang profile cá nhân đẹp mắt với nhiều tính năng thú vị, được host trên GitHub Pages.

## ✨ Tính năng

- 🎨 **Giao diện đẹp mắt**: Gradient màu sắc hiện đại, responsive trên mọi thiết bị
- 🎵 **Nhạc nền**: Tự động phát nhạc khi người dùng bật
- 🕐 **Đồng hồ thời gian thực**: Hiển thị giờ và ngày hiện tại
- 📊 **Đếm lượt truy cập**: Tự động đếm số lượt ghé thăm trang
- 🔋 **Hiển thị pin**: Đọc và hiển thị mức pin thiết bị (nếu trình duyệt hỗ trợ)
- 💳 **Thông tin chuyển khoản**: Hiển thị thông tin ngân hàng với QR code
- 📋 **Sao chép nhanh**: Một click để sao chép thông tin ngân hàng

## 🚀 Cách sử dụng

### 1. Tạo Repository trên GitHub

1. Đăng nhập vào GitHub
2. Tạo repository mới với tên: `<username>.github.io` hoặc tên bất kỳ
3. Clone repository về máy hoặc upload trực tiếp

### 2. Upload các file

Upload 3 file sau vào repository:
- `index.html` - File HTML chính
- `style.css` - File CSS cho giao diện
- `script.js` - File JavaScript cho các tính năng

### 3. Bật GitHub Pages

1. Vào **Settings** của repository
2. Chọn **Pages** ở menu bên trái
3. Trong phần **Source**, chọn branch `main` và folder `/ (root)`
4. Click **Save**
5. Đợi vài phút, trang web sẽ được deploy tại: `https://<username>.github.io/<repo-name>/`

## 🎨 Tùy chỉnh

### Thay đổi thông tin cá nhân

Mở file `index.html` và chỉnh sửa các phần sau:

```html
<!-- Tên và thành phố -->
<h2>Tên Của Bạn</h2>
<div class="location">📍 Thành phố của bạn</div>

<!-- Ảnh đại diện -->
<img src="URL_ẢNH_CỦA_BẠN" alt="Avatar" class="avatar">
```

### Thay đổi thông tin ngân hàng

```html
<!-- Trong phần bank-details -->
<div class="bank-value">Tên Ngân Hàng</div>
<div class="bank-value">TÊN CHỦ TÀI KHOẢN</div>
<div class="bank-value">Số tài khoản</div>
```

### Thay đổi nhạc nền

Mở file `script.js` và tìm dòng:

```javascript
audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
```

Thay thế bằng link nhạc của bạn (MP3 format).

### Thay đổi màu sắc

Mở file `style.css` và tìm các dòng gradient:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Thay đổi mã màu hex theo ý thích.

## 🎵 Nguồn nhạc

Bạn có thể lấy link nhạc từ:
- **SoundCloud**: Sử dụng các công cụ download để lấy link trực tiếp
- **YouTube**: Convert sang MP3 và upload lên GitHub hoặc dùng hosting khác
- **File local**: Upload file MP3 vào repository và dùng đường dẫn tương đối

## 📱 Responsive

Trang web tự động điều chỉnh giao diện cho:
- 💻 Desktop
- 📱 Mobile
- 📱 Tablet

## 🔧 Công nghệ sử dụng

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Battery Status API
- Clipboard API
- LocalStorage API
- QR Code API

## 📝 Lưu ý

- Một số tính năng như Battery Status API chỉ hoạt động trên HTTPS
- GitHub Pages tự động cung cấp HTTPS
- Đếm lượt truy cập sử dụng LocalStorage nên chỉ đếm trên từng thiết bị
- QR Code được tạo bằng API miễn phí từ qrserver.com

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc Issue nếu bạn có ý tưởng cải thiện.

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa theo ý muốn.

## 🌐 Demo

Xem demo tại: `https://<username>.github.io/<repo-name>/`

---

**Chúc bạn tạo được một trang profile đẹp! 🎉**
