# AI Directory

Thư mục công cụ AI lớn nhất, được phân loại và đánh giá để giúp bạn tìm ra công cụ hoàn hảo cho nhu cầu của mình.

## Tính năng

- Khám phá hàng trăm công cụ AI từ nhiều danh mục khác nhau
- Tìm kiếm và lọc công cụ theo danh mục, mô hình giá cả
- Xem chi tiết, đánh giá và tìm hiểu về từng công cụ AI
- Khám phá các trường hợp sử dụng khác nhau của công cụ AI
- Đóng góp và thêm công cụ AI mới vào danh mục

## Công nghệ sử dụng

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: tRPC, Prisma, SQLite
- **Authentication**: NextAuth.js

## Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js (phiên bản 14.x trở lên)
- npm hoặc yarn

### Bước cài đặt

1. Clone repository:

```bash
git clone https://github.com/sonpiaz/ai-directory.git
cd ai-directory
```

2. Cài đặt các phụ thuộc:

```bash
npm install
# hoặc
yarn
```

3. Tạo và seed cơ sở dữ liệu:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

4. Chạy ứng dụng ở môi trường development:

```bash
npm run dev
# hoặc
yarn dev
```

5. Mở trình duyệt và truy cập: `http://localhost:3000`

## Triển khai trên Vercel

### Bước triển khai

1. Đẩy code lên GitHub repository:

```bash
git add .
git commit -m "Chuẩn bị triển khai trên Vercel"
git push origin main
```

2. Tạo tài khoản Vercel tại [vercel.com](https://vercel.com) nếu bạn chưa có.

3. Trong dashboard Vercel, nhấp vào "Import Project" và chọn "Import Git Repository".

4. Nhập URL của GitHub repository hoặc chọn repository trong danh sách nếu bạn đã kết nối GitHub với Vercel.

5. Cấu hình dự án:
   - **Framework Preset**: Next.js
   - **Build Command**: npm run build
   - **Output Directory**: .next

6. Thiết lập biến môi trường:
   - `DATABASE_URL`: URL của cơ sở dữ liệu (nếu sử dụng cơ sở dữ liệu từ xa)
   - `NEXTAUTH_URL`: URL của trang web sau khi triển khai (ví dụ: https://ai-directory.vercel.app)
   - `NEXTAUTH_SECRET`: Một chuỗi bí mật cho NextAuth

7. Nhấp vào "Deploy" và đợi quá trình triển khai hoàn tất.

8. Sau khi triển khai xong, bạn có thể truy cập trang web tại URL do Vercel cung cấp.

## Cấu trúc dự án

- `/pages`: Các trang và API routes
- `/components`: Các thành phần React dùng lại được
- `/prisma`: Schema cơ sở dữ liệu và seed script
- `/server`: Logic phía server, tRPC routers
- `/public`: Tài nguyên tĩnh
- `/styles`: CSS và style

## Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp để cải thiện AI Directory! Vui lòng xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem [LICENSE](LICENSE) để biết thêm chi tiết.