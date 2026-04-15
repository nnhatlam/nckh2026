The primary objective of this web application is to host a scalable, serverless Discrete Choice Experiment (DCE) to measure consumer brand preferences and willingness to pay for Electric Vehicles (EVs) in the Vietnam market. By presenting respondents with randomly assigned, side-by-side attribute profiles—such as vehicle brand, price, and charging infrastructure—the platform automatically structures and securely transmits user decisions to a cloud-based database. Ultimately, the site acts as a custom, high-throughput data collection engine designed to capture the precise, unbiased consumer choices required for advanced econometric modeling.

1. System Architecture & Tech Stack
   Frontend Framework: React
   Styling: Tailwind CSS
   Language of the Web: Vietnamese
   Make sure the page is scalable for both laptop and mobile phone

Backend API: Google Apps Script (Serverless POST endpoint).

Database: Google Sheets.

Data Source: Questions - list of choice sets for this survey website are read from a XLSX file.

### Input data schema:

"
1_origin
1_brand
1_price
1_batter_ener
1_range 1_station
1_charge_time
2_origin
2_brand
2_price
2 \_batter_ener
2_range 2_station
2_charge_time
choice_set
block
"
where columns starts with 1 refers to the alternative 1 of the choice set, and columns starts with 2 refers to the alternative 2. choice_set is the index for this table

## styling

primary color: #930500 - for footer and header
secondary color: #95bbea - used for secondary buttons
background: #FFF8E7
attempt glass effect, clean modern look, add each question to a glass card
Font: Poppins

2. Frontend Functional Requirements
   State Management

The application must generate a unique Session_ID for each user upon load to group their responses together.

The application must track the user's progress (e.g., "Question 2 of 6").

The application must temporarily store the user's selections in a local JavaScript array until the final submission or submit them asynchronously after every click.

The Randomization Engine

Block Assignment: On initial load, the script must randomly assign the user to a block of choice sets: an integer between 1 and 40.

Data Filtering: The app must filter the master xlsx file to extract exact 4 choice sets of that block.

Sequence Shuffling: The app must use the Fisher-Yates algorithm to randomize the display order of those 6 sets.

Position Shuffling: For each choice set, the app must randomly assign which alternative (A or B) appears on the left vs. the right side of the screen to prevent reading bias.

User Interface Flow

## Landing Screen: A clean introduction explaining the EV research context, estimated time to complete, and a "Start Survey" button.

introduction: "Kính gửi Anh/Chị
Nhóm nghiên cứu đến từ Trường Đại học Ngoại thương hiện đang tìm hiểu về hành vi và ưu tiên của người tiêu dùng đối với thị trường xe điện tại Việt Nam.

Sự phát triển của phương tiện xanh đang là xu hướng tất yếu, và những đánh giá khách quan của Anh/Chị sẽ là đóng góp vô cùng quý giá cho sự thành công của nghiên cứu này. Nhóm kính mời Anh/Chị dành ít phút để tham gia khảo sát ngắn về việc lựa chọn các dòng xe điện tiềm năng.

Mọi thông tin đóng góp sẽ chỉ phục vụ cho mục đích học thuật và nghiên cứu.

Trân trọng cảm ơn sự hợp tác của Anh/Chị"

## General Questions: - in multiple choice

"
Phần 1: Xác nhận tham gia

1. Nhóm nghiên cứu cam kết bảo mật mọi thông tin cá nhân của Anh/Chị. Anh/Chị có đồng ý tham gia trả lời khảo sát này không? (Tôi đồng ý / Tôi không đồng ý)

Phần 2: Thói quen di chuyển & tiêu dùng 2. Anh/Chị hiện đang sử dụng phương tiện nào là chủ yếu để di chuyển hàng ngày? (Xe máy xăng, xe máy điện, ô tô xăng, ô tô điện, xe bus, xe đạp, Khác)

3. Anh/Chị tự đánh giá mức độ hiểu biết của mình về xe điện như thế nào?
   (1) Hoàn toàn không biết
   (2) Biết sơ qua
   (3) Hiểu rõ
   (4) Rất chuyên sâu

4. Anh/Chị biết đến những thương hiệu xe điện nào hiện có trên thị trường? (Điền short answer)

5. Trung bình một ngày Anh/Chị di chuyển quãng đường khoảng bao nhiêu km?
   (1) Dưới 10km
   (2) Từ 10 - 30km
   (3) Từ 30 - 50km
   (4) Trên 50km

6. Nếu chọn mua một chiếc xe điện, Anh/Chị sẽ ưu tiên những yếu tố nào sau đây? (Vui lòng chọn các mục phù hợp)
   (1) Xuất xứ thương hiệu (Trong nước/Quốc tế)
   (2) Quãng đường di chuyển sau một lần sạc
   (3) Độ mới của thương hiệu (Hãng lâu đời hay hãng mới nổi)
   (4) Giá thành sản phẩm
   (5) Hệ thống trạm sạc
   (6) Chi phí vận hành, bảo trì
   (7) Thời gian sạc

7. Họ và tên của Anh/Chị

8. Năm sinh của Anh/Chị

9. Nơi ở hiện tại của Anh/Chị (phường/xã - Tỉnh/Thành phố).

10. Trình độ học vấn của Anh/Chị
    (1) Dưới Đại học
    (2) Đại học
    (3) Sau Đại học

11. Thu nhập hàng tháng của Anh/Chị nằm trong khoảng nào dưới đây?
    (1) Dưới 10 triệu VNĐ
    (2) Từ 10 - 20 triệu VNĐ
    (3) Từ 20 - 30 triệu VNĐ
    (4) Từ 30 - 40 triệu VNĐ
    (5) Trên 40 triệu VNĐ
    "

## choose among options section: each choice set is a separate screen

Choice Interface: The core screen displaying two distinct attribute cards side-by-side, plus an optional "I would not buy either" button (if your model includes an opt-out).

Loading State: A brief visual indicator (spinner or progress bar) while data is being transmitted to the backend.

Thank You Screen: A final confirmation page ensuring the user that their data was securely recorded.

## Footer:

since 2026.
This webpage is developed with the help of GitHub Copilot
Powered by GitHub Pages & Google Apps Script
FTU Research Group 2026

3. Backend & Database Requirements
   API Endpoint

The Google Apps Script must be configured as a Web App deployed to "Anyone".

The script must accept standard JSON POST requests.

The script must include a CORS header or accept no-cors mode requests from your frontend domain.

Google Sheet Schema (Columns)

Timestamp: Automatically generated by the backend.

Session_ID: The unique identifier for the user.

Assigned_Block: The block number (1-6) the user was given.

Set_ID: The globally unique identifier for the specific choice set (1-36).

Position_Left: The profile/alternative that was randomly displayed on the left.

Position_Right: The profile/alternative that was randomly displayed on the right.

4. Non-Functional Requirements
   Mobile Responsiveness: The choice cards must stack vertically on mobile devices (phones) and display side-by-side on tablets/desktops.

Performance: The survey must load instantly. All EV choice data should be pre-loaded in the JSON file; no external database calls should be made to fetch the questions.

Data Integrity: The application must prevent the user from clicking "Next" without selecting an option.

Scalability: The architecture must comfortably handle 1000+ respondents without hitting API rate limits (Google Sheets handles this scale easily if requests are kept simple).

## Implementation Notes

- The working React app now lives in `frontend/` and is split into `src/components`, `src/data`, `src/utils`, and `src/styles`.
- The survey questions are preloaded from `frontend/src/data/choice_sets.json`, which is generated from `backend/data/choice_sets.xlsx` and mirrored to `backend/data/choice_sets.json` for convenience.
- A sample Google Apps Script receiver is available at `backend/google-apps-script/Code.gs`.
- To run the frontend locally, install dependencies inside `frontend/` and start Vite with `npm run dev`.
- Set `VITE_SURVEY_ENDPOINT_URL` in the frontend environment when you are ready to point submissions to the deployed Apps Script web app.
