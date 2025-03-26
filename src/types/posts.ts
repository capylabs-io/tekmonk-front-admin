import { User } from "./common-types";

export type PostType = {
  id?: number
  content?: string;
  name?: string;
  url?: string;
  thumbnail?: string | null;
  postedBy?: User | null;
  tags: string;
  metadata?: any;
  likeCount?: number
  commentCount?: number
  isVerified?: PostVerificationType;
  isLiked?: boolean
  createdAt?: string
};

export enum PostVerificationType {
  PENDING = "pending",
  DENIED = "denied",
  ACCEPTED = "accepted",
}
