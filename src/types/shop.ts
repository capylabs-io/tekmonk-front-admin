import { Category } from "./Category"
import { User } from "./common-types"

export type ShopItem = {
  name?: string
  image?: string,
  price?: number,
  description?: string
  category: Category
  type?: ShopItemEnum
  quantity?: number
}

export enum ShopItemEnum {
  VIRTUAL = "virtual",
  STATIONERY = "stationery"
}


export type ClaimedItem = {
  id?: number,
  code?: string,
  itemCode?: string
  quantity?: number
  user?: User
  createdAt?: string
  updatedAt?: string
}