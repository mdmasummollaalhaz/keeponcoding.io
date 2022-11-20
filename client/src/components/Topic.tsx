import React from "react"

type TopicProps = {
    question_topic_desc : string
    topic_order : number
    topic_url_path : string
  }

const Topic: React.FC<TopicProps> = (props) => {
  return (
    <div>
      <h1>{props.question_topic_desc}</h1>
    </div>
  )
}

export default Topic