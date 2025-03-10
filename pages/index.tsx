import { useState } from "react";
import { trpc } from "../utils/trpc";
import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: featuredTools } = trpc.aiTool.getFeatured.useQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      void router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Khám phá 500+ công cụ AI hàng đầu
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Thư mục công cụ AI lớn nhất, được phân loại và đánh giá để giúp bạn tìm ra công cụ hoàn hảo cho nhu cầu của mình.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm công cụ AI..."
                className="input w-full py-4 px-6 rounded-full text-gray-900"
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
      </section>

      {/* Featured AI tools */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Công cụ AI nổi bật</h2>
          {featuredTools ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="card hover:translate-y-[-5px] transition-transform"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        {tool.logo ? (
                          <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-2xl font-bold text-gray-400">
                            {tool.name.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{tool.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {tool.categories.slice(0, 2).map((category) => (
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
                        {tool.hasFreeVersion ? 'Có phiên bản miễn phí' : 'Trả phí'}
                      </span>
                      <span className="text-blue-600 text-sm font-medium">Xem chi tiết →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Đang tải công cụ nổi bật...</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/tools" className="btn-primary">
              Xem tất cả công cụ
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Khám phá theo danh mục</h2>
          {categories ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
                >
                  <h3 className="font-bold mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Đang tải danh mục...</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bạn là nhà phát triển AI?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Thêm công cụ AI của bạn vào thư mục của chúng tôi và được khám phá bởi hàng nghìn người dùng tiềm năng.
          </p>
          <Link href="/submit-tool" className="btn bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8">
            Thêm công cụ AI
          </Link>
        </div>
      </section>
    </Layout>
  );
} 