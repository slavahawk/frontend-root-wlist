// Типы и интерфейсы для схемы Grape
import type { Links } from "@/types/link.ts";

export interface Grape {
  id: number;
  name: string;
}

export interface GrapeRequest {
  name: string;
}

export interface GrapeResponse {
  id: number;
  name: string;
  _links: Links;
}
