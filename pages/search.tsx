import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import Layout from "../components/Layout";

interface Category {
  id?: string;
  name: string;
  slug: string;
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

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (typeof q === "string") {
      setSearchQuery(q);
    }
  }, [q]);
  
  const { data: searchResults, isLoading } = trpc.aiTool.getFiltered.useQuery(
    { search: searchQuery },
    { enabled: !!searchQuery }
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <Layout
      title={`Tìm kiếm: ${searchQuery || ""} - AI Directory`}
      description="Tìm kiếm các công cụ AI theo tên, mô tả hoặc tính năng."
    >
      {/* Search header */}
      <div className="bg-gray-50 py-6 border-b">
        <div className="container">
          <h1 className="text-2xl font-bold mb-4">Tìm kiếm công cụ AI</h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm công cụ AI..."
                className="input w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Results */}
      <div className="container py-8">
        {!searchQuery ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Tìm kiếm công cụ AI</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Nhập từ khóa để tìm kiếm các công cụ AI. Bạn có thể tìm theo tên, mô tả, 
              hoặc bất kỳ tính năng nào của công cụ.
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="h-12 w-12 mx-auto animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Đang tìm kiếm công cụ phù hợp...</p>
          </div>
        ) : searchResults?.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
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
            </div>
            <h2 className="text-2xl font-semibold mb-2">Không tìm thấy kết quả</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Không tìm thấy công cụ AI nào phù hợp với từ khóa "{searchQuery}".
              Hãy thử tìm kiếm với từ khóa khác.
            </p>
            <Link href="/tools" className="btn-primary">
              Xem tất cả công cụ
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">
              Kết quả tìm kiếm cho "{searchQuery}"
              <span className="text-gray-500 text-lg font-normal ml-2">
                ({searchResults?.items.length} kết quả)
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults?.items.map((tool: AiTool) => (
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
          </>
        )}
      </div>
    </Layout>
  );
} 