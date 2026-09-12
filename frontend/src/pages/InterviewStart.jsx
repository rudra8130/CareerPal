import React from "react";
import Step1setup from "../components/interview/Step1setup";

function InterviewStart({ user, setuser }) {
  return <Step1setup user={user} setuser={setuser} />;
}

export default InterviewStart;
