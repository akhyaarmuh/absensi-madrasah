import { axiosWT } from './index';

const rootPath = '/classroom';

export const createClassroom = async (payload) => {
  const response = await axiosWT.post(`${rootPath}`, payload);
  return response.data.data;
};

export const getAllClassroom = async (queries) => {
  const response = await axiosWT.get(`${rootPath}`, { params: queries });
  return response.data;
};

export const updateClassroomById = async (payload) => {
  const response = await axiosWT.patch(`${rootPath}/${payload._id}`, payload);
  return response.data.data;
};

export const deleteClassroomById = async (id) => {
  await axiosWT.delete(`${rootPath}/${id}`);
};
