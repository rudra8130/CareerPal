import api from "../utils/axios"


export const startInterview = async (data)=>{
  try {
    const response = await api.post("/api/interview/start", data)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return null
    
  }
}

export const getInterview = async (id)=>{
  try {
    const response = await api.get(`/api/interview/${id}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    return null
    
  }
}