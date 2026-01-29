import { DEFAULT_VALUES, INHERITED_FIELDS } from "../config/constants";
import { extractPartnerIds, extractSchoolId, extractDegreeId, extractFieldOfStudyId } from './dataExtractors'; 

/**
 * Builds form data object for program editing/creation.
 * Handles inheritance of fields from parent program in add mode.
 * 
 * @param {Object|null} program - Source program data or null for new
 * @param {boolean} isAdd - True if creating new program
 * @param {Array} allSchools - Available schools list
 * @param {Array} allDegrees - Available degrees list
 * @param {Array} allFieldOfStudies - Available fields of study
 * @param {Array} allPartners - Available partners list
 * @returns {Object} Form data object with all fields
 */
export const buildFormData = (program, isAdd, allSchools, allDegrees, allFieldOfStudies, allPartners) => {
  const baseData = { ...DEFAULT_VALUES };
  
  if (program) {
    const sourceData = isAdd && program.parent ? program.parent : program;
    
    INHERITED_FIELDS.forEach(field => {
      if (field === 'school_id') {
        baseData.school_id = extractSchoolId(sourceData.school_title, sourceData.school_code, allSchools);
      } else if (field === 'degree_id') {
        baseData.degree_id = extractDegreeId(sourceData.degree_title, allDegrees);
      } else if (field === 'field_of_study_id') {
        baseData.field_of_study_id = extractFieldOfStudyId(sourceData.field_of_study_title, sourceData.field_of_study_code, allFieldOfStudies);
      } else if (field === 'partner_ids') {
        baseData.partner_ids = extractPartnerIds(sourceData.partner_titles, allPartners);
      } else if (sourceData[field] !== undefined) {
        baseData[field] = sourceData[field];
      }
    });
  }

  if (program && !isAdd) {
    baseData.title = program.title;
    baseData.title_short = program.title_short;
    baseData.description = program.description;
    baseData.id = program.id;
    baseData.is_active = program.is_active;
    baseData.parent_id = program.parent_id ?? null;
    baseData.start_year = program.start_year;
    baseData.end_year = program.end_year;
  } else {
    if (program?.parent) {
      baseData.title = program.title || 'New Program';
      baseData.title_short = program.title_short || '';
      baseData.description = program.description || '';
    } else {
      baseData.title = 'New Program';
      baseData.title_short = '';
      baseData.description = '';
    }
    baseData.id = program?.id;
    baseData.is_active = true;
    baseData.parent_id = program?.id ?? null;
    baseData.start_year = (program?.start_year || 2024) + 1;
    baseData.end_year = (program?.end_year || 2024) + 1;
  }

  return baseData;
};