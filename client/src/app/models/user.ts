export interface UserDto {
  username: string;
  email: string;
  token: string;
  photo: string;
  roles?: string[];
  id: string;
}

export interface UserProfile {
  username: string;
  photo: string;
  createdAttractions: number;
  writtenComments: number;
  bio: string;
}
