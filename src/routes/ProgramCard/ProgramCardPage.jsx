import React, { useEffect, useState } from 'react'
import DetailView from '../../components/UI/DetailView/DetailView';
import getGroupNumber from '../../utils/getGroupNumber';
import getHistoryChanges from '../../utils/getHistoryChanges';
import Text from '../../components/UI/Text/Text';
import HistoryItem from '../../components/UI/DetailView/HistoryItem';
import getProgramLabel from '../../utils/getProgramLabel';
import getFormattedDate from '../../utils/getFormattedDate';
import { API_BASE_URL } from '../../config/api';
import { useParams } from 'react-router';

export default function ProgramCardPage() {  
  let params = useParams();

  const [programIerarchy, setProgramIerarchy] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/educational_program/hierarchy?educational_program_id=${params.programID}&lang=ru`, {
            headers: {
              "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiJdLCJpc3MiOiJkZXYiLCJpYXQiOjE3NjMwMDY0MDB9.7Ky0pApLsyaV5ToYsrBydTB-4RtuS3RjNdI_anHZD_Y"
            }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setProgramIerarchy(result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [params.programID]);


  const dateKeys = [
    "poa_accreditation_expiry", 
    "state_accreditation_expiry"
  ];

  const formatProgramData = (data, dateKeys) => {
      const formattedData = { ...data };

      dateKeys.forEach(key => {
          if (formattedData[key]) {
              formattedData[key] = getFormattedDate(formattedData[key])
          }
      });

      return formattedData;
  };

  if (!programIerarchy || !programIerarchy.result) {
    return <div>Загрузка...</div>;
  }
  const program = formatProgramData(programIerarchy.result[0], dateKeys);

  
  const header = {
    school_title: program.school_title,
    title: program.title,
    field_of_study_title: program.field_of_study_title,
    degree_title: program.degree_title
  }

  const headerLinks = [
      {
        label: "Редактировать",
        href: `./edit`,
      },
      {
        label: "Создать на основе",
        href: './add'
      }
  ]

  const meta = {
    field_of_study_code: program.field_of_study_code,
    field_of_study_title: program.field_of_study_title,
    educational_form: program.educational_form,
    degree_title: program.degree_title,
    school_title: program.school_title,
    standard_duration_months: program.standard_duration_months,
    poa_accreditation_company: program.poa_accreditation_company,
    poa_accreditation_expiry: program.poa_accreditation_expiry,
    state_accreditation_expiry: program.state_accreditation_expiry,
    network_form: program.network_form,
    partner_titles: program.partner_titles,
    educational_standard_type: program.educational_standard_type,
    language: program.language,
    language_hours: program.language_hours,
  }

  const historyChanges = getHistoryChanges(programIerarchy)
  const details = [
    {
      title: "Описание",
      content: <Text> { program.description } </Text>,
    },
    historyChanges.length > 1 &&{
      title: "Иерархия программ",
      content: [
        historyChanges.map(( item, index ) => (
          <HistoryItem key={index} meta={ item.meta } changes={ item.changes }/>
        ))
      ],
    }
  ]

  const sidebar = [
    {
      start_year: program.start_year,
      end_year: program.end_year,
      group_number: getGroupNumber(
        program.degree_title,
        program.school_code,
        program.educational_form,
        program.start_year,
        program.field_of_study_code,
        program.title_short
      )
    },
  ]
  
  return (
    <>
      <DetailView 
        header={header}
        headerLinks={headerLinks}
        meta={meta}
        getMetaLabel={getProgramLabel}
        details={details}
        sidebar={sidebar}
        getSidebarLabel={getProgramLabel}
      />
    </>
  )
}
