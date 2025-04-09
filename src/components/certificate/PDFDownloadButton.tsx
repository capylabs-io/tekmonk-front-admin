import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CertificatePDF } from './CertificatePDF';
import type { CertificateField } from './CustomCertificateEditor';

interface PDFDownloadButtonProps {
  fields: CertificateField[];
  backgroundFile: File;
  width: number;
  height: number;
  loading: boolean;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  fields,
  backgroundFile,
  width,
  height,
  loading
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Lấy kích thước thực tế của container để điều chỉnh tỷ lệ
  useEffect(() => {
    const certificateElement = document.querySelector('[data-certificate]');
    if (certificateElement) {
      const rect = certificateElement.getBoundingClientRect();
      setContainerSize({
        width: rect.width,
        height: rect.height
      });
    }
  }, []);

  // Chuyển đổi file thành data URL
  const convertFileToDataURL = useCallback(async () => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setDataUrl(reader.result as string);
      };
      reader.readAsDataURL(backgroundFile);
    } catch (error) {
      console.error("Lỗi khi chuyển đổi file:", error);
    }
  }, [backgroundFile]);

  useEffect(() => {
    convertFileToDataURL();
  }, [convertFileToDataURL]);

  // Điều chỉnh vị trí field để đảm bảo tỷ lệ giữa editor và PDF
  const adjustFieldPositions = (fields: CertificateField[]) => {
    if (containerSize.width === 0) return fields;

    // Tính tỷ lệ chính xác giữa kích thước PDF và editor
    const scaleX = width / containerSize.width;
    const scaleY = height / containerSize.height;

    return fields.map(field => {
      // Điều chỉnh vị trí dựa trên tỷ lệ, không điều chỉnh theo textAlign
      const adjustedX = field.position.x * scaleX;
      const adjustedY = field.position.y * scaleY;

      // Log để debug
      console.log(`Field: ${field.id}, Original: (${field.position.x}, ${field.position.y}), Adjusted: (${adjustedX}, ${adjustedY})`);

      return {
        ...field,
        position: {
          x: adjustedX,
          y: adjustedY
        }
      };
    });
  };

  if (!dataUrl) {
    return (
      <Button variant="outline" disabled>
        <Download className="w-4 h-4 mr-2" />
        Đang chuẩn bị...
      </Button>
    );
  }

  // Sử dụng fields đã được điều chỉnh tọa độ
  const adjustedFields = adjustFieldPositions(fields);

  return (
    <PDFDownloadLink
      document={
        <CertificatePDF
          fields={adjustedFields}
          backgroundImage={dataUrl}
          width={width}
          height={height}
        />
      }
      fileName="certificate.pdf"
      style={{ textDecoration: 'none' }}
    >
      {({ loading: pdfLoading, error }) => (
        <Button
          variant="outline"
          disabled={loading || pdfLoading}
          data-pdf-download
        >
          <Download className="w-4 h-4 mr-2" />
          {loading || pdfLoading ? "Đang chuẩn bị..." : "Xuất PDF (Phương pháp 2)"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton; 