import { api } from "@/lib/api/client";
import type {
  DetailsUserResponse,
  ResetUserDataRequest,
  ResetUserDataResponse,
  UpdateUserRequest,
} from "@/types";

const BASE = "/User";

export const profileService = {
  getUser: () =>
    api.get<DetailsUserResponse>(`${BASE}/GetUser`),

  updateUser: (data: UpdateUserRequest) =>
    api.patch<DetailsUserResponse>(`${BASE}/Update`, data),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post<void>(`${BASE}/ChangePassword`, { oldPassword, newPassword }),

  resetUserData: (data: ResetUserDataRequest) =>
    api.post<ResetUserDataResponse>(`${BASE}/ResetUserData`, data),

  deleteUser: () =>
    api.delete<void>(`${BASE}/DeleteUser`),
};
