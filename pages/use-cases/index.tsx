import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/Layout";

// Định nghĩa kiểu dữ liệu cho UseCase
interface UseCase {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: {
    aiTools: number;
  };
}

export default function UseCasesPage() {
  const { data: useCases, isLoading } = trpc.useCase.getAll.useQuery();

  return (
    <Layout
      title="Trường hợp sử dụng - AI Directory"
      description="Khám phá các trường hợp sử dụng của công cụ AI khác nhau và tìm công cụ phù hợp cho nhu cầu của bạn."
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Trường hợp sử dụng AI</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Khám phá các trường hợp sử dụng của công cụ AI khác nhau và tìm công cụ phù hợp cho nhu cầu của bạn.
          </p>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          </div>
        ) : !useCases || useCases.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Không có trường hợp sử dụng nào.</h2>
            <p className="text-gray-600">Trường hợp sử dụng đang được cập nhật, vui lòng quay lại sau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase: UseCase) => (
              <Link
                key={useCase.id}
                href={`/use-cases/${useCase.slug}`}
                className="group block bg-white hover:bg-gray-50 rounded-lg shadow transition p-6 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold group-hover:text-blue-600 transition">
                    {useCase.name}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {useCase._count?.aiTools || 0} công cụ
                  </span>
                </div>
                
                {useCase.description && (
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                )}
                
                <p className="text-blue-600 text-sm font-medium group-hover:underline flex items-center">
                  Xem trường hợp sử dụng
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
        )}
      </div>
    </Layout>
  );
} 