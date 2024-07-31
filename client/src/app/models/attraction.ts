import { AttractionType } from './attractionType.ts';
import { Country } from './country.ts';

export interface Attraction {
  id: string;
  name: string;
  description: string;
  address: string;
  website?: string;
  city: string;
  countryId: string;
  country?: string;
  attractionTypeId: string;
  attractionType?: string;
  creatorId: string;
  photos: string[];
  reaction: Reaction | null;
}

export const Reactions = ['Like', 'Dislike'] as const;
export type Reaction = (typeof Reactions)[number];

export const SortFields = [
  'Name',
  'TypeName',
  'CountryName',
  'CityName',
] as const;
export type SortField = (typeof SortFields)[number];

export const SortOrders = ['Ascending', 'Descending'] as const;
export type SortOrder = (typeof SortOrders)[number];

export const SearchFields = [
  'All',
  'Name',
  // 'TypeName',
  'CountryName',
  'CityName',
  // 'Address',
  'Description',
  // 'Website',
] as const;
export type SearchField = (typeof SearchFields)[number];

export const PAGE_SIZES = [6, 12, 24, 48, 96, 192]; // defined by backend

export interface AttractionParams {
  madeByMe: boolean;
  pageNumber: number;
  pageSize: number | null;
  sortField: SortField;
  sortOrder: SortOrder;
  searchField: SearchField;
  searchValue: string;
  types: string[];
}

export interface AttractionFormData {
  countries: Country[];
  types: AttractionType[];
  attraction: Attraction | null;
}

export type AttractionPhotosDto = {
  newPhoto?: File | null;
  currentUrl?: string | null;
  preview?: string | null;
};

export interface AttractionAddOrEditDto {
  id?: string;
  name: string;
  description: string;
  address: string;
  website: string;
  city: string;
  countryId: string;
  attractionTypeId: string;
  photos: AttractionPhotosDto[];
}
