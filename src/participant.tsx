import * as React from 'react'
import { useParams } from 'react-router-dom'

export const Participant = () => {
  const { feedbackSessionRequestId }  = useParams()
  console.log("hi" + feedbackSessionRequestId)
  return <div>{"request id: " + feedbackSessionRequestId}</div>
}