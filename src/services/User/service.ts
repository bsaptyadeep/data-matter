import { apiClient } from "../../utils/apiHandler";
import { IUser } from "./data";

export class UserService {
  public static async getUserData(): Promise<IUser> { // Replace any with the correct return type
    const response = await apiClient("GET", "/user", {});
    return response;
  }
}