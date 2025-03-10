import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/Layout";

// Định nghĩa các kiểu dữ liệu
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface AiTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  website: string | null;
  pricingModel: string;
  hasFreeVersion: boolean;
  startingPrice: number | null;
  categories: Category[];
}

interface CategoryDetail extends Category {
  aiTools: AiTool[];
}

export default function CategoryDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const { data: category, isLoading, error } = trpc.category.getBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );
  
  // Nếu đang tải dữ liệu
  if (isLoading) {
    return (
      <Layout title="Đang tải...">
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin danh mục...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Nếu có lỗi hoặc không tìm thấy danh mục
  if (error || !category) {
    return (
      <Layout title="Không tìm thấy">
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-500">
              {error?.message || "Không tìm thấy danh mục"}
            </h1>
            <p className="mb-6 text-gray-600">
              Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <button
              onClick={() => router.push("/categories")}
              className="btn-primary"
            >
              Xem tất cả danh mục
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout
      title={`${category.name} - Danh mục AI Directory`}
      description={category.description || `Khám phá các công cụ AI trong danh mục ${category.name}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 text-white">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg max-w-3xl">{category.description}</p>
            )}
            <div className="mt-6">
              <Link href="/categories" className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-full transition shadow-md">
                ← Tất cả danh mục
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Danh sách công cụ */}
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-8">
          Công cụ AI trong danh mục {category.name}
          <span className="text-gray-500 font-normal text-lg ml-2">
            ({category.aiTools.length} công cụ)
          </span>
        </h2>
        
        {category.aiTools.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Không có công cụ nào</h3>
            <p className="text-gray-600 mb-6">
              Danh mục này hiện chưa có công cụ AI nào. Chúng tôi sẽ cập nhật sớm.
            </p>
            <Link href="/tools" className="btn-primary">
              Xem tất cả công cụ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.aiTools.map((tool: AiTool) => (
              <Link href={`/tools/${tool.slug}`} key={tool.id} className="card hover:translate-y-[-5px] transition-transform">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      {tool.logo ? (
                        <img
                          src={tool.logo.startsWith('http') ? tool.logo : `/images/${tool.logo}`} 
                          alt={tool.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">
                          {tool.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{tool.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {tool.categories.slice(0, 2).map((category: Category) => (
                          <span
                            key={category.id}
                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{tool.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`text-sm ${tool.hasFreeVersion ? 'text-green-600' : 'text-gray-600'}`}>
                      {tool.hasFreeVersion ? 'Có phiên bản miễn phí' : tool.pricingModel}
                    </span>
                    <span className="text-blue-600 text-sm font-medium">Xem chi tiết →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Related categories */}
      <div className="bg-gray-50 py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Các danh mục khác</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Link
                key={index}
                href="/categories"
                className="group bg-white hover:bg-blue-50 rounded-lg shadow transition p-6 hover:shadow-md block"
              >
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">Danh mục khác</h3>
                <p className="text-gray-600 mb-4">Xem các danh mục công cụ AI khác</p>
                <p className="text-blue-600 text-sm font-medium group-hover:underline flex items-center">
                  Khám phá
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 