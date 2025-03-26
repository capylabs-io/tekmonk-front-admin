import { User } from "./common-types";

export type Mission = {
  id: number;
  title: string;
  description?: string;
  type: MissionType;
  actionType: string;
  module?: string;
  reward: number;
  imageUrl?: string;
  requiredQuantity: number;
  points: number;
  teacher?: User;
  numberOfUserAchieved: number;
};

export enum MissionType {
  EVERY_SESSION = "EverySession",
  MANUAL = "Manual",
}
