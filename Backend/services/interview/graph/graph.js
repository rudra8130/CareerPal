import { END, START, StateGraph } from "@langchain/langgraph";
import InterviewState from "./state.js";
import { feedbackNode, interviewNode, summary } from "./nodes.js";
import { interviewAgent } from "../agents/interview.agent.js";
import { feedbackAgent } from "../agents/feedback.agent.js";

function router(state){
  switch(state.action){

    case "start":
    return "interviewAgent";

    case "feedback":
      return "feedbackAgent";

    default:
      return END;
  }
}

function feedbackRouter(state){
  if(state.completed){
    return "summaryAgent"
  }

  return END;
}

const graph = new StateGraph(InterviewState)
.addNode("interviewAgent", interviewNode)
.addNode("feedbackAgent", feedbackNode)
.addNode("summaryAgent", summary)
.addConditionalEdges(
  START,
  router,
  {
    interviewAgent:"interviewAgent",
    feedbackAgent:"feedbackAgent"
  }
)
.addEdge(
  "interviewAgent",
  END
)
.addConditionalEdges("feedbackAgent", feedbackRouter,
  {
    summaryAgent:"summaryAgent",
    [END]:END
  }
)
.addEdge(
  "summaryAgent",
  END
)
.compile()

export default graph