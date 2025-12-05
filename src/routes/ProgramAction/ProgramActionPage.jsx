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
  const [validationMsg, setValidationMsg] = useState("");
  const isAddMode = params.action === 'add';
  const { formData, setFormData, program, schools, fieldOfStudies, degrees, partners } =
    useProgramData(params.programID, isAddMode);

  if (!formData) {
    return <div>Загрузка...</div>;
  }
  const handleChange = (field, value) => {
    if (validationMsg) {
      setValidationMsg("");
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValidDate = (value) => {
    if (!value || value === 'YYYY-MM-DD') return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) return false;

    const [yearStr, monthStr, dayStr] = value.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      return false;
    }

    // разумные границы года
    if (year < 1900 || year > 2100) {
      return false;
    }

    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  };

  const validateForm = () => {
    const errors = [];

    // Проверка сокращения ОП
    if (formData.title_short && formData.title_short.length >= 4) {
      errors.push('Длина сокращения должна быть менее 4 символов.');
    }

    // Проверка дат
    if (formData.state_accreditation_expiry && !isValidDate(formData.state_accreditation_expiry)) {
      errors.push('Дата окончания государственной аккредитации должна быть в формате YYYY-MM-DD и быть корректной датой.');
    }

    if (formData.poa_accreditation_expiry && !isValidDate(formData.poa_accreditation_expiry)) {
      errors.push('Дата окончания аккредитации ПОА должна быть в формате YYYY-MM-DD и быть корректной датой.');
    }

    // Проверка годов начала/окончания реализации
    if (!Number.isInteger(formData.start_year)) {
      errors.push('Год начала реализации должен быть целым числом.');
    }

    if (!Number.isInteger(formData.end_year)) {
      errors.push('Год окончания реализации должен быть целым числом.');
    }

    if (
      Number.isInteger(formData.start_year) &&
      Number.isInteger(formData.end_year) &&
      formData.end_year < formData.start_year
    ) {
      errors.push('Год окончания реализации не может быть раньше года начала.');
    }

    // Проверка часов английского языка при русской реализации
    if (formData.language === 'RUSSIAN' && Number(formData.language_hours) > 0) {
      errors.push('Для программ с реализацией на русском языке количество английских часов должно быть 0.');
    }

    if (errors.length > 0) {
      setValidationMsg(errors.join(' '));
      return false;
    }

    setValidationMsg('');
    return true;
  };

  const handleSubmit = async () => {
    setResponseMsg("");
    if (!validateForm()) {
      return;
    }

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
          const raw = e.target.value;
          const currentValue = formData[key];
          let v = raw;

          // Очистка общих ошибок при вводе
          if (validationMsg) {
            setValidationMsg("");
          }

          // Пустая строка всегда превращается в null
          if (raw === "") {
            handleChange(key, null);
            return;
          }

          // Приведение специальных строк к значениям
          if (raw === "null") {
            handleChange(key, null);
            return;
          }

          if (raw === "true") {
            handleChange(key, true);
            return;
          }

          if (raw === "false") {
            handleChange(key, false);
            return;
          }

          // Если исходное значение было числом — пытаемся сохранить тип
          if (typeof currentValue === "number") {
            const num = Number(raw);
            if (!Number.isNaN(num)) {
              handleChange(key, num);
              return;
            }

            // Если число не распарсилось, не ломаем тип и оставляем старое значение
            handleChange(key, currentValue);
            return;
          }

          // Во всех остальных случаях — сохраняем как строку
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

      {validationMsg && <div className={styles.responseMsg}>{validationMsg}</div>}
      {responseMsg && <div className={styles.responseMsg}>{responseMsg}</div>}
    </div>
  );
}
