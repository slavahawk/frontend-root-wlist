// Общий интерфейс для ссылки
export interface Link {
  href: string;
  hreflang?: string; // Optional
  title?: string; // Optional
  type?: string; // Optional
  deprecation?: string; // Optional
  profile?: string; // Optional
  name?: string; // Optional
  templated?: boolean; // Optional
}

// Интерфейс для ссылок
export interface Links {
  [key: string]: Link;
}
