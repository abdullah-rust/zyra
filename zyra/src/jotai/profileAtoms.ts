import { atom } from "jotai";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  img_link?: string; // ✅ API ke according yeh field hai
}

// Profile modal visibility atom
export const isProfileModalVisibleAtom = atom<boolean>(false);

// Edit profile modal visibility atom
export const isEditProfileModalVisibleAtom = atom<boolean>(false);

// User profile data atom
export const userProfileAtom = atom<UserProfile>({
  id: "1",
  name: "unknow",
  username: "unknow",
  email: "unknow",
  bio: "unknow",
});

// Temporary edit state atom
export const editProfileDataAtom = atom<UserProfile>({
  id: "1",
  name: "unknow",
  username: "unknow",
  email: "unknow",
  bio: "unknow",
});
