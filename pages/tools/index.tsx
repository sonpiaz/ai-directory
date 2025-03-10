import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/Layout";

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

export default function ToolsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [pricingFilter, setPricingFilter] = useState<string | null>(null);

  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: aiToolsData, isLoading } = trpc.aiTool.getFiltered.useQuery({
    search: searchQuery,
    categories: selectedCategories,
    pricingModels: pricingFilter ? [pricingFilter] : undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(slug)) {
        return prev.filter(cat => cat !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  const handlePricingFilter = (filter: string | null) => {
    setPricingFilter(filter);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPricingFilter(null);
    setSearchQuery("");
  };

  return (
    <Layout 
      title="Thư viện công cụ AI - AI Directory"
      description="Khám phá bộ sưu tập đầy đủ các công cụ trí tuệ nhân tạo (AI) được phân loại và đánh giá."
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Thư viện công cụ AI</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Khám phá bộ sưu tập đầy đủ các công cụ trí tuệ nhân tạo (AI) được phân loại và đánh giá.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm công cụ AI..."
                className="w-full py-4 px-6 rounded-full text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
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

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Bộ lọc</h3>
                  {(selectedCategories.length > 0 || pricingFilter) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Loại giá</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={pricingFilter === null}
                        onChange={() => handlePricingFilter(null)}
                      />
                      <span className="ml-2">Tất cả</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={pricingFilter === "FREE"}
                        onChange={() => handlePricingFilter("FREE")}
                      />
                      <span className="ml-2">Miễn phí</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={pricingFilter === "FREEMIUM"}
                        onChange={() => handlePricingFilter("FREEMIUM")}
                      />
                      <span className="ml-2">Freemium</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={pricingFilter === "PAID"}
                        onChange={() => handlePricingFilter("PAID")}
                      />
                      <span className="ml-2">Trả phí</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-blue-600"
                        checked={pricingFilter === "SUBSCRIPTION"}
                        onChange={() => handlePricingFilter("SUBSCRIPTION")}
                      />
                      <span className="ml-2">Đăng ký</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Danh mục</h4>
                  {categories ? (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {categories.map((category: Category) => (
                        <label key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.slug)}
                            onChange={() => handleCategoryToggle(category.slug)}
                            className="mr-2"
                          />
                          {category.name}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">Đang tải danh mục...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">
              {searchQuery 
                ? `Kết quả tìm kiếm cho "${searchQuery}"`
                : selectedCategories.length > 0 || pricingFilter
                  ? "Công cụ AI đã lọc"
                  : "Tất cả công cụ AI"}
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
              </div>
            ) : aiToolsData?.items.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
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
                <h3 className="text-xl font-semibold mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-600 mb-6">
                  Không tìm thấy công cụ AI nào phù hợp với tiêu chí tìm kiếm của bạn.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn-primary"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {aiToolsData?.items.map((tool: AiTool) => (
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
            )}
            
            {aiToolsData?.nextCursor && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => {/* Implement pagination */}}
                  className="btn-secondary"
                >
                  Tải thêm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 