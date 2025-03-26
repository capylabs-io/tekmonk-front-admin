import { User } from "./common-types"

export type Mission = {
  id?: number
  title?: string
  description?: string
  type?: MissionType,
  actionType?: string
  module?: string
  number?: number
  requiredQuantity?: number
  points?: number
  teacher?: User
}

export enum MissionType {
  EVERY_SESSION = 'EverySession',
  MANUAL = 'Manual'
}