import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Hàm chuyển đổi chuỗi thành slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  console.log("Bắt đầu tạo dữ liệu mẫu...");
  
  // Tạo admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });
  
  console.log("Admin user đã được tạo");

  // Tạo categories
  const categories = [
    { name: "Tạo văn bản", slug: "text-generation", description: "Công cụ tạo văn bản tự động" },
    { name: "Tạo hình ảnh", slug: "image-generation", description: "Công cụ tạo hình ảnh bằng AI" },
    { name: "Tạo video", slug: "video-creation", description: "Công cụ tạo và chỉnh sửa video" },
    { name: "Âm thanh & Giọng nói", slug: "audio-voice", description: "Công cụ xử lý âm thanh và giọng nói" },
    { name: "Chatbot", slug: "chatbots", description: "Chatbot thông minh và trợ lý ảo" },
    { name: "Phân tích dữ liệu", slug: "data-analysis", description: "Phân tích dữ liệu và thống kê" },
    { name: "Marketing", slug: "marketing", description: "Công cụ marketing và quảng cáo" },
    { name: "SEO", slug: "seo", description: "Tối ưu hóa công cụ tìm kiếm" },
    { name: "Thiết kế", slug: "design-ux", description: "Thiết kế và trải nghiệm người dùng" },
    { name: "Năng suất", slug: "productivity", description: "Tăng năng suất cá nhân và doanh nghiệp" },
    { name: "Công cụ lập trình", slug: "developer-tools", description: "Công cụ hỗ trợ lập trình viên" },
    { name: "Giáo dục", slug: "education", description: "Công cụ học tập và giáo dục" },
    { name: "Y tế", slug: "healthcare", description: "Ứng dụng AI trong y tế và chăm sóc sức khỏe" },
    { name: "Tài chính", slug: "finance", description: "Công cụ tài chính và đầu tư" },
    { name: "3D & AR/VR", slug: "3d-ar-vr", description: "Công cụ 3D, thực tế ảo và thực tế tăng cường" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`Đã tạo ${categories.length} danh mục`);

  // Tạo use cases
  const useCases = [
    { name: "Tạo nội dung", slug: "content-creation", description: "Tạo nội dung cho blog, mạng xã hội, v.v." },
    { name: "Hỗ trợ khách hàng", slug: "customer-support", description: "Hỗ trợ khách hàng tự động" },
    { name: "Hiển thị dữ liệu", slug: "data-visualization", description: "Biểu diễn dữ liệu trực quan" },
    { name: "Nghiên cứu", slug: "research", description: "Hỗ trợ nghiên cứu và thu thập thông tin" },
    { name: "Chuyển âm thanh thành văn bản", slug: "transcription", description: "Chuyển đổi âm thanh thành văn bản" },
    { name: "Dịch thuật", slug: "translation", description: "Dịch ngôn ngữ tự động" },
    { name: "Cá nhân hóa", slug: "personalization", description: "Cá nhân hóa trải nghiệm người dùng" },
    { name: "Tạo mã", slug: "code-generation", description: "Tạo mã nguồn tự động" },
    { name: "Viết email", slug: "email-writing", description: "Viết email chuyên nghiệp" },
    { name: "Chỉnh sửa hình ảnh", slug: "image-editing", description: "Chỉnh sửa và nâng cao chất lượng hình ảnh" },
  ];

  for (const useCase of useCases) {
    await prisma.useCase.upsert({
      where: { slug: useCase.slug },
      update: {},
      create: useCase,
    });
  }

  console.log(`Đã tạo ${useCases.length} trường hợp sử dụng`);

  // Lấy tất cả categories và use cases đã tạo
  const allCategories = await prisma.category.findMany();
  const allUseCases = await prisma.useCase.findMany();

  // Mô hình giá cả
  const pricingModels = ["FREE", "FREEMIUM", "PAID", "SUBSCRIPTION", "CONTACT_FOR_PRICING"];
  
  // Nền tảng
  const platforms = ["WEB", "DESKTOP", "MOBILE", "API", "EXTENSION"];

  // Tạo 500 AI tools
  const toolsToCreate = 100; // Giảm xuống 100 để tạo nhanh hơn
  
  console.log(`Bắt đầu tạo ${toolsToCreate} AI tools...`);
  
  for (let i = 0; i < toolsToCreate; i++) {
    const name = `${faker.company.name()} AI`;
    const slug = slugify(name);
    
    // Chọn ngẫu nhiên 1-3 danh mục
    const categoryCount = Math.floor(Math.random() * 3) + 1;
    const selectedCategories = faker.helpers.arrayElements(allCategories, categoryCount);
    
    // Chọn ngẫu nhiên 1-2 trường hợp sử dụng
    const useCaseCount = Math.floor(Math.random() * 2) + 1;
    const selectedUseCases = faker.helpers.arrayElements(allUseCases, useCaseCount);
    
    // Chọn ngẫu nhiên mô hình giá
    const pricingModel = faker.helpers.arrayElement(pricingModels);
    
    // Xác định có phiên bản miễn phí hay không
    const hasFreeVersion = pricingModel === "FREE" || pricingModel === "FREEMIUM" || Math.random() < 0.4;
    
    // Chọn ngẫu nhiên 1-3 nền tảng
    const platformCount = Math.floor(Math.random() * 3) + 1;
    const selectedPlatforms = faker.helpers.arrayElements(platforms, platformCount);
    
    // Chọn ngẫu nhiên các integrations
    const integrations = faker.helpers.arrayElements([
      "Slack", "Discord", "Microsoft Teams", "Google Workspace", "Zapier", 
      "Notion", "Trello", "Asana", "GitHub", "Shopify", "WordPress"
    ], Math.floor(Math.random() * 5));
    
    try {
      await prisma.aiTool.create({
        data: {
          name,
          slug,
          description: faker.lorem.paragraph(),
          longDesc: faker.lorem.paragraphs(3),
          website: faker.internet.url(),
          logo: `https://picsum.photos/seed/${slug}/200/200`,
          pricingModel,
          hasFreeVersion,
          startingPrice: pricingModel !== "FREE" ? parseFloat(faker.commerce.price({ min: 5, max: 100 })) : null,
          featured: Math.random() < 0.1, // 10% là featured
          verified: Math.random() < 0.7, // 70% là verified
          categories: {
            connect: selectedCategories.map(cat => ({ id: cat.id })),
          },
          useCases: {
            connect: selectedUseCases.map(uc => ({ id: uc.id })),
          },
          platforms: JSON.stringify(selectedPlatforms),
          integrations: JSON.stringify(integrations),
          launchDate: faker.date.past({ years: 3 }),
        },
      });
    } catch (e) {
      console.error(`Error creating tool ${name}:`, e);
    }
    
    if (i % 10 === 0) {
      console.log(`Đã tạo ${i} AI tools...`);
    }
  }

  console.log(`Đã tạo ${toolsToCreate} AI tools thành công`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 