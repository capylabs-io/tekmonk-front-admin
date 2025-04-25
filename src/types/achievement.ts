import { User } from "./common-types";

export type TAchievement = {
  id: number;
  title: string;
  description?: string;
  type: AchievementType;
  actionType: string;
  module?: string;
  reward: number;
  imageUrl?: string;
  requiredQuantity: number;
  points: number;
  teacher?: User;
  numberOfUserAchieved: number;
};

export enum AchievementType {
  EVERY_SESSION = "Auto",
  MANUAL = "Manual",
}

export const AchievementTypeToText = {
  [AchievementType.EVERY_SESSION]: "Tự động",
  [AchievementType.MANUAL]: "Thủ công",
};
