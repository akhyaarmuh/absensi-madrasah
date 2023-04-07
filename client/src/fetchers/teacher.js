import { axiosWT } from './index';

const rootPath = '/teacher';

export const createTeacher = async (payload) => {
  const response = await axiosWT.post(`${rootPath}`, payload);
  return response.data.data;
};

export const getAllTeacher = async (queries) => {
  const response = await axiosWT.get(`${rootPath}`, { params: queries });
  return response.data;
};

export const getTeacherById = async (id) => {
  const response = await axiosWT.get(`${rootPath}/${id}`);
  return response.data.data;
};

export const updateTeacherById = async (payload) => {
  const response = await axiosWT.patch(`${rootPath}/${payload._id}`, payload);
  return response.data;
};

export const updateStatusById = async (id) => {
  await axiosWT.patch(`${rootPath}/${id}/status`);
};

export const deleteTeacherById = async (id) => {
  await axiosWT.delete(`${rootPath}/${id}`);
};
