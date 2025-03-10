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

interface UseCaseDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  aiTools: AiTool[];
}

export default function UseCaseDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const { data: useCase, isLoading, error } = trpc.useCase.getBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <Layout
        title="Đang tải... - AI Directory"
        description="Đang tải thông tin trường hợp sử dụng."
      >
        <div className="container py-16 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </Layout>
    );
  }

  if (error || !useCase) {
    return (
      <Layout
        title="Không tìm thấy - AI Directory"
        description="Không tìm thấy trường hợp sử dụng."
      >
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy trường hợp sử dụng</h1>
          <p className="text-gray-600 mb-8">
            Trường hợp sử dụng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link href="/use-cases" className="btn-primary">
            Xem tất cả trường hợp sử dụng
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${useCase.name} - AI Directory`}
      description={useCase.description || `Khám phá các công cụ AI cho ${useCase.name}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="container">
          <Link href="/use-cases" className="text-blue-200 hover:text-white mb-4 inline-block">
            ← Quay lại tất cả trường hợp sử dụng
          </Link>
          <h1 className="text-4xl font-bold mb-4">{useCase.name}</h1>
          {useCase.description && (
            <p className="text-xl max-w-3xl">{useCase.description}</p>
          )}
        </div>
      </div>

      <div className="container py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Công cụ AI cho {useCase.name}</h2>
          
          {useCase.aiTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCase.aiTools.map((tool: AiTool) => (
                <Link href={`/tools/${tool.slug}`} key={tool.id} className="card hover:translate-y-[-5px] transition-transform">
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {tool.logo ? (
                          <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
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
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        {tool.pricingModel}
                      </span>
                      <span className="text-blue-600 flex items-center text-sm font-medium">
                        Chi tiết
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Chưa có công cụ nào</h3>
              <p className="text-gray-600 max-w-lg mx-auto">
                Hiện tại chưa có công cụ AI nào cho trường hợp sử dụng này. Xem lại sau nhé!
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4">Khám phá thêm trường hợp sử dụng AI</h3>
          <Link href="/use-cases" className="btn-primary">
            Xem tất cả trường hợp sử dụng
          </Link>
          <Link href="/tools" className="btn-secondary ml-4">
            Xem tất cả công cụ AI
          </Link>
        </div>
      </div>
    </Layout>
  );
} 