export type Event = {
  title: string;
  day: string;
  month: string;
  weekday: string;
  timeRange: string;
  imageUrl: string;
  createdAt: string;
};

type UserRole = {
  name?: string;
  code?: string;
  description?: string;
};

type UserProfile = {
  user?: User;
  schoolName?: string;
  className?: string;
  data?: any;
  schoolLevel?: string;
  schoolAddress?: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  provider: string;
  password?: string;
  resetPasswordToken: string | null;
  confirmationToken: string | null;
  confirmed: boolean;
  blocked: boolean;
  metadata: any | null;
  skills: any | null;
  currentTitle: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  parentName: string | null;
  parentPhoneNumber: string | null;
  fullName: string | null;
  studentAddress: string | null;
  className: string | null;
  parentEmail: string | null;
  resetPasswordExpires: string | null;
  createdAt: string;
  updatedAt: string;
  data: any | null;
  user_role?: UserRole;
};

export type TListCourse = {
  courseId: string;
  courseInstanceId: string;
  name: string;
  slugs: string[];
};

export type ContestGroupStage = {
  id?: string;
  name?: string;
  description?: string;
  code?: string;
  studentLevel?: string;
  contestFormat?: string;
  startTime: string;
  endTime: string;
  contestEntryFile?: any;
  listCourses?: TListCourse[];
};

export interface Certificate {
  name: string;
  type: string;
  progress: string;
  mission: string;
  imageUrl?: string;
  author: string;
  createdAt: string;
}
export type Project = {
  name: string;
  author: User;
  thumbnailUrl: string;
  imageUrls: string[];
  createdAt: string;
  projectCategories: string[];
  description: string;
  likeCount: string;
  commentCount: string;
};

export type LeaderboardData = {
  user: User;
  score: string;
};

// declare type for type, not interface
export type Recruitment = {
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
};

export type EventDetail = {
  title: string;
  eventTime: string;
  eventVenue: string;
  address: string;
  month: string;
  day: string;
  weekday: string;
  content: string;
};

export type Achievement = {
  name: string;
  imageUrl: string;
};

export type Notification = {
  title: string;
  createdAt: string;
};

export type AvatarShop = {
  id: string;
  image: string;
  title: string;
  price: string;
};

export type BackgroundShop = {
  image: string;
  title: string;
  price: string;
};

export type Media = {
  id: number;
  name: string;
  ext: string;
  url: string;
  createAt: string;
  size: number;
};

export type UploadData = {
  ref: string;
  refId: string;
  field: string;
  files: File;
};

export type Contest = {
  id: string;
  name: string;
  description?: string;
  content?: string;
  thumbnail?: Media;
  socialMediaShare?: any;
  endTime: string;
  startTime: string;
  data?: any;
  metadata?: any;
  category?: any;
  groupStage?: ContestGroupStage;
};

export type ContestEntry = {
  id: string;
  candidateNumber: string;
  groupMemberInfo: object | null;
  user: User;
  isContestStarted?: boolean;
  startTime?: string;
  endTime?: string;
};

export type ContestRegister = {
  fullName: string;
  schoolName: string;
  studentAddress: string;
  studentDob: string;
  className: string;
  schoolAddress: string;
  parentName: string;
  parentPhoneNumber: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  groupMemberInfo: object[];
  contest_group_stage: string;
};

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type TProgressResult = {
  name: string;
  listSlug: { name: string; playtime: number }[];
  currentLevel: number;
  totalLevel: number;
};

export type TNews = {
  id: number;
  title: string;
  thumbnail: string;
  content: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: string;
  tags: string;
  metadata?: object;
  createdAt?: string;
  isActived: boolean;
  priority: boolean;
  totalRead?: number;
  salary?: string;
  status: string;
};

export type Class = {
  id: number;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  teacher?: User;
  course?: Course;
  enrollmentCount?: number;
};

export type ClassSession = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  class?: Class;
};

export type EnRollment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  student?: User;
  class?: Class;
};

export type Course = {
  id: number;
  code: string;
  name: string;
  numberSession: number;
  description?: string;
};

export type ClassSessionDetail = {
  id: number;
  class_session?: ClassSession;
  student?: User;
  attendance: boolean;
  discuss: boolean;
  homeworkDone: boolean;
  workSpeed: boolean;
  createdAt: string;
  updatedAt: string;
};
