//for only contest (register, userProfile, contestEntry)

import { contestRegister } from "@/requests/contest-register";
import { create } from "zustand";

interface GroupMemberInfo {
  name: string;
  schoolName: string;
  phone: string;
  dob: string;
  parentName: string;
  parentPhoneNumber: string;
}

type State = {
  fullName: string;
  schoolName: string;
  phoneNumber: string;
  schoolAddress: string;
  className?: string;
  parentName: string;
  parentPhoneNumber: string;
  studentAddress?: string;
  studentDob?: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  contest_group_stage: string;
  isAccepted: boolean;
  groupMemberInfo: GroupMemberInfo[];
};

type Actions = {
  register: (body: any) => Promise<void>;
  change: (key: string, value: any) => void;
  changeGroupMemberInfo: (index: number, key: string, value: any) => void;
  clear: () => void;
};

const defaultStates: State = {
  fullName: "",
  schoolName: "",
  phoneNumber: "",
  schoolAddress: "",
  className: "",
  parentName: "",
  parentPhoneNumber: "",
  studentAddress: "",
  studentDob: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  contest_group_stage: "",
  isAccepted: false,
  groupMemberInfo: [],
};

export const useContestRegisterStore = create<State & Actions>()(
  (set, get) => ({
    ...defaultStates,
    register: async (body) => {
      const response = await contestRegister(body);
      if (!response) {
        return;
      }
      return response;
    },
    change: (key, value) => {
      set({ [key]: value });
    },
    changeGroupMemberInfo: (index, key, value) => {
      const groupMemberInfo = get().groupMemberInfo;
      groupMemberInfo[index] = { ...groupMemberInfo[index], [key]: value };
      set({ groupMemberInfo });
    },
    clear: () => {
      set({ ...defaultStates });
    },
  })
);
