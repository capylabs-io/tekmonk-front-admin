"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  texts: string[]; // Nhận đầu vào là mảng
  duration?: number;
  className?: string;
}

export default function TypingAnimation({
  texts,
  duration = 100,
  className,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string[]>([]); // Lưu trữ các dòng đã được gõ
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    if (currentLine < texts.length) {
      const typingEffect = setInterval(() => {
        if (i < texts[currentLine].length) {
          // Gõ từng ký tự của dòng hiện tại
          setDisplayedText((prev) => {
            const newText = [...prev];
            newText[currentLine] = texts[currentLine].substring(0, i + 1);
            return newText;
          });
          setI(i + 1);
        } else {
          clearInterval(typingEffect);
          // Đợi một chút trước khi chuyển sang dòng tiếp theo
          const nextLineTimeout = setTimeout(() => {
            setCurrentLine((prev) => prev + 1); // Chuyển sang dòng tiếp theo
            setI(0); // Reset chỉ số để bắt đầu dòng mới
          }, 500); // Thay đổi thời gian chờ theo ý muốn

          return () => clearTimeout(nextLineTimeout);
        }
      }, duration);

      return () => {
        clearInterval(typingEffect);
      };
    }
  }, [duration, i, currentLine, texts]);

  return (
    <div className={cn("text-center")}>
      {displayedText.map((text, index) => (
        <h1
          key={index}
          className={cn(
            "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
            className
          )}
        >
          {text}
        </h1>
      ))}
    </div>
  );
}
