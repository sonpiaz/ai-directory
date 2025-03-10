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