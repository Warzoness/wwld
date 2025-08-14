import {
  UserDTO, UserResponse, SearchUsersPayload,
  RegisterUserPayload, UpdateUserPayload, DeleteUserPayload, LoginPayload
} from "../types/user";
import { apiClient } from "../apiClient";

const base = "/authentication";

export async function login(payload: { username: string; hashpassword: string }): Promise<UserDTO> {
  const { data } = await apiClient.post<UserResponse>(`${base}/login`, payload);
  console.log("data :", data.userDTO);

  if (!data.userDTO) throw new Error("Login failed");
  await fetch("/api/auth/set-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: data.userDTO.role }),
  });


  return data.userDTO;
}

export async function getListUsers(payload: SearchUsersPayload = {}): Promise<UserDTO[]> {
  const { data } = await apiClient.post<UserResponse>(`${base}/getListUsers`, payload);
  if (data.result !== "OK") throw new Error("Get users failed");
  return data.listUsers ?? [];
}

export async function registerUser(payload: RegisterUserPayload): Promise<void> {
  const { data } = await apiClient.post<UserResponse>(`${base}/register`, payload);
  if (data.result !== "OK") throw new Error("Register failed");
}

export async function updateUser(payload: UpdateUserPayload): Promise<void> {
  const { data } = await apiClient.post<UserResponse>(`${base}/update`, payload);
  if (data.result !== "OK") throw new Error("Update failed");
}

export async function deleteUser(payload: DeleteUserPayload): Promise<void> {
  const { data } = await apiClient.post<UserResponse>(`${base}/delete`, payload);
  if (data.result !== "OK") throw new Error("Delete failed");
}
