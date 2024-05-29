import { connectToDB } from "@mongodb/database";
import Mod from "@models/Mod";

export const GET = async (req, { params }) => {
  try {
    await connectToDB()

    const { category } = params

    let modList

    if (category !== "All") {
      modList = await Mod.find ({ category }).populate("creator")
    } else {
      modList = await Mod.find().populate("creator")
    }

    return new Response(JSON.stringify(modList), { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response("Failed to fetch Mod List", { status: 500 })
  }
}