export type PostType = {
  content: string | null;
  description?: string | null;
  name?: string | null;
  url?: string | null;
  media?: string | null;
  postedBy: string | number | null;
  type: string | null;
  metadata?: string | null;
  isVerified?: PostVerificationType | null;
};

export enum PostVerificationType {
  PENDING = "pending",
  DENIED = "denied",
  ACCEPTED = "accepted",
}
