import baseApi from "../config/axios";

export const AppUserListApi = async (payload: any) => {
  try {
    const { data } = await baseApi.get("/users", {
      params: payload,
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    console.error("AppUserListApi error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch users",
      result: { list: [], count: 0 },
    };
  }
};

export const ToggleUserStatusApi = async (payload: { id: string; status?: string }) => {
  try {
    const { data } = await baseApi.patch("/users", payload, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    console.error("ToggleUserStatusApi error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update user status",
    };
  }
};

export const DeleteUserApi = async (payload: { id: string }) => {
  try {
    const { data } = await baseApi.delete("/users", {
      data: payload,
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    console.error("DeleteUserApi error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete user",
    };
  }
};
