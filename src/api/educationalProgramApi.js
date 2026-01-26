import api from './api';

const BASE_ENDPOINT = '/educational_rogram';

export const getEducationalProgramHierarchy = async (programID) => {
  const response = await api.get(`${BASE_ENDPOINT}/${programID}/hierarchy`);
  console.log('Hierarchy response:', response);
  return response;
}

export const getEducationalPrograms = async () => {
  const response = await api.get(`${BASE_ENDPOINT}/get`);
  console.log('Educational programs response:', response);
  return response;
}

export const getActiveEducationalPrograms = async ({
    field_of_study_id = '',
    start_year = '',
    end_year = '',
    include_tags_ids = [],
    exclude_tags_ids = [],
    include_logic = 'AND',
    exclude_logic = 'OR'
  } = {}) => {
  const params = new URLSearchParams({
    field_of_study_id: field_of_study_id || '',
    start_year: start_year || '',
    end_year: end_year || '',
    include_logic,
    exclude_logic
  });

  include_tags_ids.forEach(id => params.append('include_tags_ids', id));
  exclude_tags_ids.forEach(id => params.append('exclude_tags_ids', id));

  const response = await api.get(`${BASE_ENDPOINT}/active/get`, { params });
  console.log('Active educational programs response:', response);
  return response;
}

export const addEducationalProgram = async (programData) => {
  const response = await api.post(`${BASE_ENDPOINT}/add`, programData);
  console.log('Add educational program response:', response);
  return response;
}

export const updateEducationalProgram = async (programID, programData) => {
  const response = await api.patch(`${BASE_ENDPOINT}/${programID}/update`, programData);
  console.log('Update educational program response:', response);
  return response;
}

export const deleteEducationalProgram = async (programID, delete_behavior = 'RESTRICT') => {
  const params = new URLSearchParams({ educational_program_id: programID, delete_behavior: delete_behavior });

  const response = await api.delete(`${BASE_ENDPOINT}/delete`, { params });
  console.log('Delete educational program response:', response);
  return response;
}
