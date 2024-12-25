// Типы и интерфейсы для схемы Country
import type { Links } from "@/types/link.ts";

export interface Country {
  id: number;
  name: string;
  originalImagePath: string;
  createdAt: string; // ISO 8601 date-time format
  updatedAt: string; // ISO 8601 date-time format
}

export interface CountryRequest {
  name: string;
  originalImagePath?: string; // Optional
}

export interface CountryResponse {
  id: number;
  name: string;
  originalImagePath: string;
  _links: Links;
}
