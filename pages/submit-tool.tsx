import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import Link from "next/link";
import { trpc } from "../utils/trpc";

export default function SubmitToolPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: useCases } = trpc.useCase.getAll.useQuery();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    longDesc: "",
    website: "",
    logo: "",
    pricingModel: "FREE",
    hasFreeVersion: true,
    startingPrice: "",
    categoryIds: [] as string[],
    useCaseIds: [] as string[],
    platforms: [] as string[],
    integrations: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Hàm xử lý khi thay đổi giá trị input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi chọn/bỏ chọn checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Hàm xử lý khi chọn/bỏ chọn các mục trong danh sách
  const handleMultiSelect = (name: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[name as keyof typeof prev] as string[];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [name]: currentValues.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [name]: [...currentValues, value],
        };
      }
    });
  };

  // Hàm tự động tạo slug từ tên
  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, slug }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      setError("Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    if (!formData.name || !formData.description || !formData.website) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    if (formData.categoryIds.length === 0) {
      setError("Vui lòng chọn ít nhất một danh mục.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Giả lập gửi form thành công
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      // Nếu có API thực tế, gửi form tại đây
      // await fetch('/api/submit-tool', { method: 'POST', body: JSON.stringify(formData) })
    } catch (err) {
      setError("Có lỗi xảy ra khi gửi form. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Danh sách các nền tảng
  const platformOptions = [
    "Web", "iOS", "Android", "Windows", "macOS", "Linux", "API"
  ];

  return (
    <Layout 
      title="Đăng ký công cụ AI - AI Directory" 
      description="Đăng ký công cụ AI của bạn vào AI Directory để được khám phá bởi nhiều người dùng."
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 text-white">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Đăng ký công cụ AI của bạn</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Thêm công cụ AI của bạn vào danh mục của chúng tôi để tiếp cận hàng nghìn người dùng tiềm năng.
          </p>
        </div>
      </div>

      <div className="container py-12">
        {success ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">Đăng ký thành công!</h2>
              <p className="mb-4">
                Cảm ơn bạn đã đăng ký công cụ AI của bạn. Chúng tôi sẽ xem xét và đưa vào danh mục sớm nhất có thể.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Link href="/" className="btn-primary">
                  Về trang chủ
                </Link>
                <Link href="/tools" className="btn-secondary">
                  Xem các công cụ
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {!session && (
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6">
                <p>
                  Bạn cần đăng nhập để đăng ký công cụ AI. 
                  <button 
                    onClick={() => void router.push("/api/auth/signin")}
                    className="text-blue-600 font-medium ml-2"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold border-b pb-4">Thông tin cơ bản</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên công cụ AI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={generateSlug}
                      className="input w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="input w-full"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Slug sẽ được sử dụng trong URL (ví dụ: /tools/ten-cong-cu)
                    </p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả ngắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="input w-full"
                    maxLength={200}
                    required
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    Tối đa 200 ký tự
                  </p>
                </div>
                
                <div>
                  <label htmlFor="longDesc" className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    id="longDesc"
                    name="longDesc"
                    value={formData.longDesc}
                    onChange={handleChange}
                    rows={5}
                    className="input w-full"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="https://"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      id="logo"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold border-b pb-4">Phân loại</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  {categories ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.categoryIds.includes(category.id)}
                            onChange={() => handleMultiSelect("categoryIds", category.id)}
                            className="h-4 w-4"
                          />
                          <span>{category.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Đang tải danh mục...</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trường hợp sử dụng
                  </label>
                  {useCases ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {useCases.map((useCase) => (
                        <label key={useCase.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.useCaseIds.includes(useCase.id)}
                            onChange={() => handleMultiSelect("useCaseIds", useCase.id)}
                            className="h-4 w-4"
                          />
                          <span>{useCase.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Đang tải trường hợp sử dụng...</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nền tảng
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {platformOptions.map((platform) => (
                      <label key={platform} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.platforms.includes(platform)}
                          onChange={() => handleMultiSelect("platforms", platform)}
                          className="h-4 w-4"
                        />
                        <span>{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-bold border-b pb-4">Thông tin giá</h2>
                
                <div>
                  <label htmlFor="pricingModel" className="block text-sm font-medium text-gray-700 mb-1">
                    Mô hình giá <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="pricingModel"
                    name="pricingModel"
                    value={formData.pricingModel}
                    onChange={handleChange}
                    className="input w-full"
                    required
                  >
                    <option value="FREE">Miễn phí</option>
                    <option value="FREEMIUM">Freemium</option>
                    <option value="PAID">Trả phí</option>
                    <option value="SUBSCRIPTION">Đăng ký</option>
                    <option value="CONTACT_FOR_PRICING">Liên hệ để biết giá</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasFreeVersion"
                    name="hasFreeVersion"
                    checked={formData.hasFreeVersion}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 mr-2"
                  />
                  <label htmlFor="hasFreeVersion" className="text-sm font-medium text-gray-700">
                    Có phiên bản miễn phí
                  </label>
                </div>
                
                <div>
                  <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Giá khởi điểm (USD)
                  </label>
                  <input
                    type="number"
                    id="startingPrice"
                    name="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleChange}
                    className="input w-full"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Để trống nếu miễn phí hoặc cần liên hệ để biết giá
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !session}
                  className="btn-primary px-8 py-3"
                >
                  {isSubmitting ? "Đang gửi..." : "Đăng ký công cụ AI"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
} 