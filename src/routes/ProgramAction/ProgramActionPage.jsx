import React, { useState } from 'react'
import { Link, useParams } from 'react-router';
import Input from '../../components/UI/Input/Input';
import getProgramLabel from '../../utils/getProgramLabel';
import { IGNORE_KEYS } from './config/constants'
import styles from './ProgramActionPage.module.css'
import makeFieldConfig from './config/makeFieldConfig';
import { submitProgram } from './api';
import useProgramData from './hooks/useProgramData';

export default function ProgramActionPage() {
  const params = useParams();
  
  const [responseMsg, setResponseMsg] = useState();
  const isAddMode = params.action === 'add';
  const { formData, setFormData, program, schools, fieldOfStudies, degrees, partners } = 
    useProgramData(params.programID, isAddMode);

  if (!formData) {
    return <div>Загрузка...</div>;
  }
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setResponseMsg("");

    try {
      const res = await submitProgram(params.action, formData);

      if (!res.ok) throw new Error("Ошибка запроса");

      setResponseMsg(isAddMode ? 'Успешно добавлено' : 'Успешно обновлено');
    } catch (e) {
      setResponseMsg("Ошибка: " + e.message);
    }
  };

  const fieldConfig = makeFieldConfig(schools, fieldOfStudies, degrees, partners)

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
