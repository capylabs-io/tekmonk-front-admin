import { Course, User } from "./common-types";

export type Certificate = {
  id?: number;
  name?: string;
  description?: string;
  type?: string;
  issuer_type?: string;
  certificate_form?: string;
  course?: Course;
  isHasValidation?: boolean;
  certificateFields?: string;
  metadata?: any;
  isCommentNeeded?: boolean;
  certificatePdfConfig?: CertificatePdfConfig;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
};

export type CertificateHistory = {
  id?: number;
  certificate: Certificate;
  student: User;
  isVerified: boolean;
};

export type CertificatePdfFieldConfig = {
  id?: number;
  label?: string;
  value?: string;
  fontSize?: string;
  color?: string;
  fontFamily?: string;
  textAlign?: string;
  fontWeight?: string;
  positionX?: number;
  positionY?: number;
  config?: CertificatePdfConfig;
};

export type CertificatePdfConfig = {
  id?: number;
  name?: string;
  backgroundUrl?: string;
  fields?: CertificatePdfFieldConfig[];
  certificates?: Certificate[];
};
