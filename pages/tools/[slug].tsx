import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/Layout";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface UseCase {
  id: string;
  name: string;
  description?: string | null;
}

interface User {
  id: string;
  name?: string | null;
  image?: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  user: User;
}

export default function ToolDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const { data: tool, isLoading, error } = trpc.aiTool.getBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  const [reviewTab, setReviewTab] = useState(true);

  if (isLoading) {
    return (
      <Layout title="Đang tải...">
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin công cụ AI...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !tool) {
    return (
      <Layout title="Không tìm thấy">
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-500">
              {error?.message || "Không tìm thấy công cụ AI"}
            </h1>
            <p className="mb-6 text-gray-600">
              Công cụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <button
              onClick={() => router.push("/tools")}
              className="btn-primary"
            >
              Xem tất cả công cụ
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Xử lý đường dẫn tương đối
  const logoSrc = tool.logo?.startsWith('http') 
    ? tool.logo 
    : tool.logo 
      ? `/images/${tool.logo}` 
      : '/placeholder.png';

  // Format pricing
  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Parse platform và integrations
  const platforms = tool.platforms ? JSON.parse(tool.platforms as string) : [];
  const integrations = tool.integrations ? JSON.parse(tool.integrations as string) : [];

  return (
    <Layout 
      title={`${tool.name} - AI Directory`}
      description={tool.description}
    >
      {/* Hero Section */}
      <div className="bg-gray-50 py-8 shadow-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Logo */}
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="bg-white border w-40 h-40 rounded-lg flex items-center justify-center p-4 overflow-hidden">
                {tool.logo ? (
                  <img 
                    src={logoSrc} 
                    alt={`${tool.name} logo`} 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-4xl font-bold text-gray-300">
                    {tool.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {tool.verified && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Đã xác minh
                  </span>
                )}
                {tool.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Nổi bật
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
              
              <p className="text-gray-600 mb-4">
                {tool.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.categories.map((category: Category) => (
                  <Link 
                    href={`/categories/${category.slug}`} 
                    key={category.id}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="block text-gray-500 mb-1">Loại giá</span>
                  <span className="font-medium">{tool.pricingModel}</span>
                </div>
                
                <div>
                  <span className="block text-gray-500 mb-1">Phiên bản miễn phí</span>
                  <span className={`font-medium ${tool.hasFreeVersion ? 'text-green-600' : 'text-gray-700'}`}>
                    {tool.hasFreeVersion ? 'Có' : 'Không'}
                  </span>
                </div>
                
                {tool.startingPrice && (
                  <div>
                    <span className="block text-gray-500 mb-1">Giá khởi điểm</span>
                    <span className="font-medium">{formatPrice(tool.startingPrice)}</span>
                  </div>
                )}
                
                {tool.launchDate && (
                  <div>
                    <span className="block text-gray-500 mb-1">Ngày ra mắt</span>
                    <span className="font-medium">
                      {new Date(tool.launchDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="w-full md:w-1/4 flex flex-col gap-3 md:items-end mt-6 md:mt-0">
              {tool.website && (
                <a 
                  href={tool.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary w-full md:w-auto text-center"
                >
                  Truy cập Website
                </a>
              )}
              
              <button 
                onClick={() => alert('Tính năng này sẽ được phát triển trong tương lai!')}
                className="btn-secondary w-full md:w-auto text-center"
              >
                Lưu vào danh sách
              </button>
              
              <button 
                onClick={() => alert('Cảm ơn bạn đã chia sẻ công cụ này!')}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition w-full md:w-auto text-center flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                </svg>
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="container py-8">
        <div className="border-b mb-8">
          <div className="flex">
            <button
              onClick={() => setReviewTab(true)}
              className={`px-6 py-3 font-medium border-b-2 ${
                reviewTab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setReviewTab(false)}
              className={`px-6 py-3 font-medium border-b-2 ${
                !reviewTab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Đánh giá ({tool.reviews.length})
            </button>
          </div>
        </div>
        
        {reviewTab ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Mô tả chi tiết</h2>
              <div className="prose max-w-none mb-8">
                {tool.longDesc ? (
                  <div>{tool.longDesc}</div>
                ) : (
                  <p className="text-gray-500 italic">Không có mô tả chi tiết.</p>
                )}
              </div>
              
              {tool.useCases.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Trường hợp sử dụng</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tool.useCases.map((useCase: UseCase) => (
                      <div key={useCase.id} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">{useCase.name}</h3>
                        {useCase.description && (
                          <p className="text-gray-600">{useCase.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              {platforms.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Nền tảng</h3>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {integrations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tích hợp</h3>
                  <div className="flex flex-wrap gap-2">
                    {integrations.map((integration: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Thông tin thêm</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Ngày thêm vào:</span>
                    <span>{new Date(tool.createdAt).toLocaleDateString('vi-VN')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Cập nhật gần nhất:</span>
                    <span>{new Date(tool.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Lượt xem:</span>
                    <span>{tool.viewCount}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Đánh giá từ người dùng</h2>
            
            {tool.reviews.length > 0 ? (
              <div className="space-y-6">
                {tool.reviews.map((review: Review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          {review.user.image ? (
                            <img src={review.user.image} alt={review.user.name || "User"} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{review.user.name || "Anonymous"}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">Chưa có đánh giá nào cho công cụ này</p>
                <button
                  onClick={() => alert('Tính năng này sẽ được phát triển trong tương lai!')}
                  className="btn-primary"
                >
                  Viết đánh giá đầu tiên
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Related Tools */}
      <div className="bg-gray-50 py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Công cụ AI tương tự</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="card">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400">AI</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Công cụ AI tương tự</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Danh mục
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    Đang tải dữ liệu công cụ AI tương tự...
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Freemium
                    </span>
                    <span className="text-blue-600 text-sm font-medium">Xem chi tiết →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 