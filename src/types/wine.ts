import type { Country } from "@/types/country.ts";
import type { Region } from "@/types/region.ts";
import type { Grape } from "@/types/grape.ts";

// Перечисления для категорий и цвета вина
export type WineCategory =
  | "SPARKLING"
  | "CHAMPAGNE"
  | "WHITE"
  | "ORANGE"
  | "ROSE"
  | "RED"
  | "DESSERT"
  | "FORTIFIED"
  | "NON_ALCOHOL";

export type WineColour = "RED" | "WHITE" | "ORANGE" | "ROSE";

export type SugarType = "DRY" | "SEMI_DRY" | "SEMI_SWEET" | "SWEET";

// Типы и интерфейсы для схемы Wine
export interface Wine {
  id: number;
  name: string;
  category: WineCategory;
  colour: WineColour;
  vintage?: number; // Optional
  sugarType: SugarType;
  bottleVolume: number;
  alcoholByVolume: number;
  country: Country;
  region: Region;
  grapes: Grape[];
  originalImagePath?: string; // Optional
  mediumImagePath?: string; // Optional
  smallImagePath?: string; // Optional
  interestingFacts?: string; // Optional
  organoleptic?: string; // Optional
  isHidden: boolean;
  isDeleted: boolean;
  deletedAt?: string; // Optional
  createdAt: string; // ISO 8601 date-time format
  updatedAt: string; // ISO 8601 date-time format
}

export interface CreateWineRequest {
  name: string;
  category: WineCategory;
  colour: WineColour;
  vintage?: number; // Optional
  sugarType: SugarType;
  bottleVolume: number;
  alcoholByVolume: number;
  countryId: number;
  regionId?: number; // Optional
  grapeIds: number[];
  originalImagePath?: string; // Optional
  interestingFacts?: string; // Optional
  organoleptic?: string; // Optional
  isHidden: boolean;
}

export interface WineResponses {
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  _embedded: {
    adminWineResponseList: Wine[];
  };
}

export interface WineQueryParams {
  page: number;
  size: number;
  colour?: WineColour;
  sugarType?: SugarType;
  countryId?: number;
  regionId?: number;
  grapeId?: number;
  vintage?: number;
  bottleVolume?: number;
  sort?: string;
}

// Опции для селектора категорий
export const categoryOptions = [
  { label: "Игристое", value: "SPARKLING" },
  { label: "Шампанское", value: "CHAMPAGNE" },
  { label: "Белое", value: "WHITE" },
  { label: "Оранжевое", value: "ORANGE" },
  { label: "Розовое", value: "ROSE" },
  { label: "Красное", value: "RED" },
  { label: "Десертное", value: "DESSERT" },
  { label: "Фортифицированное", value: "FORTIFIED" },
  { label: "Безалкогольное", value: "NON_ALCOHOL" },
];

// Опции для селектора цвета
export const colourOptions = [
  { label: "Красный", value: "RED" },
  { label: "Белый", value: "WHITE" },
  { label: "Оранжевый", value: "ORANGE" },
  { label: "Розовый", value: "ROSE" },
];

// Опции для селектора типа сахара
export const sugarTypeOptions = [
  { label: "Сухое", value: "DRY" },
  { label: "Полусухое", value: "SEMI_DRY" },
  { label: "Полусладкое", value: "SEMI_SWEET" },
  { label: "Сладкое", value: "SWEET" },
];

// Опции для селектора стран (пример статического массива)
export const countryOptions: Array<{ label: string; value: number }> = [
  { label: "Россия", value: 1 },
  { label: "Франция", value: 2 },
  { label: "Италия", value: 3 },
];

// Опции для селектора регионов (пример статического массива)
export const regionOptions: Array<{ label: string; value: number }> = [
  { label: "Кубань", value: 1 },
  { label: "Бордо", value: 2 },
  { label: "Тоскана", value: 3 },
];

// Опции для селектора винограда (пример статического массива)
export const grapeOptions: Array<{ label: string; value: number }> = [
  { label: "Шардоне", value: 1 },
  { label: "Мерло", value: 2 },
  { label: "Каберне Совиньон", value: 3 },
];
