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

export const usecoins = async (data)=>{
  try {
    const response = await api.post("/api/auth/use-coins", data)
    return response.data
    
  } catch (error) {
    // Re-throw so callers can detect 403 "Not enough coins"
    throw error
  }
}