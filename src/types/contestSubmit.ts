import { ContestEntry, Media } from "@/types/common-types";

export type TResultCodeCombat = {
  name: string;
  totalLevel: number;
  currentLevel: number;
};

export type ContestSubmission = {
  id: string;
  title: string;
  assets?: Media[];
  thumbnail: Media;
  description?: string;
  contest_entry: ContestEntry | null;
  tags?: string[];
  createdAt: string;
  url?: string;
  source?: any;
  data?: any;
  resultCodeCombat?: TResultCodeCombat[];
  QualifiedExam: boolean | null;
};

export type DataContestSubmission = {
  title: string;
  description?: string;
  url?: string;
  tags?: {
    data: string[];
  };
  contest_entry: string | null;
  classIndex?: string; //group stage id (0 -> 5)
  memberId?: string | null; // code combat id in local storage
  data?: any;
};
