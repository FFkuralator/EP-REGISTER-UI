const keys = {
  network_form: "Сетевая форма реализации",
  educational_form: "Форма обучения",
  educational_standard_type: "Вид образовательного стандарта",
  language: "Язык реализации",
  language_hours: "Объем дисциплин на ин. языке",
  standard_duration_months: "Нормативный срок обучения",
  poa_accreditation_company: "Аккредитующая организация",
  poa_accreditation_expiry: "Срок действия ПОА",
  state_accreditation_expiry: "Срок действия гос. аккредитации",
  description: "Описание",
  title: "Профиль/специализация",
  title_short: "Сокращение профиля",
  school_title: "Школа",
  school_code: "Код школы",
  degree_title: "Уровень образования",
  partner_titles: "Наименование партенер-а/ов",
  field_of_study_title: "Направление подготовки",
  field_of_study_code: "Код направления подготовки",
  school_id: "Школа",
  degree_id: "Уровень образования",
  field_of_study_id: "Направление подготовки",
  partner_ids: "Партнеры",
  parent_id: "Родительская программа",
  start_year: "Год начала обучения группы",
  end_year: "Год окончания обучения группы",
  group_number: "Номер группы",
}

const values = {
  OFFLINE: 'Очно',
  ONLINE: 'Заочно',
  BOTH: 'Очно-заочная',
  ENGLISH: 'Английский',
  RUSSIAN: 'Русский',
  PARTIALLY_ENGLISH: 'Частично на английском',
  NO: 'Нет',
  FEFU_BASIC: 'ДВФУ - базовая',
  FEFU_PARTICIPANT: 'ДВФУ - участник',
  UNKNOWN: 'Неизвестен',
}

export default function getProgramLabel( key, type ) {
  if (type == 'value') {
    return values[key] || key;
  } else {
    return keys[key] || key;
  }
}