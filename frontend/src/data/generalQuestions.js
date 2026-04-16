export const introductionCopy = `Kính gửi Anh/Chị
Nhóm nghiên cứu đến từ Trường Đại học Ngoại thương hiện đang tìm hiểu về hành vi và ưu tiên của người tiêu dùng đối với thị trường xe điện tại Việt Nam.

Sự phát triển của phương tiện xanh đang là xu hướng tất yếu, và những đánh giá khách quan của Anh/Chị sẽ là đóng góp vô cùng quý giá cho sự thành công của nghiên cứu này. Nhóm kính mời Anh/Chị dành ít phút để tham gia khảo sát ngắn về việc lựa chọn các dòng xe điện tiềm năng.

Mọi thông tin đóng góp sẽ chỉ phục vụ cho mục đích học thuật và nghiên cứu.

Trân trọng cảm ơn sự hợp tác của Anh/Chị!`;

export const generalQuestions = [
  {
    id: 'consent',
    section: 'Phần 1: Xác nhận tham gia',
    prompt: 'Nhóm nghiên cứu cam kết bảo mật mọi thông tin cá nhân của Anh/Chị. Anh/Chị có đồng ý tham gia trả lời khảo sát này không?',
    type: 'single',
    options: ['Tôi đồng ý', 'Tôi không đồng ý']
  },
  {
    id: 'main_transport',
    section: 'Phần 2: Thói quen di chuyển & tiêu dùng',
    prompt: 'Anh/Chị hiện đang sử dụng phương tiện nào là chủ yếu để di chuyển hàng ngày?',
    type: 'single',
    options: ['Xe máy xăng', 'Xe máy điện', 'Ô tô xăng', 'Ô tô điện', 'Xe bus', 'Xe đạp', 'Khác']
  },
  {
    id: 'ev_knowledge',
    section: 'Phần 2: Thói quen di chuyển & tiêu dùng',
    prompt: 'Anh/Chị tự đánh giá mức độ hiểu biết của mình về xe điện như thế nào?',
    type: 'single',
    options: ['Hoàn toàn không biết', 'Biết sơ qua', 'Hiểu rõ', 'Rất chuyên sâu']
  },
  {
    id: 'known_brands',
    section: 'Phần 2: Thói quen di chuyển & tiêu dùng',
    prompt: 'Anh/Chị biết đến những thương hiệu xe điện nào hiện có trên thị trường?',
    type: 'text',
    placeholder: 'Ví dụ: VinFast, Yadea, Dat Bike...'
  },
  {
    id: 'daily_distance',
    section: 'Phần 2: Thói quen di chuyển & tiêu dùng',
    prompt: 'Trung bình một ngày Anh/Chị di chuyển quãng đường khoảng bao nhiêu km?',
    type: 'single',
    options: ['Dưới 10km', 'Từ 10 - 30km', 'Từ 30 - 50km', 'Trên 50km']
  },
  {
    id: 'ev_priority',
    section: 'Phần 2: Thói quen di chuyển & tiêu dùng',
    prompt: 'Nếu chọn mua một chiếc xe điện, Anh/Chị sẽ ưu tiên những yếu tố nào sau đây?',
    type: 'multi',
    options: [
      'Xuất xứ thương hiệu (Trong nước/Quốc tế)',
      'Quãng đường di chuyển sau một lần sạc',
      'Độ mới của thương hiệu (Hãng lâu đời hay hãng mới nổi)',
      'Giá thành sản phẩm',
      'Hệ thống trạm sạc',
      'Chi phí vận hành, bảo trì',
      'Thời gian sạc'
    ]
  },
  {
    id: 'full_name',
    section: 'Phần 3: Thông tin cá nhân',
    prompt: 'Họ và tên của Anh/Chị',
    type: 'text',
    placeholder: 'Nhập họ và tên của Anh/Chị'
  },
  {
    id: 'birth_year',
    section: 'Phần 3: Thông tin cá nhân',
    prompt: 'Năm sinh của Anh/Chị',
    type: 'number',
    placeholder: 'Ví dụ: 1998'
  },
  {
    id: 'residence',
    section: 'Phần 3: Thông tin cá nhân',
    prompt: 'Nơi ở hiện tại của Anh/Chị (phường/xã - Tỉnh/Thành phố).',
    type: 'text',
    placeholder: 'Ví dụ: Phường Bến Nghé - TP. Hồ Chí Minh'
  },
  {
    id: 'education',
    section: 'Phần 3: Thông tin cá nhân',
    prompt: 'Trình độ học vấn của Anh/Chị',
    type: 'single',
    options: ['Dưới Đại học', 'Đại học', 'Sau Đại học']
  },
  {
    id: 'income',
    section: 'Phần 3: Thông tin cá nhân',
    prompt: 'Thu nhập hàng tháng của Anh/Chị nằm trong khoảng nào dưới đây?',
    type: 'single',
    options: ['Dưới 10 triệu VNĐ', 'Từ 10 - 20 triệu VNĐ', 'Từ 20 - 30 triệu VNĐ', 'Từ 30 - 40 triệu VNĐ', 'Trên 40 triệu VNĐ']
  }
];
