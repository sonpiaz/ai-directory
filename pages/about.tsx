import Link from "next/link";
import Layout from "../components/Layout";

export default function AboutPage() {
  return (
    <Layout
      title="Giới thiệu về AI Directory | Thư viện công cụ AI"
      description="AI Directory là thư viện tra cứu công cụ AI lớn nhất Việt Nam, giúp bạn tìm kiếm và khám phá các công cụ AI phù hợp nhất cho nhu cầu của mình."
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Giới thiệu về AI Directory</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Sứ mệnh của chúng tôi là giúp mọi người dễ dàng tìm kiếm và khám phá các công cụ AI tốt nhất.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2>Chúng tôi là ai?</h2>
            <p>
              AI Directory là thư viện tra cứu công cụ AI lớn nhất, nơi tập hợp hơn 500 công cụ AI hiện đại và hữu ích nhất. 
              Chúng tôi ra đời với sứ mệnh giúp người dùng dễ dàng khám phá và tìm kiếm các công cụ AI phù hợp với nhu cầu
              cụ thể của họ, từ đó tiết kiệm thời gian và tăng năng suất trong công việc và cuộc sống.
            </p>
            
            <h2>Tầm nhìn của chúng tôi</h2>
            <p>
              Chúng tôi tin rằng AI sẽ định hình lại tương lai của công việc và cuộc sống. Tầm nhìn của chúng tôi là tạo ra một 
              nền tảng toàn diện giúp kết nối người dùng với những công cụ AI phù hợp nhất, đồng thời thúc đẩy sự phát triển
              và ứng dụng AI trong cộng đồng Việt Nam.
            </p>
            
            <h2>Chúng tôi làm gì?</h2>
            <p>
              Đội ngũ AI Directory liên tục nghiên cứu, đánh giá và phân loại các công cụ AI mới nhất trên thị trường.
              Chúng tôi cung cấp thông tin chi tiết về mỗi công cụ, bao gồm:
            </p>
            <ul>
              <li>Mô tả chi tiết và cách sử dụng</li>
              <li>Đánh giá tính năng và lợi ích</li>
              <li>Thông tin về giá cả và các phiên bản</li>
              <li>Phân loại theo danh mục và trường hợp sử dụng</li>
              <li>Đánh giá và nhận xét từ người dùng thực tế</li>
            </ul>
            
            <h2>Giá trị cốt lõi</h2>
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-800 mb-2">Khách quan & Trung thực</h3>
                <p className="text-gray-700">
                  Chúng tôi cam kết đưa ra đánh giá khách quan và trung thực về mỗi công cụ AI, giúp người dùng có thông tin
                  đầy đủ để đưa ra quyết định đúng đắn.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-indigo-800 mb-2">Cập nhật & Toàn diện</h3>
                <p className="text-gray-700">
                  Chúng tôi liên tục cập nhật thư viện với những công cụ AI mới nhất và đảm bảo cung cấp thông tin
                  toàn diện về mỗi công cụ.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-800 mb-2">Hữu ích & Thiết thực</h3>
                <p className="text-gray-700">
                  Chúng tôi tập trung vào việc giúp người dùng tìm kiếm công cụ AI có giá trị thực tế và hữu ích
                  cho nhu cầu cụ thể của họ.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-purple-800 mb-2">Cộng đồng & Chia sẻ</h3>
                <p className="text-gray-700">
                  Chúng tôi xây dựng một cộng đồng mạnh mẽ, nơi mọi người có thể chia sẻ kinh nghiệm và học hỏi
                  từ nhau về cách sử dụng AI hiệu quả.
                </p>
              </div>
            </div>
            
            <h2>Cách chúng tôi chọn lọc công cụ AI</h2>
            <p>
              Mỗi công cụ AI trong thư viện của chúng tôi đều trải qua quy trình đánh giá nghiêm ngặt dựa trên các tiêu chí:
            </p>
            <ul>
              <li>Tính hữu ích và giá trị thực tiễn</li>
              <li>Độ tin cậy và chất lượng đầu ra</li>
              <li>Trải nghiệm người dùng và giao diện</li>
              <li>Giá trị so với chi phí</li>
              <li>Khả năng tích hợp và mở rộng</li>
              <li>Bảo mật và quyền riêng tư</li>
            </ul>
            
            <h2>Liên hệ với chúng tôi</h2>
            <p>
              Chúng tôi luôn mong muốn nhận được phản hồi từ người dùng. Nếu bạn có bất kỳ câu hỏi, góp ý hoặc muốn giới thiệu
              một công cụ AI mới, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:contact@aidirectory.example.com">contact@aidirectory.example.com</a>
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg my-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Bạn đã sẵn sàng khám phá các công cụ AI?</h3>
              <p className="mb-6">
                Bắt đầu tìm kiếm công cụ AI phù hợp với nhu cầu của bạn ngay hôm nay!
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/tools" className="btn-primary">
                  Xem tất cả công cụ
                </Link>
                <Link href="/categories" className="btn-secondary">
                  Khám phá theo danh mục
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 