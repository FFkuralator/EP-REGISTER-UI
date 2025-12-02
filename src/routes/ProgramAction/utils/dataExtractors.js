export const extractPartnerIds = (partnerTitles, allPartners) => {
  if (!Array.isArray(partnerTitles)) return [];
  return partnerTitles
    .map(title => allPartners.find(p => p.title === title)?.id)
    .filter(id => id !== undefined);
};

export const extractSchoolId = (schoolTitle, schoolCode, allSchools) => {
  return allSchools.find(s => s.title === schoolTitle || s.code === schoolCode)?.id || 1;
};

export const extractDegreeId = (degreeTitle, allDegrees) => {
  return allDegrees.find(d => d.title === degreeTitle)?.id || 1;
};

export const extractFieldOfStudyId = (fieldOfStudyTitle, fieldOfStudyCode, allFieldOfStudies) => {
  return allFieldOfStudies.find(f => f.title === fieldOfStudyTitle || f.code === fieldOfStudyCode)?.id || 1;
};
