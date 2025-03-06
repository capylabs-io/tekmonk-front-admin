import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email là bắt buộc" })
    .email("Email không hợp lệ")
    .min(1, "Email là bắt buộc"),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Mật khẩu là bắt buộc" })
      .min(5, "Mật khẩu tối thiểu 5 ký tự"),
    confirmPassword: z
      .string({ required_error: "Xác nhận mật khẩu là bắt buộc" })
      .min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });
