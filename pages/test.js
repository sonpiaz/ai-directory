export default function TestPage() {
  return (
    <div style={{ 
      padding: '50px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#4B5563' }}>Trang kiểm tra localhost</h1>
      <p style={{ color: '#6B7280', marginBottom: '20px' }}>Nếu bạn nhìn thấy trang này, localhost đang hoạt động!</p>
      <div style={{ 
        padding: '20px',
        backgroundColor: '#F3F4F6',
        borderRadius: '8px',
        marginBottom: '20px',
        maxWidth: '500px'
      }}>
        <h2 style={{ color: '#4B5563', fontSize: '18px', marginBottom: '10px' }}>Thông tin hữu ích:</h2>
        <ul style={{ color: '#6B7280', lineHeight: '1.8' }}>
          <li>Server Next.js đang chạy trên cổng 3000</li>
          <li>URL đầy đủ: <a href="http://localhost:3000" style={{ color: '#3B82F6' }}>http://localhost:3000</a></li>
          <li>Hoặc các URL thay thế: <a href="http://127.0.0.1:3000" style={{ color: '#3B82F6' }}>http://127.0.0.1:3000</a></li>
        </ul>
      </div>
      <a 
        href="/" 
        style={{ 
          padding: '10px 20px',
          backgroundColor: '#3B82F6',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none' 
        }}
      >
        Quay về trang chủ
      </a>
    </div>
  )
} 