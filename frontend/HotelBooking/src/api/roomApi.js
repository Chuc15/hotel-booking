import axiosInstance from "./axiosInstance";

export const getRooms = async (params = {}) => {
  const response = await axiosInstance.get("/rooms", { params });
  return response.data;
};

export const getRoomById = async (id) => {
  const response = await axiosInstance.get(`/rooms/${id}`);
  return response.data;
};

export const createRoom = async (dto) => {
  const response = await axiosInstance.post("/rooms", dto);
  return response.data;
};

export const updateRoom = async (id, dto) => {
  const response = await axiosInstance.put(`/rooms/${id}`, dto);
  return response.data;
};

export const deleteRoomApi = async (id) => {
  await axiosInstance.delete(`/rooms/${id}`);
};
