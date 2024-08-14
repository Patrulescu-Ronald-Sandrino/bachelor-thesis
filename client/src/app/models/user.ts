export interface UserDto {
  username: string;
  email: string;
  token: string;
  photo: string | null;
  roles?: string[];
  id: string;
}

export interface UserProfile {
  username: string;
  photo: string | null;
  createdAttractions: number;
  writtenComments: number;
  bio: string;
}
