import { axiosWT } from './index';

const rootPath = '/student';

export const createStudent = async (payload) => {
  const response = await axiosWT.post(`${rootPath}`, payload);
  return response.data.data;
};

export const getAllStudent = async (queries) => {
  const response = await axiosWT.get(`${rootPath}`, { params: queries });
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await axiosWT.get(`${rootPath}/${id}`);
  return response.data.data;
};

export const updateStudentById = async (payload) => {
  const response = await axiosWT.patch(`${rootPath}/${payload._id}`, payload);
  return response.data;
};

export const updateStatusById = async (id) => {
  await axiosWT.patch(`${rootPath}/${id}/status`);
};

export const deleteStudentById = async (id) => {
  await axiosWT.delete(`${rootPath}/${id}`);
};
