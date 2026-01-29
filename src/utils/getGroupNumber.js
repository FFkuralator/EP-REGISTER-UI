/**
 * Generates educational program group number.
 * Format: {Degree}{School}{Form}{Year}-{FieldCode}{ShortTitle}
 * 
 * @param {string} degree_title - Degree level
 * @param {string} school_code - School code
 * @param {string} educational_form - OFFLINE or ONLINE
 * @param {number} start_year - Start year
 * @param {string} field_of_study_code - Field of study code
 * @param {string} title_short - Short program title
 * @returns {string} Generated group number
 */
export default function getGroupNumber(
  degree_title, 
  school_code, 
  educational_form,
  start_year, 
  field_of_study_code, 
  title_short,
) {
  const degreeMap = {
    "Бакалавр": "Б",
    "Магистр": "М",
    "Специалист": "С",
  };

  const degree = degreeMap[degree_title] || "?";

  const school = school_code;

  const form = educational_form == 'OFFLINE' ? 1 : 2;
  
  const yearShort = String(start_year).slice(-2);

  const code = field_of_study_code;


  const title = title_short.toLowerCase();

  return `${degree}${school}${form}${yearShort}-${code}${title}`;

}