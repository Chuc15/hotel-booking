import axiosInstance from "./axiosInstance";

export const getRoomTypes = async (params = {}) => {
  const response = await axiosInstance.get("/roomtypes", { params });
  return response.data;
};

export const getRoomTypeById = async (id) => {
  const response = await axiosInstance.get(`/roomtypes/${id}`);
  return response.data;
};

export const createRoomType = async (dto) => {
  const response = await axiosInstance.post("/roomtypes", dto);
  return response.data;
};

export const updateRoomType = async (id, dto) => {
  const response = await axiosInstance.put(`/roomtypes/${id}`, dto);
  return response.data;
};

export const deleteRoomType = async (id) => {
  await axiosInstance.delete(`/roomtypes/${id}`);
};
