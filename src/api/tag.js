import api from './api';

const BASE_ENDPOINT = '/tag';
const FAMILY_ENDPOINT = `${BASE_ENDPOINT}/family`;
const PROGRAM_ENDPOINT = `${BASE_ENDPOINT}/program`;

export const getTags = async () => {
  const response = await api.get(`${BASE_ENDPOINT}/get`);
  console.log('Tags response:', response);
  return response;
}

export const getGroupedTags = async () => {
  const response = await api.get(`${BASE_ENDPOINT}/grouped/get`);
  console.log('Grouped tags response:', response);
  return response;
}

export const addTag = async (tagData) => {
  const response = await api.post(`${BASE_ENDPOINT}/add`, tagData);
  console.log('Add tag response:', response);
  return response;
}

export const updateTag = async (tagData) => {
  const response = await api.patch(`${BASE_ENDPOINT}/update`, tagData);
  console.log('Update tag response:', response);
  return response;
}

export const deleteTag = async (tagID) => {
  const params = new URLSearchParams({ tag_id: tagID });

  const response = await api.delete(`${BASE_ENDPOINT}/delete`, { params });
  console.log('Delete tag response:', response);
  return response;
}

export const addTagsToProgram = async (programID, tagIDs) => {
  const response = await api.post(`${PROGRAM_ENDPOINT}/add`, { educational_program_id: programID, tag_ids: tagIDs });
  console.log('Add tags to program response:', response);
  return response;
}

export const removeTagsFromProgram = async (programID, tagIDs) => {
  const response = await api.post(`${PROGRAM_ENDPOINT}/remove`, { educational_program_id: programID, tag_ids: tagIDs });
  console.log('Remove tags from program response:', response);
  return response;
}

export const updateTagsForProgram = async (programID, tagIDs) => {
  const response = await api.post(`${PROGRAM_ENDPOINT}/update`, { educational_program_id: programID, tag_ids: tagIDs });
  console.log('Update tags for program response:', response);
  return response;
}

export const addTagsToFamily = async (programID, tagIDs) => {
  const response = await api.post(`${FAMILY_ENDPOINT}/add`, { educational_program_id: programID, tag_ids: tagIDs });
  console.log('Add tags to family response:', response);
  return response;
}

export const removeTagsFromFamily = async (programID, tagIDs) => {
  const response = await api.post(`${FAMILY_ENDPOINT}/remove`, { educational_program_id: programID, tag_ids: tagIDs });
  console.log('Remove tags from family response:', response);
  return response;
}

export const updateTagsForFamily = async (programID, tagIDs) => {
  const response = await api.post(`${FAMILY_ENDPOINT}/update`, { educational_program_id: programID, tag_ids: tagIDs });
  console.log('Update tags for family response:', response);
  return response;
}
