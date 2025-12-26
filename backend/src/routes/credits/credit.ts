import { getAuth } from "@clerk/express"
import express from "express"
import { getUsageStatus } from "../../lib/credit-limits"
export const creditRoute: express.Router = express.Router()

creditRoute.get('/credits', async(req,res)=>{
  try{
    const {userId, has} = getAuth(req)
    if(!userId){
      throw new Error("unauthorized")
    }

    const hasProAccess = has({plan: "pro"})
    const usage = await getUsageStatus(userId, hasProAccess)
    if(!usage){
      return res.status(500).json({
        success: false,
        message: "Failed to fetch usage"
      })
    }

    return res.json({
      success: true,
      usageData: {
        consumed: usage.consumed,
        remaining: usage.remaining,
        total: usage.total,
      },
    });
  }catch(error){
    console.log("Error in fetching the status", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
})