import React, {useEffect, useState} from "react";
import { fetchOptions, fetchProgram } from '../api/index';
import { buildFormData } from "../utils/buildFormData";

/**
 * Hook for loading and managing educational program form data.
 * Fetches program data, related options (schools, degrees, etc.) and builds form state.
 * 
 * @param {string} programID - Program ID or "new" for new program
 * @param {boolean} isAddMode - True if creating new program based on existing
 * @returns {Object} Form data, setters, and loaded options
 */
export default function useProgramData(programID, isAddMode) {
  const [formData, setFormData] = useState();
  const [program, setProgram] = useState();
  
  const [schools, setSchools] = useState([]);
  const [fieldOfStudies, setFieldOfStudies] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const [schoolsData, fieldOfStudiesData, degreesData, partnersData] = await Promise.all([
        fetchOptions('school/get'),
        fetchOptions('field_of_study/get'),
        fetchOptions('degree/get'),
        fetchOptions('educational_program_partner/get')
      ]);
      
      setSchools(schoolsData);
      setFieldOfStudies(fieldOfStudiesData);
      setDegrees(degreesData);
      setPartners(partnersData);

      if (programID !== "new") {
        try {
          const programData = await fetchProgram(programID)
          setProgram(programData);
          setFormData(buildFormData(programData, isAddMode, schoolsData, degreesData, fieldOfStudiesData, partnersData));
        } catch (err) {
          console.error('Error fetching program:', err);
        }
      } else {
        setFormData(buildFormData(null, false, schoolsData, degreesData, fieldOfStudiesData, partnersData));
      }
    };

    fetchAllData();
  }, [programID, isAddMode]);

  return {
    formData,
    setFormData,
    program,
    schools,
    fieldOfStudies,
    degrees,
    partners
  };
}
