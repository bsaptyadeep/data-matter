import { apiClient } from "../../utils/apiHandler";
import { IUser } from "./data";

interface IAPIResponse<T> {
  status: string;
  data: T
}

export class UserService {
  public static async getUserData(): Promise<IAPIResponse<IUser | any>> { // Replace any with the correct return type
    const response = await apiClient("GET", "/user", {});
    return response;
  }
}