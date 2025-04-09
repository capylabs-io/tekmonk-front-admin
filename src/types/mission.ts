import { User } from "./common-types";

export interface Mission {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  type: string;
  reward: number;
  points: number;
  class?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  numberOfUserAchieved?: number;
}

export enum MissionType {
  EVERY_SESSION = "EverySession",
  MANUAL = "Manual",
}

export type MissionHistory = {
  user?: User;
  mission?: Mission;
  isClaim: boolean;
};
