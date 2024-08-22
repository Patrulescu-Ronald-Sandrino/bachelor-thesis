export interface AttractionCollection {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  visibility: Visibility;
  items: Item[];
}

export interface Item {
  attractionId: string;
  attractionName: string;
  attractionPhoto: string;
  note: string;
}

export const Visibilities = ['Public', 'Friends', 'Private'] as const;
export type Visibility = (typeof Visibilities)[number];
