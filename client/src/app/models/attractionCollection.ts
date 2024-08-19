export interface AttractionCollection {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  visibility: string;
  items: Item[];
}

export interface Item {
  attractionId: string;
  attractionName: string;
  attractionPhoto: string;
  note: string;
}
