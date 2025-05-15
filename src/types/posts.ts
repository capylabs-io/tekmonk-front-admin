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
  tagged_users?: User[]
  type?: PostTypeEnum
};

export enum PostVerificationType {
  PENDING = "pending",
  DENIED = "denied",
  ACCEPTED = "accepted",
}

export enum PostTypeEnum {
  PROJECT = "project",
  POST = "normal",
}
