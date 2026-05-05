import axiosInstance from "./axiosInstance";

export const getUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/users", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Lấy danh sách người dùng thất bại";
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Không tìm thấy người dùng";
  }
};

export const updateUserRole = async (id, newRole) => {
  try {
    const response = await axiosInstance.put(`/users/${id}/role`, `"${newRole}"`, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Cập nhật role thất bại";
  }
};

export const deleteUser = async (id) => {
  try {
    await axiosInstance.delete(`/users/${id}`);
  } catch (error) {
    throw error.response?.data?.message || "Xóa người dùng thất bại";
  }
};

export const updateUserStatus = async (id, isActive) => {
  try {
    const response = await axiosInstance.patch(`/users/${id}/status`, { isActive });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Đổi trạng thái người dùng thất bại";
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Lấy thông tin profile thất bại";
  }
};
