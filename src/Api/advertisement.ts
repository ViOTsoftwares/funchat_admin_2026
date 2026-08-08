import baseApi from "../config/axios";

// ----- Advertisement API -----

export const GetAdsApi = async (params?: any) => {
  try {
    const { data } = await baseApi.get("/ads", {
      params,
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Request failed",
      errors: error?.response?.data?.errors || {},
    };
  }
};

export const CreateAdApi = async (payload: any) => {
  try {
    const { data } = await baseApi.post("/ads", payload, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Request failed",
      errors: error?.response?.data?.errors || {},
    };
  }
};

export const UpdateAdApi = async (payload: any) => {
  try {
    const { data } = await baseApi.put("/ads", payload, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Request failed",
      errors: error?.response?.data?.errors || {},
    };
  }
};

export const DeleteAdApi = async (id: any) => {
  try {
    const { data } = await baseApi.delete("/ads", {
      data: id,
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Request failed",
      errors: error?.response?.data?.errors || {},
    };
  }
};

export const OneAdApi = async (id: any) => {
  try {
    const { data } = await baseApi.get("/ads/" + id, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Request failed",
      errors: error?.response?.data?.errors || {},
    };
  }
};

export const SeedAdsApi = async () => {
  try {
    const { data } = await baseApi.post("/ads/seed", {}, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Request failed",
      errors: error?.response?.data?.errors || {},
    };
  }
};

