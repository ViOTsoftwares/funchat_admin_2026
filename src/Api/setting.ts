import baseApi from "../config/axios";

export type FeatureStatus = "live" | "coming_soon" | "maintenance";

export interface FeatureControl {
  chat: FeatureStatus;
  video: FeatureStatus;
  community: FeatureStatus;
}

export const GetFeatureControlApi = async (): Promise<{
  success: boolean;
  result?: FeatureControl;
  message?: string;
}> => {
  try {
    const { data } = await baseApi.get("/settings/feature-control", {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch feature control",
    };
  }
};

export const UpdateFeatureControlApi = async (payload: FeatureControl) => {
  try {
    const { data } = await baseApi.post("/settings/feature-control", payload, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update feature control",
      errors: error?.response?.data?.errors || {},
    };
  }
};

export const GetSettingApi = async () => {
  try {
    const { data } = await baseApi.get("/settings", {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
      errors: error?.response?.data?.errors || {},
    };
  }
};
export const UpdateSettingApi = async (payload: any) => {
  try {
    const { data } = await baseApi.post("/settings", payload, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
      errors: error?.response?.data?.errors || {},
    };
  }
};
