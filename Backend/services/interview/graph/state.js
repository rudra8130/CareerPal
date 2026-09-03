import {Annotation} from "@langchain/langgraph"

const InterviewState = Annotation.Root({
  action:Annotation(),
  type:Annotation(),
  role:Annotation(),
  resume:Annotation(),
  useResume:Annotation(),
  questions:Annotation(),
  question:Annotation(),
  answer:Annotation(),
  difficulty:Annotation(),
  feedback:Annotation(),
  report:Annotation(),
  completed:Annotation()
})

export default InterviewState