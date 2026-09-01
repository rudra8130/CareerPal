import api from "../utils/axios.js"


export const getCurrentUser = async ()=>{
  try {
    const response = await api.get("/api/me")

    return response.data
  } catch (error) {
    console.log("error", error)
    return null
    
  }
}