import getProgramLabel from "../utils/getProgramLabel";

const PROGRAM_COLUMNS_CONFIG = [
  {
    key: 'title',
    title: getProgramLabel('title'),
    sortable: true,
  },
  {
    key: 'start_year',
    title: getProgramLabel('start_year'),
    sortable: true,
  },
  {
    key: 'field_of_study_code',
    title: getProgramLabel('field_of_study_code'),
    sortable: true,
  },
  {
    key: 'field_of_study_title',
    title: getProgramLabel('field_of_study_title'),
    sortable: true,
    filterOptions: [
      {
        key: 'PLACEHOLDER_FIELD_OF_STUDY',
        value: 'PLACEHOLDER_FIELD_OF_STUDY',
        label: 'Направления подготовки загружаются из данных'
      },
    ],
  },
  {
    key: 'school_title',
    title: getProgramLabel('school_title'),
    sortable: true,
    filterOptions: [
      {
        key: 'PLACEHOLDER_SCHOOL',
        value: 'PLACEHOLDER_SCHOOL',
        label: 'Школы загружаются из данных'
      },
    ],
  },
  {
    key: 'degree_title',
    title: getProgramLabel('degree_title'),
    sortable: true,
    filterOptions: [
      {
        key: 'Бакалавр',
        value: 'Бакалавр',
        label: 'Бакалавр'
      },
      {
        key: 'Магистр',
        value: 'Магистр',
        label: 'Магистр'
      },
      {
        key: 'Специалист',
        value: 'Специалист',
        label: 'Специалист'
      },
      {
        key: 'Ординатор',
        value: 'Ординатор',
        label: 'Ординатор'
      },
    ]
  },
  {
    key: 'standard_duration_months',
    title: getProgramLabel('standard_duration_months'),
    sortable: true,
  },
  {
    key: 'educational_form',
    title: getProgramLabel('educational_form'),
    sortable: true,
    filterOptions: [
      {
        key: 'OFFLINE',
        value: getProgramLabel('OFFLINE', 'value'),
        label: getProgramLabel('OFFLINE', 'value')
      },
      {
        key: 'ONLINE',
        value: getProgramLabel('ONLINE', 'value'),
        label: getProgramLabel('ONLINE', 'value')
      },
      {
        key: 'BOTH',
        value: getProgramLabel('BOTH', 'value'),
        label: getProgramLabel('BOTH', 'value')
      },
    ],
  },
  {
    key: 'state_accreditation_expiry',
    title: getProgramLabel('state_accreditation_expiry'),
    sortable: true,
  },
  {
    key: 'poa_accreditation_company',
    title: getProgramLabel('poa_accreditation_company'),
    sortable: true,
  },
  {
    key: 'poa_accreditation_expiry',
    title: getProgramLabel('poa_accreditation_expiry'),
    sortable: true,
  },
  {
    key: 'partner_titles',
    title: getProgramLabel('partner_titles'),
    sortable: true,
  },
  {
    key: 'language',
    title: getProgramLabel('language'),
    sortable: true,
    filterOptions: [
      {
        key: 'RUSSIAN',
        value: getProgramLabel('RUSSIAN', 'value'),
        label: getProgramLabel('RUSSIAN', 'value')
      },
      {
        key: 'ENGLISH',
        value: getProgramLabel('ENGLISH', 'value'),
        label: getProgramLabel('ENGLISH', 'value')
      },
      {
        key: 'PARTIALLY_ENGLISH',
        value: getProgramLabel('PARTIALLY_ENGLISH', 'value'),
        label: getProgramLabel('PARTIALLY_ENGLISH', 'value')
      },
    ]
  },
  {
    key: 'language_hours',
    title: getProgramLabel('language_hours'),
    sortable: true,
  },
  {
    key: 'educational_standard_type',
    title: getProgramLabel('educational_standard_type'),
    sortable: true,
    filterOptions: [
      {
        key: 'FEFU_BASIC',
        value: getProgramLabel('FEFU_BASIC', 'value'),
        label: getProgramLabel('FEFU_BASIC', 'value')
      },
      {
        key: 'FEFU_PARTICIPANT',
        value: getProgramLabel('FEFU_PARTICIPANT', 'value'),
        label: getProgramLabel('FEFU_PARTICIPANT', 'value')
      },
      {
        key: 'UNKNOWN',
        value: getProgramLabel('UNKNOWN', 'value'),
        label: getProgramLabel('UNKNOWN', 'value')
      },
    ]
  },
  {
    key: 'tags',
    title: getProgramLabel('Теги'),
    sortable: true,
    cellType: 'allTags',
  }
];

export default PROGRAM_COLUMNS_CONFIG;