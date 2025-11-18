import { create } from "zustand";

export type GroupComment = {
  id: string;
  author: string;
  text: string;
};

export type GroupMembershipState = {
  joinedGroups: string[];
  likes: Record<string, boolean>;
  comments: Record<string, GroupComment[]>;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
};

export const useGroupMembershipStore = create<GroupMembershipState>((set) => ({
  joinedGroups: [],
  likes: {},
  comments: {},
  joinGroup: (groupId) =>
    set((state) =>
      state.joinedGroups.includes(groupId)
        ? {}
        : { joinedGroups: [...state.joinedGroups, groupId] }
    ),
  leaveGroup: (groupId) =>
    set((state) => ({
      joinedGroups: state.joinedGroups.filter((id) => id !== groupId)
    })),
  toggleLike: (postId) =>
    set((state) => ({
      likes: { ...state.likes, [postId]: !state.likes[postId] }
    })),
  addComment: (postId, text) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: [...(state.comments[postId] ?? []), { id: `${postId}-${Date.now()}`, author: "Du", text }]
      }
    }))
}));
