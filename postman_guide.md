# 🚀 Hướng Dẫn Test API Backend trên Postman

File này hướng dẫn chi tiết các bước để test từng API vừa xây dựng trong Postman.

> [!NOTE]
> Đảm bảo server backend đang chạy ở `http://localhost:3000` (dùng lệnh `npm start`).

---

## 🛠️ Bước 1: Test API Roles (Tạo dữ liệu cơ sở)

### 1. Tạo Role Mới (POST)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/roles`
- **Body:** `raw` (chọn kiểu `JSON`)
- **Nội dung Body:**
```json
{
  "name": "Giảng Viên",
  "description": "Tài khoản dành cho giảng viên hướng dẫn"
}
```
> 👉 *Lưu ý: Sau khi send thành công, nhớ copy lại chuỗi `_id` của Role này để dùng cho bước tạo User.*

### 2. Lấy danh sách Roles (GET)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/roles`
- **Body:** None

---

## 👤 Bước 2: Test API Users

### 1. Tạo User Mới (POST)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/users`
- **Body:** `raw` (chọn kiểu `JSON`)
- **Nội dung Body:**
```json
{
  "username": "sinhvien_01",
  "password": "mysecretpassword",
  "email": "sinhvien_01@hutech.edu.vn",
  "fullName": "Nguyễn Văn A",
  "role": "<DÁN_ID_CỦA_ROLE_Ở_BƯỚC_1_VÀO_ĐÂY>"
}
```

### 2. Lấy danh sách Users (GET)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/users`
> 👉 *Test thành công nếu bạn thấy field `role` hiển thị thông tin chi tiết của Role (populate) thay vì chỉ mỗi ID.*

### 3. Cập nhật User (PUT)
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/v1/users/<ID_CỦA_USER>`
- **Body:** `raw` -> `JSON`
- **Nội dung Body:**
```json
{
  "fullName": "Nguyễn Văn A - Cập Nhật"
}
```

---

## 🔓 Bước 3: Test Tính Năng Mở / Khóa User Đang Hot

### 1. Kích Hoạt User (Enable)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/users/enable`
- **Body:** `raw` -> `JSON`
- **Nội dung Body:**
```json
{
  "email": "sinhvien_01@hutech.edu.vn",
  "username": "sinhvien_01"
}
```
> 👉 *Kiểm tra response trả về xem `status` có chuyển thành `true` không.*

### 2. Vô Hiệu Hóa User (Disable)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/users/disable`
- **Body:** `raw` -> `JSON`
- **Nội dung Body:**
```json
{
  "email": "sinhvien_01@hutech.edu.vn",
  "username": "sinhvien_01"
}
```
> 👉 *Kiểm tra response trả về xem `status` có chuyển thành `false` không.*

---

## 🗑️ Bước 4: Test Tính Năng Xóa Mềm (Soft Delete)

### 1. Gọi Lệnh Xóa User
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/v1/users/<ID_CỦA_USER_MUỐN_XÓA>`
- **Body:** None
> 👉 *Hệ thống sẽ không xóa hẳn data trong Database, mà chỉ chuyển `isDeleted: true`.*

### 2. Kiểm Tra Lại Bằng GET
Thực hiện lại bước GET Users (Bước 2.2). Bạn sẽ không còn nhìn thấy User vừa bị xóa hiển thị trong danh sách trả về, chứng minh logic lọc filter `(!e.isDeleted)` chạy chính xác! 🎉
