import { connectToDB } from "@mongodb/database";
import Install from "@models/Install";

export async function POST (req) {
    try {
      await connectToDB()
  
      const data = await req.formData()
  
      const modId = data.get("modId")
      const userId = data.get("userId")
      const dateString = data.get("date")
      const date = new Date(dateString)

      const newInstall = new Install({
        modId, userId, dateString
      })
      await newInstall.save();
      return new Response(JSON.stringify(newInstall), { status: 200 })
    }
    catch (err) {
      console.log(err)
      return new Response("Failed to create a new Install", { status: 500 })
    }
  }