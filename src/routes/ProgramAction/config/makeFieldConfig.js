import Select from "../../../components/UI/Select/Select";  

export default function makeFieldConfig(schools, fieldOfStudies, degrees, partners) {
  return {
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
}