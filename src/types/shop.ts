import { Category } from "./Category"

export type ShopItem = {
  name?: string
  image?: string,
  price?: number,
  description?: string
  category: Category
  type?: ShopItemEnum
}

export enum ShopItemEnum {
  VIRTUAL = "virtual",
  STATIONERY = "stationery"
}