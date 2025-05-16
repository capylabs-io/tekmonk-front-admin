"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import Draggable from "react-draggable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Download, Upload, Move, ArrowLeft, Trash2, Plus } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { CommonButton } from "@/components/common/button/CommonButton";
import jsPDF from 'jspdf';
import FontPreloader from './FontPreloader';
import dynamic from 'next/dynamic';
import html2canvas from 'html2canvas';

// Import React-Quill với dynamic import để tránh lỗi SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Đang tải trình soạn thảo...</p>,
});

// Thêm CSS cho Quill
import 'react-quill/dist/quill.snow.css';

// Cấu hình module và format cho Quill
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']
  ],
};

const quillFormats = [
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'font', 'align'
];

// Define the certificate field type
export type CertificateField = {
  id: string
  label: string
  value: string       // Giữ nguyên kiểu dữ liệu, nhưng sẽ chứa HTML thay vì text thường
  htmlContent: string // Thêm trường này để lưu nội dung HTML
  position: { x: number; y: number }
  fontSize: number
  fontWeight: string
  color: string
  fontFamily: string
  textAlign: string
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Danh sách các font cho người dùng lựa chọn
const fontOptions = [
  { value: "Roboto", label: "Roboto" },
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Dancing Script", label: "Dancing Script" },
  { value: "Pacifico", label: "Pacifico" },
]

export interface CertificateEditorProps {
  initialFields?: CertificateField[]
  initialBackgroundImage?: string | null
  onFieldsChange?: (fields: CertificateField[]) => void
  onBackgroundChange?: (file: File | null, imageUrl: string | null) => void
  isPreviewCertificate?: boolean
  editorRef?: React.MutableRefObject<{ clearData: () => void } | null>
}

export default function CertificateEditor({
  initialFields,
  initialBackgroundImage,
  onFieldsChange,
  onBackgroundChange,
  isPreviewCertificate = false,
  editorRef
}: CertificateEditorProps) {
  // Certificate background image
  const [backgroundImage, setBackgroundImage] = useState<string | null>(initialBackgroundImage || null)
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)
  const [isOpenAddTextBlock, setIsOpenAddTextBlock] = useState(false)
  const [textBlockName, setTextBlockName] = useState("")
  // Certificate dimensions
  const certificateWidth = 900
  const certificateHeight = 600

  // Thêm ref để theo dõi thay đổi và tránh vòng lặp vô hạn
  const onFieldsChangeRef = useRef<string | null>(null);
  const onBackgroundChangeRef = useRef<string | null>(null);
  const initialFieldsRef = useRef<boolean>(false);
  const initialBackgroundRef = useRef<boolean>(false);

  // Certificate fields with default positions
  const [fields, setFields] = useState<CertificateField[]>([
    {
      id: "name",
      label: "Tên người nhận",
      value: "John Doe",
      htmlContent: "<p>John Doe</p>",
      position: { x: 400, y: 300 },
      fontSize: 24,
      fontWeight: "normal",
      color: "#333333",
      fontFamily: "Roboto",
      textAlign: "center",
    },
    {
      id: "course",
      label: "Tên khóa học",
      value: "Web Development Masterclass",
      htmlContent: "<p>Web Development Masterclass</p>",
      position: { x: 400, y: 200 },
      fontSize: 36,
      fontWeight: "bold",
      color: "#000000",
      fontFamily: "Roboto",
      textAlign: "center",
    },
    {
      id: "date",
      label: "Ngày cấp",
      value: new Date().toLocaleDateString(),
      htmlContent: new Date().toLocaleDateString(),
      position: { x: 400, y: 400 },
      fontSize: 18,
      fontWeight: "normal",
      color: "#555555",
      fontFamily: "Roboto",
      textAlign: "center",
    },
    {
      id: "signature",
      label: "Chữ ký",
      value: "Jane Smith",
      htmlContent: "<p>Jane Smith</p>",
      position: { x: 400, y: 500 },
      fontSize: 20,
      fontWeight: "normal",
      color: "#000000",
      fontFamily: "Dancing Script",
      textAlign: "center",
    },
  ])

  // Khi initialFields thay đổi từ bên ngoài, cập nhật fields
  useEffect(() => {
    if (initialFields && initialFields.length > 0 && !initialFieldsRef.current) {
      initialFieldsRef.current = true;
      setFields(initialFields);
    }
  }, [initialFields]);

  // Khi initialBackgroundImage thay đổi từ bên ngoài, cập nhật backgroundImage
  useEffect(() => {
    if (initialBackgroundImage && !initialBackgroundRef.current) {
      initialBackgroundRef.current = true;
      setBackgroundImage(initialBackgroundImage);
    }
  }, [initialBackgroundImage]);

  // Gọi callback khi fields thay đổi
  useEffect(() => {
    if (onFieldsChange) {
      // Đảm bảo tất cả các trường đều có giá trị cơ bản
      const validatedFields = fields.map(field => ({
        ...field,
        value: field.value || '',
        htmlContent: field.htmlContent || field.value || '',
        fontSize: field.fontSize || 18,
        fontWeight: field.fontWeight || 'normal',
        color: field.color || '#000000',
        fontFamily: field.fontFamily || 'Roboto',
        textAlign: field.textAlign || 'center'
      }));

      // Tránh gọi callback với cùng một dữ liệu
      const fieldsString = JSON.stringify(validatedFields);
      if (onFieldsChangeRef.current !== fieldsString) {
        onFieldsChangeRef.current = fieldsString;
        onFieldsChange(validatedFields);
      }
    }
  }, [fields, onFieldsChange]);

  // Gọi callback khi background thay đổi
  useEffect(() => {
    if (onBackgroundChange) {
      // Tạo key duy nhất cho cặp backgroundFile và backgroundImage
      const backgroundKey = `${backgroundFile?.name || ''}-${backgroundImage || ''}`;
      if (onBackgroundChangeRef.current !== backgroundKey) {
        onBackgroundChangeRef.current = backgroundKey;
        onBackgroundChange(backgroundFile, backgroundImage);
      }
    }
  }, [backgroundFile, backgroundImage, onBackgroundChange]);

  const certificateRef = useRef<HTMLDivElement>(null)
  const fieldRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [activeTab, setActiveTab] = useState("content")
  const [debugMode, setDebugMode] = useState(false)
  const [pdfPreviewMode, setPDFPreviewMode] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState(true);

  // Initialize refs for each field
  useEffect(() => {
    fields.forEach((field) => {
      if (!fieldRefs.current[field.id]) {
        fieldRefs.current[field.id] = React.createRef<HTMLDivElement>()
      }
    })
  }, [fields])

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (certificateRef.current) {
        setContainerSize({
          width: certificateRef.current.offsetWidth,
          height: certificateRef.current.offsetHeight,
        })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Handle field value changes
  const handleFieldChange = (id: string, value: string, htmlContent: string) => {
    setFields(fields.map((field) =>
      field.id === id
        ? {
          ...field,
          value: value, // Giá trị text thuần túy
          htmlContent: htmlContent || value // Đảm bảo luôn có HTML content
        }
        : field
    ))
  }

  // Handle field style changes
  const handleStyleChange = (id: string, property: keyof CertificateField, value: any) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, [property]: value } : field)))
  }

  // Handle position change via input fields
  const handlePositionChange = (id: string, axis: "x" | "y", value: number) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
            ...field,
            position: {
              ...field.position,
              [axis]: value,
            },
          }
          : field,
      ),
    )
  }

  // Handle drag stop to update position
  const handleDragStop = (id: string, e: any, data: { x: number; y: number }) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
            ...field,
            position: {
              x: data.x,
              y: data.y,
            },
          }
          : field,
      ),
    )
  }

  // Handle background image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Kiểm tra định dạng file
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng tải lên file hình ảnh (JPEG, PNG, etc.)")
      return
    }

    // Tối ưu hóa ảnh trước khi hiển thị
    optimizeImage(file).then(optimizedImageUrl => {
      setBackgroundImage(optimizedImageUrl)
      setBackgroundFile(file)
    }).catch(error => {
      console.error("Lỗi khi xử lý ảnh:", error)
      // Fallback to original file if optimization fails
      const imageUrl = URL.createObjectURL(file)
      setBackgroundImage(imageUrl)
      setBackgroundFile(file)
    })
  }

  // Hàm tối ưu hóa ảnh
  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')

        // Luôn tạo canvas với kích thước 900x600
        canvas.width = certificateWidth;
        canvas.height = certificateHeight;

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Không thể tạo canvas context'))
          return
        }

        // Hiệu ứng làm mịn 
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Tính toán tỷ lệ để vẽ ảnh đầy đủ vào khung 900x600
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);

        // Tính toán vị trí để căn giữa ảnh trong canvas
        const centerX = (canvas.width - img.width * ratio) / 2;
        const centerY = (canvas.height - img.height * ratio) / 2;

        // Vẽ ảnh vào canvas với kích thước đủ để lấp đầy canvas
        ctx.drawImage(img, 0, 0, img.width, img.height,
          0, 0, certificateWidth, certificateHeight);

        // Chuyển canvas thành URL
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob))
            } else {
              reject(new Error('Không thể tạo blob từ canvas'))
            }
          },
          'image/png',
          0.95 // Chất lượng cao
        )
      }

      img.onerror = () => reject(new Error('Không thể tải ảnh'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }
  // Helper function để load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (backgroundImage) {
        URL.revokeObjectURL(backgroundImage)
      }
    }
  }, [backgroundImage])

  // Add new field with better positioning
  const addNewField = (name: string) => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên cho khối văn bản");
      return;
    }

    const newId = `field-${Date.now()}`;

    // Tính vị trí mới để tránh chồng chéo với các khối hiện có
    // Tìm vị trí Y thấp nhất hiện tại và đặt khối mới ở dưới cùng
    let newY = 100;
    let newX = 100;

    if (fields.length > 0) {
      // Tìm vị trí Y lớn nhất hiện tại
      const maxY = Math.max(...fields.map(field => field.position.y));
      // Đặt vị trí mới thấp hơn khoảng 50px
      newY = maxY + 50;

      // Nếu vị trí mới nằm ngoài khung, đặt lại ở trên cùng nhưng lùi vào bên phải
      if (newY > containerSize.height - 100) {
        newY = 100;
        // Tìm vị trí X lớn nhất của các field có Y gần 100
        const topFields = fields.filter(f => Math.abs(f.position.y - 100) < 50);
        if (topFields.length > 0) {
          const maxX = Math.max(...topFields.map(f => f.position.x));
          newX = maxX + 150;
        }
      }
    }

    // Đảm bảo vị trí nằm trong khung
    newX = Math.min(newX, containerSize.width - 200);
    newY = Math.min(newY, containerSize.height - 100);

    setFields([
      ...fields,
      {
        id: newId,
        label: name,
        value: "văn bản mới",
        htmlContent: "<p>văn bản mới</p>",
        position: { x: newX, y: newY },
        fontSize: 18,
        fontWeight: "normal",
        color: "#000000",
        fontFamily: "Roboto",
        textAlign: "center",
      },
    ]);

    setIsOpenAddTextBlock(false);
    setActiveTab("content");
    setTextBlockName("");
  }

  // Delete field
  const deleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
    delete fieldRefs.current[id]
  }

  // Thêm hàm này vào file
  const blobToDataURL = (blob: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Thêm hàm tính offset để mô phỏng kết quả PDF
  const calculatePDFOffset = (field: CertificateField) => {
    // Tính toán độ lệch để mô phỏng kết quả trong PDF
    let offsetX = 0;
    const textWidth = field.value.length * field.fontSize * 0.55;

    if (field.textAlign === "center") {
      offsetX = -textWidth / 2;
    } else if (field.textAlign === "right") {
      offsetX = -textWidth;
    }

    const offsetY = -field.fontSize * 0.3;

    return `translate(${offsetX}px, ${offsetY}px)`;
  };

  // Thêm hàm centerAllTextItems để căn giữa tất cả các item theo khung chứng chỉ
  const centerAllTextItems = () => {
    if (!certificateRef.current) return;

    const rect = certificateRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;

    const updatedFields = fields.map(field => ({
      ...field,
      position: {
        x: centerX,
        y: field.position.y
      },
      textAlign: "center" as "center"
    }));

    setFields(updatedFields);
    alert("Đã căn giữa tất cả các khối văn bản theo khung chứng chỉ");
  };

  // Thêm vào trước khi tạo PDF
  const imgToBase64 = async (url: string) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      img.src = url;
      await loadPromise;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error("Không thể chuyển đổi ảnh:", e);
      return url;
    }
  };

  const exportPDFUsingCanvas = async () => {
    if (!backgroundImage) {
      alert("Vui lòng tải lên hình nền trước");
      return;
    }

    try {
      setIsGeneratingPDF(true);

      const certificate = certificateRef.current;
      if (!certificate) {
        throw new Error("Không tìm thấy chứng chỉ");
      }

      // Tạo PDF với kích thước đúng
      const pdf = new jsPDF({
        orientation: certificateWidth > certificateHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [certificateWidth, certificateHeight]
      });

      // Xử lý hình nền từ S3
      if (backgroundImage) {
        try {
          // Nếu là link S3, sử dụng fetch để tải về dưới dạng blob
          const isS3Link = backgroundImage.includes('amazonaws.com') || backgroundImage.startsWith('https://s3.');

          if (isS3Link) {
            // Tải hình ảnh thông qua fetch để tránh vấn đề CORS
            const response = await fetch(backgroundImage, {
              mode: 'cors',
              credentials: 'same-origin'
            });

            if (!response.ok) {
              throw new Error(`Không thể tải hình ảnh từ S3: ${response.statusText}`);
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            // Tạo đối tượng hình ảnh từ blob
            const backgroundImg = new Image();
            await new Promise((resolve, reject) => {
              backgroundImg.onload = resolve;
              backgroundImg.onerror = reject;
              backgroundImg.src = imageUrl;
            });

            // Thêm hình nền vào PDF
            pdf.addImage(
              backgroundImg,
              'PNG',
              0,
              0,
              certificateWidth,
              certificateHeight
            );

            // Giải phóng URL của đối tượng
            URL.revokeObjectURL(imageUrl);
          } else {
            // Xử lý như trước đối với hình ảnh không phải từ S3
            const backgroundImg = new Image();
            backgroundImg.crossOrigin = "anonymous";

            await new Promise((resolve, reject) => {
              backgroundImg.onload = resolve;
              backgroundImg.onerror = reject;
              backgroundImg.src = backgroundImage;
            });

            pdf.addImage(
              backgroundImg,
              'PNG',
              0,
              0,
              certificateWidth,
              certificateHeight
            );
          }
        } catch (imageError) {
          console.error('Lỗi khi xử lý hình nền:', imageError);
          alert('Không thể tải hình nền. Vui lòng thử lại sau.');
          setIsGeneratingPDF(false);
          return;
        }
      }

      // PHƯƠNG PHÁP 2: Tạo một bản sao của certificate chỉ chứa các phần tử văn bản
      const textClone = document.createElement('div');
      textClone.style.position = 'absolute';
      textClone.style.left = '-9999px';
      textClone.style.width = `${certificateWidth}px`;
      textClone.style.height = `${certificateHeight}px`;
      textClone.style.backgroundColor = 'transparent';

      // Thêm các phần tử văn bản vào bản sao
      fields.forEach(field => {
        const textDiv = document.createElement('div');
        textDiv.style.position = 'absolute';
        textDiv.style.left = `${field.position.x}px`;
        textDiv.style.top = `${field.position.y}px`;
        textDiv.style.fontSize = `${field.fontSize}px`;
        textDiv.style.fontWeight = field.fontWeight;
        textDiv.style.color = field.color;
        textDiv.style.fontFamily = field.fontFamily;
        textDiv.style.textAlign = field.textAlign;
        textDiv.innerHTML = field.htmlContent;
        textClone.appendChild(textDiv);
      });

      document.body.appendChild(textClone);

      // Tạo canvas từ các phần tử văn bản
      const textCanvas = await html2canvas(textClone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      // Xóa phần tử tạm khỏi DOM
      document.body.removeChild(textClone);

      // Thêm canvas văn bản vào PDF
      pdf.addImage(
        textCanvas.toDataURL('image/png', 1.0),
        'PNG',
        0,
        0,
        certificateWidth,
        certificateHeight
      );

      // Lưu PDF
      pdf.save('certificate.pdf');

    } catch (error) {
      console.error('Lỗi khi tạo PDF:', error);
      alert('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const clearEditorData = () => {
    setFields([]);
    setBackgroundImage(null);
    setBackgroundFile(null);
    setTextBlockName("");
  };

  useEffect(() => {
    if (editorRef) {
      editorRef.current = {
        clearData: clearEditorData
      };
    }
  }, []);

  return (
    <>
      <FontPreloader />
      {isPreviewCertificate ? (
        // Chế độ xem trước
        <div className="bg-white rounded-lg h-full border border-gray-200">
          <div className="flex gap-2 w-full justify-end p-2">
            <Button
              variant="outline"
              onClick={exportPDFUsingCanvas}
              disabled={isGeneratingPDF || !backgroundImage}
              className="bg-primary-60 text-white hover:bg-primary-60/80">
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? "Đang xử lý..." : "Tải xuống PDF"}
            </Button>
          </div>
          <div
            ref={certificateRef}
            data-certificate
            className="relative bg-white border border-gray-200 rounded-lg my-4 shadow-lg mx-auto"
            style={{
              width: "900px",
              height: "600px",
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: backgroundImage ? "transparent" : "#f9f9f9",
            }}
          >
            {!backgroundImage && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <p>Không có ảnh nền</p>
              </div>
            )}
            {fields.map((field) => (
              <div
                key={field.id}
                data-id={field.id}
                className="absolute border-transparent rounded px-2 py-1"
                style={{
                  fontSize: `${field.fontSize}px`,
                  fontWeight: field.fontWeight,
                  color: field.color,
                  fontFamily: field.fontFamily,
                  textAlign: field.textAlign as any,
                  width: "auto",
                  left: `${field.position.x}px`,
                  top: `${field.position.y}px`,
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: field.htmlContent }} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Chế độ chỉnh sửa đầy đủ - giữ nguyên UI hiện tại
        <div className="flex max-2xl:flex-col items-start gap-6 h-full overflow-y-auto !bg-white">
          {/* Certificate Preview */}
          <div className="w-full">
            <div className="!bg-white p-4 rounded-lg h-full">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Xem trước chứng chỉ</h2>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={() => setIsOpenAddTextBlock(true)} variant="outline" size="sm">
                    <div className="flex items-center !text-xs gap-2">
                      <Plus className="w-3 h-3" />
                      Thêm khối văn bản
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportPDFUsingCanvas}
                    disabled={isGeneratingPDF}

                    className="bg-blue-600 text-white hover:bg-blue-700 !text-x">
                    <Download className="w-3 h-3 mr-2" />
                    {isGeneratingPDF ? "Đang xử lý..." : "Xuất PDF"}
                  </Button>
                  <Button onClick={centerAllTextItems} variant="outline" size="sm" className="!text-xs">
                    Căn giữa tất cả
                  </Button>
                </div>
              </div>
              <div
                ref={certificateRef}
                data-certificate
                className="relative bg-white border border-gray-200 rounded-lg my-4 shadow-lg mx-auto"
                style={{
                  width: "900px",
                  height: "600px",
                  backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: backgroundImage ? "transparent" : "#f9f9f9",
                }}
              >
                {!backgroundImage && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <p>Vui lòng tải lên hình nền</p>
                  </div>
                )}
                {fields.map((field) => (
                  <Draggable
                    key={field.id}
                    position={field.position}
                    bounds="parent"
                    onStop={(e, data) => handleDragStop(field.id, e, data)}
                    nodeRef={fieldRefs.current[field.id]}
                  >
                    <div
                      ref={fieldRefs.current[field.id]}
                      data-id={field.id}
                      className="absolute cursor-move draggable-field border-2 border-transparent hover:border-blue-400 rounded px-2 py-1 touch-none"
                      style={{
                        fontSize: `${field.fontSize}px`,
                        fontWeight: field.fontWeight,
                        color: field.color,
                        fontFamily: field.fontFamily,
                        width: pdfPreviewMode ? `${field.value.length * field.fontSize * 0.7}px` : "auto",
                        transform: pdfPreviewMode ? calculatePDFOffset(field) : "none",
                      }}
                    >
                      {previewHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: field.htmlContent }} />
                      ) : (
                        field.value
                      )}
                      {debugMode && (
                        <div className="absolute top-full left-0 bg-black text-white text-xs p-1 opacity-70 pointer-events-none" data-debug>
                          x: {Math.round(field.position.x)}, y: {Math.round(field.position.y)}
                        </div>
                      )}
                    </div>
                  </Draggable>
                ))}
              </div>
            </div>
          </div>

          {/* Editor Controls */}
          <div className="w-full py-4 max-2xl:px-4 2xl:h-[768px]">
            <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="2xl:h-[calc(100%-16px)]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Nội dung</TabsTrigger>
                <TabsTrigger value="background">Hình nền</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 2xl:h-[calc(100%-40px)] overflow-y-auto">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {fields.map((field) => (
                        <div key={field.id} className="space-y-4 pb-4 border-b border-gray-100">
                          <div className="flex justify-between items-center">
                            <Label htmlFor={field.id} className="text-base font-medium">
                              {field.label}
                            </Label>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-muted-foreground"
                                onClick={() => setActiveTab("position-" + field.id)}
                              >
                                <Move className="h-4 w-4 mr-1" />
                                Vị trí
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-red-500 hover:text-red-600"
                                onClick={() => deleteField(field.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="editor-container border rounded-md overflow-hidden">
                              <ReactQuill
                                value={field.htmlContent}
                                onChange={(content, delta, source, editor) => {
                                  if (source === 'user') {
                                    // Lấy plain text từ editor
                                    const plainText = editor.getText().trim();
                                    handleFieldChange(field.id, plainText, content);
                                  }
                                }}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder={`Nhập ${field.label.toLowerCase()}`}
                                theme="snow"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div>
                              <Label htmlFor={`${field.id}-size`} className="text-xs">
                                Kích thước chữ
                              </Label>
                              <Input
                                id={`${field.id}-size`}
                                type="number"
                                value={field.fontSize}
                                onChange={(e) => handleStyleChange(field.id, "fontSize", Number.parseInt(e.target.value))}
                                min={8}
                                max={72}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${field.id}-weight`} className="text-xs">
                                Độ dày chữ
                              </Label>
                              <select
                                id={`${field.id}-weight`}
                                value={field.fontWeight}
                                onChange={(e) => handleStyleChange(field.id, "fontWeight", e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor={`${field.id}-color`} className="text-xs">
                                Màu sắc
                              </Label>
                              <Input
                                id={`${field.id}-color`}
                                type="color"
                                value={field.color}
                                onChange={(e) => handleStyleChange(field.id, "color", e.target.value)}
                                className="h-10 p-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${field.id}-font`} className="text-xs">
                                Kiểu chữ
                              </Label>
                              <select
                                id={`${field.id}-font`}
                                value={field.fontFamily}
                                onChange={(e) => handleStyleChange(field.id, "fontFamily", e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                style={{ fontFamily: field.fontFamily }}
                              >
                                {fontOptions.map(font => (
                                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                    {font.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label htmlFor={`${field.id}-align`} className="text-xs">
                                Căn chỉnh
                              </Label>
                              <select
                                id={`${field.id}-align`}
                                value={field.textAlign}
                                onChange={(e) => handleStyleChange(field.id, "textAlign", e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="left">Trái</option>
                                <option value="center">Giữa</option>
                                <option value="right">Phải</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="background" className="h-max">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="background-file">Hình nền</Label>
                      <input
                        ref={fileInputRef}
                        id="background-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="grid gap-2">
                        <Button onClick={handleUploadClick} variant="outline" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Tải lên hình nền
                        </Button>
                        {backgroundImage && (
                          <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                            <div
                              className="h-full w-full bg-contain bg-center bg-no-repeat"
                              style={{ backgroundImage: `url(${backgroundImage})` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Để đạt kết quả tốt nhất, hãy sử dụng hình ảnh có kích thước chính xác 900×600 pixels hoặc tỷ lệ 3:2.</p>
                      <p className="mt-2">Hình ảnh sẽ được tự động điều chỉnh để vừa với khung chứng chỉ, đảm bảo PDF xuất ra giống hệt với thiết kế.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Dynamic position tabs for each field */}
              {fields.map((field) => (
                <TabsContent key={`position-${field.id}`} value={`position-${field.id}`}>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Vị trí: {field.label}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("content")} className="inline-flex items-center gap-2">
                          <ArrowLeft size={14} />
                          Quay lại
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {/* X Position */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={`${field.id}-x-position`}>Trục ngang</Label>
                            <span className="text-sm text-muted-foreground">{Math.round(field.position.x)}px</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Slider
                              id={`${field.id}-x-position`}
                              min={0}
                              max={containerSize.width || 900}
                              step={1}
                              value={[field.position.x]}
                              onValueChange={(value) => handlePositionChange(field.id, "x", value[0])}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={Math.round(field.position.x)}
                              onChange={(e) => handlePositionChange(field.id, "x", Number.parseInt(e.target.value) || 0)}
                              className="w-20"
                              min={0}
                              max={containerSize.width || 900}
                            />
                          </div>
                        </div>

                        {/* Y Position */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={`${field.id}-y-position`}>Trục dọc</Label>
                            <span className="text-sm text-muted-foreground">{Math.round(field.position.y)}px</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Slider
                              id={`${field.id}-y-position`}
                              min={0}
                              max={containerSize.height || 600}
                              step={1}
                              value={[field.position.y]}
                              onValueChange={(value) => handlePositionChange(field.id, "y", value[0])}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              value={Math.round(field.position.y)}
                              onChange={(e) => handlePositionChange(field.id, "y", Number.parseInt(e.target.value) || 0)}
                              className="w-20"
                              min={0}
                              max={containerSize.height || 600}
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            Tip: Bạn cũng có thể kéo văn bản trực tiếp trên chứng chỉ để đặt vị trí.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      )}
      <Dialog open={isOpenAddTextBlock} onOpenChange={setIsOpenAddTextBlock}>
        <DialogContent className="bg-white h-max w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Thêm khối văn bản</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Input
              value={textBlockName}
              onChange={(e) => setTextBlockName(e.target.value)}
              id="text-block-name"
              placeholder="Tên khối văn bản"
            />
          </DialogDescription>
          <DialogFooter>
            <CommonButton
              variant="secondary"
              onClick={() => setIsOpenAddTextBlock(false)}
            >
              Hủy
            </CommonButton>
            <CommonButton onClick={() => addNewField(textBlockName)}>Xác nhận</CommonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setPdfPreviewUrl(null)}>
          <div className="bg-white p-4 rounded-lg w-[90%] h-[90%]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <h3>Xem trước PDF</h3>
              <Button variant="ghost" size="sm" onClick={() => setPdfPreviewUrl(null)}>Đóng</Button>
            </div>
            <iframe src={pdfPreviewUrl} className="w-full h-[calc(100%-40px)]" />
          </div>
        </div>
      )}
    </>
  )
}