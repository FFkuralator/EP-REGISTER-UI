const labels = {
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
  start_year: "Год начала обучения группы",
  end_year: "Год окончания обучения группы",
  group_number: "Номер группы",
}

export default function getProgramValueLabel( value ) {
  return labels[value] || value;
}