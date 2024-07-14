export interface Attraction {
  id: string;
  name: string;
  description: string;
  address: string;
  website: string;
  city: string;
  country: string;
  attractionType: string;
  mainPictureUrl: string;
}

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

export interface AttractionParams {
  pageNumber: number;
  pageSize: number;
  sortField: SortField;
  sortOrder: SortOrder;
  searchField: SearchField;
  searchValue: string;
  types: string[];
}
