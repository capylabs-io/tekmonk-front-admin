"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CompetitionInstructions = () => {
  return (
    <div className=" mx-auto">
      <div className="text-2xl font-bold mb-4"> Hướng dẫn thi đấu</div>

      <Card className="mb-8 border-none p-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold">1. Vòng loại</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-lg font-semibold mb-2">1.1. Cách đăng ký</div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Thí sinh truy cập công đăng ký trực tuyến và điền đầy đủ thông
                tin tại link: olympiad.tekmonk.edu.vn muộn nhất vào 23:59 ngày
                28/11/2024.
              </li>
              <li>
                Thí sinh đóng lệ phí thi theo hướng dẫn tại email của Ban tổ
                chức sau khi hoàn tất đăng ký trực tuyến.
              </li>
            </ul>
          </div>

          <div>
            <div className="text-lg font-semibold mb-2">
              1.2. Nội dung thi và phương thức thi
            </div>
            <div className="text-lg font-semibold mb-2">Bảng A, B, C:</div>
            <ul className="list-disc pl-5 mb-4">
              <li>
                Thí sinh hoàn thành các thử thách lập trình trên nền tảng
                CodeCombat theo yêu cầu của đề thi, với độ khó tăng dần, phù hợp
                với từng bảng thi.
              </li>
              <li>
                Học sinh thi cá nhân, tham gia thi tập trung tại các điểm thi do
                Ban Tổ chức lựa chọn, thời gian thi 75 phút.
              </li>
            </ul>
            <div className="font-semibold mb-2">Bảng D:</div>
            <ul className="list-disc pl-5">
              <li>
                Thí sinh lập trình phần mềm, ứng dụng sáng tạo, sử dụng ngôn ngữ
                lập trình Scratch hoặc Python theo chủ đề &quot;Trường học tương
                lai&quot;
              </li>
              <li>
                Ban Tổ chức thông báo trước chủ đề và định hướng của bảng thi để
                thí sinh chuẩn bị (có văn bản công bố chủ đề và hướng dẫn cách
                thức thi riêng. Thời gian công bố dự kiến trước ngày
                25/11/2024).
              </li>
              <li>
                Học sinh có thể thi cá nhân hoặc đội nhóm (Tối đa 3 thành viên),
                nộp bài thi trực tuyến qua website olympiad.tekmonk.edu.vn.
              </li>
            </ul>
          </div>

          <div>
            <div className="text-lg font-semibold mb-2">
              1.3. Cách thức nộp bài
            </div>
            <div className="font-semibold mb-2">Bảng A, B, C:</div>
            <p className="mb-4">
              Thí sinh nộp bài theo hướng dẫn tại buổi thi tập trung.
            </p>
            <div className="font-semibold mb-2">Bảng D:</div>
            <p className="mb-2">
              Thí sinh nộp sản phẩm qua hệ thống của Ban Tổ chức bao gồm:
            </p>
            <ul className="list-disc pl-5">
              <li>Thuyết minh sản phẩm (theo mẫu)</li>
              <li>Mã nguồn</li>
              <li>Video clip</li>
              <li>Ấn phẩm thuyết trình (nếu có)</li>
            </ul>
          </div>

          <div>
            <div className="text-lg font-semibold mb-2">
              1.4. Tiêu chí chấm điểm
            </div>
            <div className="font-semibold mb-2">Bảng A, B, C:</div>
            <ul className="list-disc pl-5 mb-4">
              <li>
                Thí sinh hoàn thiện đủ các thử thách theo yêu cầu đề bài sẽ được
                chọn vào Vòng Quốc gia. Tất cả thí sinh tham gia cần tuân thủ
                quyết định của Ban Tổ chức.
              </li>
              <li>
                Các quyết định này được xem là cuối cùng và liên quan trực tiếp
                đến nội dung của giải đấu Tekmonk Coding Olympiad.
              </li>
            </ul>
            <div className="font-semibold mb-2">Bảng D:</div>
            <p className="mb-2">
              Top 20% sản phẩm có tổng điểm (do BGK đánh giá) cao nhất, nhưng
              không vượt quá 60 đội thi, sẽ được chọn vào Vòng Quốc gia. Tiêu
              chí chấm điểm theo các khía cạnh bao gồm:
            </p>
            <ul className="list-disc pl-5">
              <li>Chức năng của sản phẩm công nghệ</li>
              <li>Giao diện người dùng</li>
              <li>Chất lượng mã nguồn</li>
              <li>Mức độ liên quan đến chủ đề</li>
              <li>Khả năng sáng tạo</li>
              <li>Hồ sơ thuyết minh</li>
            </ul>
          </div>

          <div>
            <div className="text-lg font-semibold mb-2">
              1.5 Công bố kết quả Vòng Loại
            </div>
            <ul className="list-disc pl-5">
              <li>
                Các thí sinh đạt điều kiện vượt qua Vòng Loại theo tiêu chí chấm
                điểm sẽ được liên hệ trực tiếp bằng thư điện tử hoặc thông tin
                về trường học để thông báo tham dự Vòng Quốc gia.
              </li>
              <li>
                Kết quả sẽ được công bố chính thức tại website
                olympiad.tekmonk.edu.vn vào ngày 12/12/2024.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none p-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold">
            2. Vòng Quốc gia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 border-none">
          <div>
            <div className="text-lg font-semibold mb-2">
              2.1. Điều kiện dự thi
            </div>
            <p>
              Các thí sinh vượt qua Vòng Loại đủ tiêu chuẩn tham dự Vòng Quốc
              gia
            </p>
          </div>

          <div>
            <div className="text-lg font-semibold mb-2">
              2.2. Nội dung thi và phương thức thi
            </div>
            <div className="font-semibold mb-2">Bảng A, B, C:</div>
            <p className="mb-2">Thí sinh tham gia 2 phần:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Phần 1 – Lý thuyết Khoa học Máy tính, Internet</li>
              <li>Phần 2 – Lập trình bằng CodeCombat</li>
            </ul>
            <p className="mb-4">
              Thí sinh được phân chia vào phòng thi theo số báo danh, thí sinh
              tham gia thi tập trung trong thời gian thi 90 phút.
            </p>
            <div className="font-semibold mb-2">Bảng D:</div>
            <ul className="list-disc pl-5">
              <li>
                Thí sinh, đội thi tham dự triển lãm trưng bày sản phẩm công nghệ
                và trả lời câu hỏi phản biện cùng Ban Giám khảo
              </li>
              <li>
                Mỗi đội thi sẽ có tối đa 10 phút trả lời câu hỏi trước Ban Giám
                Khảo.
              </li>
              <li>
                Mỗi đội thi cần chuẩn bị slide thuyết trình hoặc poster để giới
                thiệu về dự án của đội tại khu trưng bày của vòng thi Quốc gia.
              </li>
              <li>
                Tất cả các đội thi có mặt tại địa điểm thi Quốc gia để tham dự
                Vòng thi. Đội thi vắng mặt xem như bỏ cuộc và sẽ không được nhận
                giải thưởng cùng các bổ trợ tương ứng dành cho đội thi tham dự
                Vòng Quốc gia.
              </li>
            </ul>
          </div>

          <div>
            <div className="text-lg font-semibold mb-2">
              2.3. Cách thức tính điểm
            </div>
            <div className="font-semibold mb-2">Bảng A, B, C:</div>
            <p className="mb-4">
              Tổng điểm của thí sinh được tính bằng tổng điểm phần thi lý thuyết
              và phần thi lập trình bằng CodeCombat.
            </p>
            <div className="font-semibold mb-2">Bảng D:</div>
            <p className="mb-2">
              Điểm chung cuộc Ban Tổ chức (BTC) sẽ cộng tổng số điểm Vòng Loại
              và số điểm đội thi đã nhận được từ Ban giám khảo (BGK) trong Vòng
              Quốc gia. Số điểm điểm từ BGK chiếm 60% và điểm Vòng Loại sẽ chiếm
              40% tổng số điểm của đội thi.
            </p>
            <p className="mb-2">Tiêu chí chấm điểm của BGK:</p>
            <ul className="list-disc pl-5">
              <li>Chức năng của dự án</li>
              <li>Mức độ liên quan đến chủ đề</li>
              <li>Sáng tạo và độc đáo</li>
              <li>Kỹ năng trình bày, phản biện</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
