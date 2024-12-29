import { axiosWT } from './index';

const rootPath = '/absent';

export const createAbsent = async (payload) => {
  const response = await axiosWT.post(`${rootPath}`, payload);
  return response.data.data;
};

export const getAllAbsent = async (queries) => {
  const response = await axiosWT.get(`${rootPath}`, { params: queries });
  return response.data;
};

export const deleteAbsentById = async (id) => {
  await axiosWT.delete(`${rootPath}/${id}`);
};

export const deleteAbsentByIds = async (ids) => {
  await axiosWT.delete(`${rootPath}`, { data: { ids: ids } });
};

// absent_detail
export const createAbsentDetail = async (id_absent, payload) => {
  const response = await axiosWT.post(
    `${rootPath}/detail/${id_absent}`,
    payload
  );
  return response.data.data;
};

export const getUserAbsent = async (id_absent, queries) => {
  const response = await axiosWT.get(`${rootPath}/detail/${id_absent}`, {
    params: queries,
  });
  return response.data;
};

export const updateAbsentDetailStudent = async (id_absent, payload) => {
  const response = await axiosWT.patch(
    `${rootPath}/detail/${id_absent}/student`,
    payload
  );
  return response.data;
};

export const updateAbsentDetailByNoInduk = async (id_absent, payload) => {
  const response = await axiosWT.patch(
    `${rootPath}/detail/${id_absent}`,
    payload
  );
  return response.data.data;
};
