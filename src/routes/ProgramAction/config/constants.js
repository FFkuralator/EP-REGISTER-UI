export const DEFAULT_VALUES = {
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

export const INHERITED_FIELDS = [
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

export const IGNORE_KEYS = ['is_active', 'id'];
