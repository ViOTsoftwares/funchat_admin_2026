import baseApi from "../config/axios";

export type GameStatus = "active" | "coming_soon" | "maintenance";

export interface Game {
  _id: string;
  title: string;
  slug: string;
  status: GameStatus;
  subtitle?: string;
  description?: string;
  badge?: string;
  players?: string;
  duration?: string;
  maintenanceNotice?: string;
  comingSoonNotice?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameListResponse {
  success: boolean;
  message?: string;
  result: {
    list: Game[];
    count: number;
  };
}

export const GetGameApi = async (params?: any): Promise<GameListResponse> => {
  try {
    const { data } = await baseApi.get("/game", {
      params,
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch games",
      result: { list: [], count: 0 },
    };
  }
};

export const OneGameApi = async (idOrSlug: string): Promise<{ success: boolean; message?: string; result?: Game }> => {
  try {
    const { data } = await baseApi.get(`/game/${idOrSlug}`, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch game details",
    };
  }
};

export const CreateGameApi = async (payload: Partial<Game>): Promise<{ success: boolean; message?: string; result?: Game; errors?: Record<string, string> }> => {
  try {
    const { data } = await baseApi.post("/game", payload, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create game",
      errors: error?.response?.data?.errors || {},
    };
  }
};

export const UpdateGameApi = async (payload: Partial<Game>): Promise<{ success: boolean; message?: string; result?: Game; errors?: Record<string, string> }> => {
  try {
    const { data } = await baseApi.put("/game", payload, {
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update game",
      errors: error?.response?.data?.errors || {},
    };
  }
};

export const UpdateGameStatusApi = async (
  idOrSlug: string,
  status: GameStatus,
  notices?: { maintenanceNotice?: string; comingSoonNotice?: string }
): Promise<{ success: boolean; message?: string; result?: Game }> => {
  try {
    const { data } = await baseApi.patch(
      `/game/${idOrSlug}/status`,
      { status, ...notices },
      { withCredentials: true }
    );
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update game status",
    };
  }
};

export const DeleteGameApi = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const { data } = await baseApi.delete("/game", {
      data: { id },
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete game",
    };
  }
};

export const SeedGamesApi = async (): Promise<{ success: boolean; message?: string; result?: Game[] }> => {
  try {
    const { data } = await baseApi.post("/game/seed", {}, { withCredentials: true });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to seed games",
    };
  }
};
