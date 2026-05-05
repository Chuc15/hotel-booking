import axiosInstance from "./axiosInstance";

export const getBookings = async (params = {}) => {
  const response = await axiosInstance.get("/booking/all", { params });
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await axiosInstance.get(`/booking/${id}`);
  return response.data;
};

export const createBooking = async (dto) => {
  const response = await axiosInstance.post("/booking", dto);
  return response.data;
};

export const updateBooking = async (id, dto) => {
  const response = await axiosInstance.put(`/booking/${id}`, dto);
  return response.data;
};

export const deleteBooking = async (id) => {
  await axiosInstance.delete(`/booking/${id}`);
};
