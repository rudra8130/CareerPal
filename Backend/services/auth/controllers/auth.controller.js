import { app } from "../configs/firebase.js";
import {getAuth} from "firebase-admin/auth"
import User from "../models/user.model.js" ;
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js";


export const GoogleAuth = async (req, res)=>{
  try {
    const {token} = req.body;

    const decoded = await getAuth(app).verifyIdToken(token)

    let user = await User.findOne({
      firebaseUid: decoded.uid
    })

    if(!user){

      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email
      })
    }

    const sessionId = crypto.randomUUID()

    await redis.set(`session:${sessionId}`, JSON.stringify({
      userId: user._id,
      name: user.name,
      email:user.email,
      interviewCoin: user.interviewCoin
    }), "EX", 7*24*60*60)

    res.cookie("session", sessionId, {
      httpOnly:true,
      secure:false,
      sameSite: "strict",
      maxAge : 7*24*60*60*1000
    })

    return res.status(200).json({success:true, user})

  } catch (error) {
    return res.status(500).json("Google Auth error",error)
    
  }

  
}
export const logout = async (req, res)=>{
    try {
      const sessionId = req.cookies?.session

      if(sessionId){
        await redis.del(`session:${sessionId}`)
      }

      res.clearCookie("session",{
        httponly:true,
        secure:false,
        sameSite: "strict",
      })

      return res.status(200).json({success : true , message:"LogOut Successful"})
    } catch (error) {
      return res.status(500).json({success : false , message: error.message})
      
    }
  }

 export  const useCoins = async (req, res)=>{
    try {
      const sessionId = req.cookies?.session

      if(!sessionId){
        return res.status(401).json({message:"Unauthorized"})
      }
      const session = await redis.get(`session:${sessionId}`)
      const sessionData = JSON.parse(session)

      const {coins, action} = req.body

      if(!coins){
        return res.status(400).json({
          success:false,
          message:"Coins are Required"
        })
      }

     const user = await User.findById(sessionData.userId)

      if(!user){
        return res.status(404).json({
          success:false,
          message:"User not Found"
        })
      }

      if(user.interviewCoin < coins){
        return res.status(403).json({
          success:false,
          message:"Not enough interview coins",
          interviewCoin:user.interviewCoin,
        })
      }

      user.interviewCoin -= coins

      await user.save(  )


      await redis.set(`session:${sessionId}`, JSON.stringify({
      userId: user._id,
      name: user.name,
      email:user.email,
      interviewCoin: user.interviewCoin
    }), "EX", 7*24*60*60)



    return res.status(200).json({
      success:true,
      message:"Interview coins Updated successfully",
      action,
      interviewCoin:user.interviewCoin
    })
    } catch (error) {

      return res.status(500).json({
        success:false,
        message:error.message
      })
      
    }
  }