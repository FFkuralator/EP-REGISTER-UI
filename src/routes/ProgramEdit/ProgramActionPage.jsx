import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router';
import Input from '../../components/UI/Input/Input';
import Select from '../../components/UI/Select/Select';
import getProgramLabel from '../../utils/getProgramLabel';
import { API_BASE_URL } from '../../config/api';
import styles from './ProgramActionPage.module.css'

const DEFAULT_VALUES = {
  network_form: 'NO',
  educational_form: 'OFFLINE',
  educational_standard_type: 'ФГОС ВО (3++)',
  language: 'RUSSIAN',
  language_hours: 0,
  standard_duration_months: 48,
  poa_accreditation_company: null,
  poa_accreditation_expiry: null,
  state_accreditation_expiry: 'YYYY-MM-DD',
  school_id: 1,
  degree_id: 1,
  field_of_study_id: 1,
  partner_ids: [],
};

const INHERITED_FIELDS = [
  'network_form',
  'educational_form',
  'educational_standard_type',
  'language',
  'language_hours',
  'standard_duration_months',
  'poa_accreditation_company',
  'poa_accreditation_expiry',
  'state_accreditation_expiry',
  'school_id',
  'degree_id',
  'field_of_study_id',
  'partner_ids',
];

const IGNORE_KEYS = ['is_active', 'id'];

const fetchOptions = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}?lang=ru`, {
      headers: { }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.result || [];
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return [];
  }
};

const extractPartnerIds = (partnerTitles, allPartners) => {
  if (!Array.isArray(partnerTitles)) return [];
  return partnerTitles
    .map(title => allPartners.find(p => p.title === title)?.id)
    .filter(id => id !== undefined);
};

const extractSchoolId = (schoolTitle, schoolCode, allSchools) => {
  return allSchools.find(s => s.title === schoolTitle || s.code === schoolCode)?.id || 1;
};

const extractDegreeId = (degreeTitle, allDegrees) => {
  return allDegrees.find(d => d.title === degreeTitle)?.id || 1;
};

const extractFieldOfStudyId = (fieldOfStudyTitle, fieldOfStudyCode, allFieldOfStudies) => {
  return allFieldOfStudies.find(f => f.title === fieldOfStudyTitle || f.code === fieldOfStudyCode)?.id || 1;
};

const buildFormData = (program, isAdd, allSchools, allDegrees, allFieldOfStudies, allPartners) => {
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

export default function ProgramActionPage() {
  const params = useParams();
  
  const [responseMsg, setResponseMsg] = useState();
  const [formData, setFormData] = useState();
  const [program, setProgram] = useState();
  
  const [schools, setSchools] = useState([]);
  const [fieldOfStudies, setFieldOfStudies] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [partners, setPartners] = useState([]);
  
  const isAddMode = params.action === 'add';

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

      if (params.programID !== "new") {
        try {
          const response = await fetch(`${API_BASE_URL}/educational_program/hierarchy?educational_program_id=${params.programID}&lang=ru`, {
              headers: {
              }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          const programData = result.result[0];
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
  }, [params.programID, params.action]);

  if (!formData) {
    return <div>Загрузка...</div>;
  }
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setResponseMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/educational_program/${params.action == 'add' ? 'add' : 'update'}?lang=ru`, {
        method: params.action == 'add' ? 'POST' : "PATCH",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Ошибка запроса");

      setResponseMsg(isAddMode ? 'Успешно добавлено' : 'Успешно обновлено');
    } catch (e) {
      setResponseMsg("Ошибка: " + e.message);
    }
  };

  const fieldConfig = {
    language: {
      component: Select,
      props: {
        options: [
          { id: "RUSSIAN", title: "RUSSIAN" },
          { id: "ENGLISH", title: "ENGLISH" },
          { id: "PARTIALLY_ENGLISH", title: "PARTIALLY_ENGLISH" },
        ],
        placeholder: "Выберите язык реализации",
        multiple: false,
      },
    },
    educational_form:{
      component: Select,
      props: {
        options: [
          { id: "OFFLINE", title: "OFFLINE" },
          { id: "ONLINE", title: "ONLINE" },
          { id: "BOTH", title: "BOTH" },
        ],
        placeholder: "Выберите форму обучения",
        multiple: false,
      },
    },
    network_form: {
      component: Select,
      props: {
        options: [
          { id: "NO", title: "NO" },
          { id: "FEFU_BASIC", title: "FEFU_BASIC" },
          { id: "FEFU_PARTICIPANT", title: "FEFU_PARTICIPANT" },
          { id: "UNKNOWN", title: "UNKNOWN" },
        ],
        placeholder: "Выберите форму сетевой реализации",
        multiple: false,
      },
    },
    educational_standard_type: {
      component: Select,
      props: {
        options: [
          { id: "ФГОС ВО (3++)", title: "ФГОС ВО (3++)" },
          { id: "ОС ВО ДВФУ", title: "ОС ВО ДВФУ" },
        ],
        placeholder: "Выберите образовательный стандарт",
        multiple: false,
      },
    },
    partner_ids: {
      component: Select,
      props: {
        options: partners,
        placeholder: "Выберите партнеров",
        multiple: true,
      },
    },
    school_id: {
      component: Select,
      props: {
        options: schools,
        placeholder: "Выберите школу",
      },
    },
    field_of_study_id: {
      component: Select,
      props: {
        options: fieldOfStudies,
        placeholder: "Выберите направление обучения",
      },
    },
    degree_id: {
      component: Select,
      props: {
        options: degrees,
        placeholder: "Выберите уровень образования",
      },
    },
  };

  const renderField = (key) => {
    const cfg = fieldConfig[key];

    if (cfg) {
      const { component: Component, props } = cfg;
      return (
        <Component
          value={formData[key]}
          onChange={(val) => handleChange(key, val)}
          {...props}
        />
      );
    }

    return (
      <Input
        value={formData[key] ?? ""}
        onChange={(e) => {
          let v = e.target.value;

          if (typeof formData[key] === "string" && !Number.isInteger(formData[key])) {
            handleChange(key, v === "" ? null : v);
            return;
          }

          v = v.trim();
          if (v === "null") v = null;
          else if (v === "true") v = true;
          else if (v === "false") v = false;
          else if (v === "") v = null;
          else if (!isNaN(v)) v = Number(v);

          handleChange(key, v);
        }}
      />
    );
  };

  return (
    <div className={styles.pageWrapper}>
      {params.programID !== "new" && (
        <Link className={styles.backLink} to={`/program/${params.programID}`}>
          Назад к программе
        </Link>
      )}

      <h1 className={styles.title}>
        {program?.title ?? formData.title} - {isAddMode ? 'Создание на основе' : 'Редактирование'}
      </h1>

      <div className={styles.inputList}>
        {Object.keys(formData)
          .filter(key => !IGNORE_KEYS.includes(key))
          .map((key) => (
            <div key={key} className={styles.inputField}>
              <label className={styles.label}>{getProgramLabel(key, "key")}</label>
              {renderField(key)}
            </div>
          ))}
      </div>

      <button className={styles.button} onClick={handleSubmit}>
        {isAddMode ? 'Добавить' : 'Обновить'}
      </button>

      {responseMsg && <div className={styles.responseMsg}>{responseMsg}</div>}
    </div>
  );
}
