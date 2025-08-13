export type ApiResult = "OK" | "FAILD";

export interface BaseResponse { [k: string]: unknown } // chưa rõ cấu trúc, để ntn tạm

export interface UserDTO {
  id: number;
  username: string;
  fullname?: string;
  email?: string;
  role?: string;
  status?: number;
  // thêm field khác nếu backend có
}

export interface UserResponse {
  result: ApiResult;
  baseResponse?: BaseResponse;
  listUsers?: UserDTO[];
  userDTO?: UserDTO;
  message?: string;
}

export interface SearchUsersPayload {
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
  // các tiêu chí tìm khác nếu có
}

export interface RegisterUserPayload {
  username: string;
  hashpassword: string; // nếu cần mã hoá, mình sẽ hash trước khi gửi
  email?: string;
  fullname?: string;
  role?: string;
}

export interface UpdateUserPayload {
  id: number;
  username?: string;
  hashpassword?: string;
  email?: string;
  fullname?: string;
  role?: string;
  status?: number;
}

export interface DeleteUserPayload {
  id: number;
}

export interface LoginPayload {
  username: string;
  hashpassword: string; // tạm dùng plain; nếu backend yêu cầu hash, cho mình thuật toán để mã hoá trước
}
