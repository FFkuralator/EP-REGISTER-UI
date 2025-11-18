import getProgramLabel from "../utils/getProgramLabel";

const PROGRAM_COLUMNS_CONFIG = [
  {
    key: 'title',
    title: getProgramLabel('title'),
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
  },
    {
    key: 'school_title',
    title: getProgramLabel('school_title'),
    sortable: true,
  },
    {
    key: 'degree_title',
    title: getProgramLabel('degree_title'),
    sortable: true,
    filter_options: [
      {
        key: 'Бакалавр',
        value: 'Бакалавр'
      },
      {
        key: 'Магистр',
        value: 'Магистр'
      },
      {
        key: 'Специалист',
        value: 'Специалист'
      },
      {
        key: 'Ординатор',
        value: 'Ординатор'
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
    filter_options: [
      {
        key: 'OFFLINE',
        value: getProgramLabel('OFFLINE', 'value')
      },
      {
        key: 'ONLINE',
        value: getProgramLabel('ONLINE', 'value')
      },
      {
        key: 'BOTH',
        value: getProgramLabel('BOTH', 'value')
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
    filter_options: [
      {
        key: 'RUSSIAN',
        value: getProgramLabel('RUSSIAN', 'value')
      },
      {
        key: 'ENGLISH',
        value: getProgramLabel('ENGLISH', 'value')
      },
      {
        key: 'PARTIALLY_ENGLISH',
        value: getProgramLabel('PARTIALLY_ENGLISH', 'value')
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
  },
];

export default PROGRAM_COLUMNS_CONFIG;