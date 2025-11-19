import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router';
import Input from '../../components/UI/Input/Input';
import getProgramLabel from '../../utils/getProgramLabel';
import styles from './ProgramEditPage.module.css'

function transformToUpdate(input) {
  return {
    network_form: input.network_form,
    educational_form: input.educational_form,
    educational_standard_type: input.educational_standard_type,
    language: input.language,
    language_hours: input.language_hours,
    standard_duration_months: input.standard_duration_months,
    poa_accreditation_company: input.poa_accreditation_company,
    poa_accreditation_expiry: input.poa_accreditation_expiry,
    state_accreditation_expiry: input.state_accreditation_expiry,
    description: input.description,
    title_short: input.title_short,
    id: input.id,
    title: input.title,
    is_active: input.is_active,
    
    field_of_study_id: 1,
    partner_ids: [],
    start_year: input.start_year,
    end_year: input.end_year,
    parent_id: input.parent_id ?? null,
    school_id: 1,
    degree_id: 1
  };
}

const ignoreKeys = [
  "is_active", 
  "id", 
]

export default function ProgramEditPage() {  
  let params = useParams();
  const [responseMsg, setResponseMsg] = useState();
  const [formData, setFormData] = useState()
  const [program, setProgram] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8042/dev/api/v1/educational_program/hierarchy?educational_program_id=${params.programID}&lang=ru`, {
            headers: {
              "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiJdLCJpc3MiOiJkZXYiLCJpYXQiOjE3NjMwMDY0MDB9.7Ky0pApLsyaV5ToYsrBydTB-4RtuS3RjNdI_anHZD_Y"
            }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setProgram(result.result[0])
        setFormData(transformToUpdate(result.result[0]));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [params.programID]);

  if (!formData) {
    return <div>Загрузка...</div>;
  }
  
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log(JSON.stringify(formData))
    setResponseMsg("");

    try {
      const res = await fetch(`http://localhost:8042/dev/api/v1/educational_program/update?lang=ru`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiJdLCJpc3MiOiJkZXYiLCJpYXQiOjE3NjMwMDY0MDB9.7Ky0pApLsyaV5ToYsrBydTB-4RtuS3RjNdI_anHZD_Y"
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Ошибка запроса");

      const data = await res.json();
      setResponseMsg("Обновлено успешно");
    } catch (e) {
      setResponseMsg("Ошибка: " + e.message);
    }
  };

  return (
    <div className={styles.editPageWrapper}>
      <Link
        className={styles.backLink}
        to={`/program/${params.programID}`}
      >
        Назад к программе
      </Link>
      <h1 className={styles.title}>{program.title}</h1>
      <div className={styles.inputList}>
        {Object.keys(formData)
          .filter(key => !ignoreKeys.includes(key))
          .map((key) => (
            <div key={key} className={styles.inputField}>
              <label className={styles.label}>{getProgramLabel(key, "key")}</label>
              {Array.isArray(formData[key]) ? (
                  <Input
                    value={formData[key].join(",")}
                    onChange={(e) => {
                      const raw = e.target.value.trim();

                      if (raw === "[]") {
                        handleChange(key, []);
                        return;
                      }

                      if (raw === "") {
                        handleChange(key, []);
                        return;
                      }

                      const arr = raw.split(",").map((v) => {
                        v = v.trim();
                        if (v === "null") return null;
                        if (v === "true") return true;
                        if (v === "false") return false;
                        return isNaN(v) ? v : Number(v);
                      });

                      handleChange(key, arr);
                    }}
                  />

              ) : (
                <Input
                  value={formData[key] ?? ""}
                  onChange={(e) => {
                    let v = e.target.value.trim();

                    if (v === "null") v = null;
                    else if (v === "true") v = true;
                    else if (v === "false") v = false;
                    else if (v === "") v = null;
                    else if (!isNaN(v)) v = Number(v);

                    handleChange(key, v);
                  }}
                />
              )}
            </div>
        ))}

      </div>
      <button className={styles.button} onClick={handleSubmit}>
        Обновить
      </button>

      {responseMsg && <div className={styles.responseMsg}>{responseMsg}</div>}

    </div>
  );
}
