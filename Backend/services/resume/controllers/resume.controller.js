import redis from "../../../shared/redis/redis.js";
import { resumeAgent } from "../agents/resume.agents.js";
import extractText from "../configs/pdf.js";
import Resume from "../models/resume.model.js";
import fs from "fs"

export const uploadResume = async (req, res)=>{
  try {
    const file = req.file;
    if(!file){
      return res.status(400).json({
        success:false,
        message:"Resume PDF is Required"
      })
    }

    
    const userId = req.headers["x-user-id"];
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"userId is Required"
      })
    }

    const resumeText = await extractText(file.path)

    const airesponse = await resumeAgent(resumeText)

    const resumeData = JSON.parse(airesponse)

    let resume = await Resume.findOne({userId})

    if(resume){
      Object.assign(resume,{
        ...resumeData,
        extractedText: resumeText
      }
        
      )
      await resume.save()
    }
    else{
      resume = await Resume.create({
        userId,
        extractedText:resumeText,
        ...resumeData
      })
    }

    await redis.set(`resume:${userId}`, JSON.stringify(resume))

    await fs.unlinkSync(file.path)


    return res.status(200).json({
      success:true,
      message:"Resume Analysed Successfully",
      data:resume
    })

  } catch (error) {
    console.log("error: ", error);
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return res.status(500).json({
      success: false,
      message: error.message
    });
  
    
  }
}

export const getResume = async (req, res)=>{
  try {
     const userId = req.headers["x-user-id"];

  const cache = await redis.get(`resume:${userId}`)

  if(cache){
    return res.status(200).json({
      success:true,
      source:"redis",
      data:JSON.parse(cache)
    })
  }

  const resume = await Resume.findOne({userId})

  if(!resume){
    return res.status(404).json({
      success:false,
      message:"resume not found"
    })
  }

  
  await redis.set(`resume:${userId}`, JSON.stringify(resume))
  return res.status(200).json({
      success:true,
      source:"mongoDB",
      data:resume
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:error.message
    })
    
  }
}