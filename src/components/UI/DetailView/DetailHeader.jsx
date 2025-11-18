import React from 'react'

export default function DetailHeader({ data }) {
  return (
    <div>
      <div>
        <div>
          <a href="#">{data.school_title}</a>/<a href="#">{data.degree_title}</a>/<a href="#">{data.field_of_study_title}</a>
        </div>
        <h1>{data.title}</h1>
      </div>
    </div>
  )
}
