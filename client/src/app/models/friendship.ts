export const FriendshipStatusList = [
  'Accepted',
  'Received',
  'Requested',
  'None',
] as const;
export type FriendshipStatus = (typeof FriendshipStatusList)[number];

export interface Friendship {
  username: string;
  userPhoto: string;
  status: FriendshipStatus;
  modifiedAt: string;
}

export type FriendshipsDto = {
  [key in FriendshipStatus]: Friendship[];
};

export const FriendshipActionAdd = ['Accept friend', 'Add friend'] as const;
export const FriendshipActionDelete = [
  'Unfriend',
  'Decline friend',
  'Cancel friend request',
] as const;
export const FriendshipAction = [
  ...FriendshipActionAdd,
  ...FriendshipActionDelete,
];
export type FriendshipActionType = (typeof FriendshipAction)[number];

export const FriendshipStatusToActionName: Record<
  FriendshipStatus,
  FriendshipActionType[]
> = {
  Accepted: ['Unfriend'],
  Received: ['Accept friend', 'Decline friend'],
  Requested: ['Cancel friend request'],
  None: ['Add friend'],
};
