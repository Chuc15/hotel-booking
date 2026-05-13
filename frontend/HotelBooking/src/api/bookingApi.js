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

export const updateBookingStatus = async (id, status) => {
  const response = await axiosInstance.patch(
    `/booking/${id}/status`,
    { status }
  );

  return response.data;
};

export const deleteBooking = async (id) => {
  await axiosInstance.delete(`/booking/${id}`);
};
export const createVnPayUrl = async (paymentData) => {
  const response = await axios.post(`${API_URL}/api/payment/pay-vnpay`, paymentData);
  return response.data; // Trả về { paymentUrl: '...' }
};
