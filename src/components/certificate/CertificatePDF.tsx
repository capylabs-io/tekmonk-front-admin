import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import type { CertificateField } from './CustomCertificateEditor';
import { Button } from '@/components/ui/button';

// Đăng ký font chất lượng cao hơn
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

// Thêm các font khác
Font.register({
  family: 'Arial',
  src: 'https://db.onlinewebfonts.com/t/1dc8ecd8056a5ea7aa7de1db42b5b639.ttf',
});

Font.register({
  family: 'Times New Roman',
  src: 'https://db.onlinewebfonts.com/t/32441a734e8b4e29801e3885d46b5e3c.ttf',
});

Font.register({
  family: 'Georgia',
  src: 'https://db.onlinewebfonts.com/t/3fa7604a5ac0d2e0d8b8daeee1adbfae.ttf',
});

Font.register({
  family: 'Dancing Script',
  src: 'https://db.onlinewebfonts.com/t/97c4b25dc74aa4a7d310a397e8bdfc6ad.ttf',
});

Font.register({
  family: 'Pacifico',
  src: 'https://db.onlinewebfonts.com/t/e84ac3e4c955bd44beea75faca52bce0.ttf',
});

// Tạo stylesheet cho PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  text: {
    fontFamily: 'Roboto',
    position: 'absolute',
    textAlign: 'center',
  }
});

// Tạo component PDF
interface CertificatePDFProps {
  fields: CertificateField[];
  backgroundImage: string | null;
  width: number;
  height: number;
}

const CertificatePDF: React.FC<CertificatePDFProps> = ({ fields, backgroundImage, width, height }) => {
  // Cập nhật hàm tính toán vị trí
  const calculatePosition = (field: CertificateField) => {
    // Tính toán vị trí chính xác hơn dựa trên vị trí thực tế trong editor
    // Không cần điều chỉnh theo textAlign vì PDF sẽ tự xử lý dựa trên style
    return {
      // Giữ nguyên vị trí X
      x: field.position.x,
      // Giữ nguyên vị trí Y
      y: field.position.y
    };
  };

  // Xử lý ảnh nền
  let processedBackgroundImage = backgroundImage;

  return (
    <Document
      title="Chứng chỉ"
      author="Certificate Generator"
      producer="react-pdf"
      creator="Certificate Creator App"
    >
      <Page size={[width, height]} style={styles.page}>
        {processedBackgroundImage && (
          <Image
            src={processedBackgroundImage}
            style={styles.background}
            cache={false}
          />
        )}
        {/* Thêm các đường căn chỉnh để dễ debug */}
        {/* Đường dọc ở giữa */}
        <View style={{
          position: 'absolute',
          left: width / 2,
          top: 0,
          width: 1,
          height: height,
          backgroundColor: 'rgba(255,0,0,0.1)'
        }} />
        {/* Đường ngang ở giữa */}
        <View style={{
          position: 'absolute',
          left: 0,
          top: height / 2,
          width: width,
          height: 1,
          backgroundColor: 'rgba(255,0,0,0.1)'
        }} />

        {/* Thêm các text item */}
        {fields.map((field) => {
          const position = calculatePosition(field);

          // Xử lý font family
          let fontFamily = 'Roboto';
          try {
            const validFonts = ['Roboto', 'Arial', 'Times New Roman',
              'Georgia', 'Dancing Script', 'Pacifico',
              'Courier New', 'Verdana', 'Open Sans', 'Lato'];

            if (validFonts.includes(field.fontFamily)) {
              fontFamily = field.fontFamily;
            }
          } catch (error) {
            console.error('Font error:', error);
          }

          return (
            <Text
              key={field.id}
              style={{
                ...styles.text,
                position: 'absolute',
                left: position.x,
                top: position.y,
                fontSize: field.fontSize,
                fontWeight: field.fontWeight,
                color: field.color,
                fontFamily: fontFamily,
                // Áp dụng width cố định dựa trên fontSize để đảm bảo căn chỉnh đúng
                // Áp dụng textAlign từ field trực tiếp
                textAlign: field.textAlign as any,
              }}
            >
              {field.value}
            </Text>
          );
        })}
      </Page>
    </Document>
  );
};

// Export component để sử dụng PDFDownloadLink
interface CertificateDownloadProps extends CertificatePDFProps {
  filename?: string;
  loading: boolean;
  children: React.ReactNode;
}

const CertificateDownload: React.FC<CertificateDownloadProps> = ({
  fields,
  backgroundImage,
  width,
  height,
  filename = 'certificate.pdf',
  loading,
  children,
}) => (
  <div className="flex justify-end gap-2">
    <PDFDownloadLink
      document={
        <CertificatePDF
          fields={fields}
          backgroundImage={backgroundImage}
          width={width}
          height={height}
        />
      }
      fileName={filename}
      style={{ textDecoration: 'none' }}
    >
      {({ loading: pdfLoading, error }) => (
        loading || pdfLoading ? (
          <Button variant="outline" disabled>
            <span className="animate-pulse">Đang chuẩn bị PDF...</span>
          </Button>
        ) : (
          children
        )
      )}
    </PDFDownloadLink>
  </div>
);

export { CertificatePDF, CertificateDownload }; 