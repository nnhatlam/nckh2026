export const personalQuestions = [
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
    options: ['Đại học', 'Sau Đại học']
  },
  {
    id: 'income',
    section: 'Phần 3: Thông tin cá nhân',
    prompt: 'Thu nhập hàng tháng của Anh/Chị nằm trong khoảng nào dưới đây?',
    type: 'single',
    options: ['Dưới 10 triệu VNĐ', 'Từ 10 - 20 triệu VNĐ', 'Từ 20 - 30 triệu VNĐ', 'Từ 30 - 40 triệu VNĐ', 'Trên 40 triệu VNĐ']
  }
];