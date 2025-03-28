import { Course, User } from "./common-types"

export type Certificate = {
  id?: number
  name?: string
  description?: string
  imgUrl?: string
  type?: string,
  issuer_type?: string,
  certificate_form?: string
  course?: Course
  isHasValidation?: boolean
}
export type CertificateHistory = {
  id?: number
  certificate: Certificate,
  student: User,
  isVerified: boolean
}