# 📋 Kế Hoạch Implement User và Role APIs

Dự án có yêu cầu tạo 2 model: `Role` và `User`, đồng thời xây dựng các API endpoint bao gồm CRUD cơ bản (với chức năng xoá mềm) và 2 endpoint đặc biệt `/enable`, `/disable` cho User.

---

## 🏗️ 1. Cấu Trúc Database (Models)

Định nghĩa lược đồ (Schema) cho database sử dụng Mongoose:

| Model | File Path | Thuộc tính (Properties) |
| :--- | :--- | :--- |
| **Role** | `schemas/roles.js` | <ul><li>`name` (String, Unique, Required)</li><li>`description` (String, Default: "")</li><li>`isDeleted` (Boolean, Default: false)</li><li>`timestamps` (Tự động tạo createdAt, updatedAt)</li></ul> |
| **User** | `schemas/users.js` | <ul><li>`username` (String, Unique, Required)</li><li>`password` (String, Required)</li><li>`email` (String, Unique, Required)</li><li>`fullName` (String, Default: "")</li><li>`avatarUrl` (String, Default: url mặc định)</li><li>`status` (Boolean, Default: false)</li><li>`role` (ObjectID ref đến Role)</li><li>`loginCount` (Number, Default: 0, Min: 0)</li><li>`isDeleted` (Boolean, Default: false)</li><li>`timestamps` (Tự động)</li></ul> |

---

## 🌐 2. API Routes

Thiết lập các Endpoints cho thao tác dữ liệu:

### 🎭 Role API (`routes/roles.js`)

| Method | Endpoint | Mô tả chức năng |
| :---: | :--- | :--- |
| `GET` | `/api/v1/roles` | Lấy danh sách tất cả các roles (chưa bị xoá mềm). |
| `GET` | `/api/v1/roles/:id` | Lấy thông tin chi tiết một role theo ID. |
| `POST` | `/api/v1/roles` | Tạo mới một role. |
| `PUT` | `/api/v1/roles/:id` | Cập nhật thông tin role theo ID. |
| `DELETE`| `/api/v1/roles/:id` | **Xoá mềm** role (Chuyển `isDeleted` thành `true`). |

### 👤 User API (`routes/users.js`)

| Method | Endpoint | Mô tả chức năng |
| :---: | :--- | :--- |
| `GET` | `/api/v1/users` | Lấy danh sách user (chưa xoá mềm), populate thông tin role. |
| `GET` | `/api/v1/users/:id` | Lấy chi tiết user theo ID, populate thông tin role. |
| `POST` | `/api/v1/users` | Tạo mới user. |
| `PUT` | `/api/v1/users/:id` | Cập nhật thông tin user. |
| `DELETE`| `/api/v1/users/:id` | **Xoá mềm** user (Chuyển `isDeleted` thành `true`). |
| `POST` | `/api/v1/users/enable`| Kích hoạt user (Set `status: true`). **Yêu cầu Body:** `{ "email": "...", "username": "..." }` |
| `POST` | `/api/v1/users/disable`| Khóa user (Set `status: false`). **Yêu cầu Body:** `{ "email": "...", "username": "..." }` |

---

## ⚙️ 3. Thiết lập hệ thống (app.js)

Đảm bảo hai file route mới được đăng ký trong file cấu hình gốc:

```javascript
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/users', require('./routes/users'));
```

---

## 🧪 4. Kế hoạch Kiểm thử (Verification Plan)

> [!IMPORTANT]
> **Checklist kiểm định chất lượng (QA)**
> Mỗi chức năng sau khi hoàn thiện cần được test nội bộ trước khi sang chức năng tiếp theo:
> 
> - [x] Tạo thành công Role và lấy được ObjectID.
> - [x] Tạo thành công User với liên kết Role ObjectID.
> - [x] Lấy (GET) được User với thông tin Role hiển thị tường minh (Populate).
> - [x] Test endpoint `/enable` và `/disable` và đảm bảo status thay đổi ở database.
> - [x] Thử xoá dữ liệu (Soft Delete) và xác nhận lệnh `GET` tiếp theo không còn lấy ra dữ liệu đó.

---

> [!WARNING]
> **LƯU Ý QUAN TRỌNG TRONG QUÁ TRÌNH LÀM**
> - Mỗi lần code xong một API, bạn **BẮT BUỘC** phải test lại bằng Postman hoặc script trước khi code tiếp.
> - Nếu gặp lỗi khi chạy test, phải debug và fix ngay, tuyệt đối không code dồn.
> - Luôn mở file `plan.md` ra xem tiến độ để không bỏ sót yêu cầu của giáo viên!