import { Mission } from "./mission";

export type Course = {
  id: number;
  code: string;
  name: string;
  numberSession: number;
  description?: string;
  thumbnail?: string;
}


export type CourseMission = {
  course: Course,
  mission: Mission
}
