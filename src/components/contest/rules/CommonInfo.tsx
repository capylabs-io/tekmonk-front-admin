'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const CommonInfo = () => {
  return (
    <Card className="border-none">
      <CardHeader className="p-0">
        <div className="text-2xl font-bold mb-4">Thông tin chung</div>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div>
          <h3 className="text-lg font-semibold">1. Đối tượng dự thi</h3>
          <p>Học sinh từ lớp 3 tiểu học đến lớp 12 trung học phổ thông.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">2. Điều kiện dự thi</h3>
          <p>Dành cho cho tất cả thí sinh yêu thích tin học và lập trình.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            3. Cơ cấu giải thưởng Vòng Quốc gia
          </h3>
          <p>
            Mỗi bảng đấu ở Vòng Quốc gia sẽ trao các giải bao gồm huy chương,
            giấy chứng nhận và giải thưởng có giá trị (bằng tiền mặt hoặc hiện
            vật). Ngoài ra, top 20 thí sinh Vòng Quốc gia có cơ hội tham gia đội
            tuyển thi đấu hạng mục lập trình của cuộc thi Olympic STEM Quốc tế
            (International STEM Olympiad).
          </p>
          <p className="mt-2">
            Chi tiết cơ cấu giải thưởng tương ứng với mỗi bảng thi đấu như sau:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>02 Giải Vàng</li>
            <li>02 Giải Bạc</li>
            <li>02 Giải Đồng</li>
            <li>10 Giải Khuyến khích</li>
            <li>12 Giải Tiềm năng</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
