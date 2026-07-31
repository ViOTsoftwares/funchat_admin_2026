import baseApi from "../config/axios";

// ----- Category API -----

export const GetCategoryApi = async (params: any) => {
  try {
    const { data } = await baseApi.get("/community-category", {
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

export const CreateCategoryApi = async (payload: any) => {
  try {
    const { data } = await baseApi.post("/community-category", payload, {
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

export const UpdateCategoryApi = async (payload: any) => {
  try {
    const { data } = await baseApi.put("/community-category", payload, {
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

export const DeleteCategoryApi = async (id: any) => {
  try {
    const { data } = await baseApi.delete("/community-category", {
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

export const OneCategoryApi = async (id: any) => {
  try {
    const { data } = await baseApi.get("/community-category/" + id, {
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

// ----- Group API -----

export const GetGroupApi = async (params: any) => {
  try {
    const { data } = await baseApi.get("/community-group", {
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

export const CreateGroupApi = async (payload: any) => {
  try {
    const { data } = await baseApi.post("/community-group", payload, {
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

export const UpdateGroupApi = async (payload: any) => {
  try {
    const { data } = await baseApi.put("/community-group", payload, {
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

export const DeleteGroupApi = async (id: any) => {
  try {
    const { data } = await baseApi.delete("/community-group", {
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

export const OneGroupApi = async (id: any) => {
  try {
    const { data } = await baseApi.get("/community-group/" + id, {
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
