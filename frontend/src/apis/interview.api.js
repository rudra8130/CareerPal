import api from "../utils/axios"


export const startInterview = async (data) => {
  try {
    const response = await api.post("/api/interview/start", data)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return null

  }
}

export const getInterview = async (id) => {
  try {
    const response = await api.get(`/api/interview/${id}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return null

  }
}

export const submitAnswer = async (data) => {
  try {
    const response = await api.post("/api/interview/answer", data)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getAllInterviews = async () => {
  try {
    const response = await api.get("/api/interview/all")
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}