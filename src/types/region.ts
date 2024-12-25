// Типы и интерфейсы для схемы Region
import type { Country, CountryResponse } from "@/types/country.ts";
import type { Links } from "@/types/link.ts";

export interface Region {
  id: number;
  name: string;
  country: Country;
  originalImagePath: string;
  createdAt: string; // ISO 8601 date-time format
  updatedAt: string; // ISO 8601 date-time format
}

export interface RegionRequest {
  name: string;
  countryId: number;
  originalImagePath?: string; // Optional
}

export interface RegionResponse {
  id: number;
  name: string;
  country: CountryResponse;
  originalImagePath: string;
  createdAt: string; // ISO 8601 date-time format
  updatedAt: string; // ISO 8601 date-time format
  _links: Links;
}
