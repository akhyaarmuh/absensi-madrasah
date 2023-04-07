import { axiosWT } from './index';

const rootPath = '/image';

export const uploadProfile = async (id, formData) => {
  await axiosWT.post(`${rootPath}/upload-profile/${id}`, formData, {
    headers: { 'Content-type': 'multipart-form-data' },
  });
};

export const deleteProfile = async (id, model) => {
  await axiosWT.delete(`${rootPath}/delete-profile/${id}/${model}`);
};
