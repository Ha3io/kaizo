import Mod from "@models/Mod";
import { connectToDB } from "@mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { query } = params;
    let mods = [];

    if (query === "all") {
        mods = await Mod.find().populate("creator");
    } else {
        mods = await Mod.find({
        $or: [
          { 'category': { $regex: query, $options: "i" } },
          { 'title': { $regex: query, $options: "i" } },
        ]
      }).populate("creator");
    }

    //console.log(mods)

    if (!mods) return new Response("No mods found", { status: 404 });

    return new Response(JSON.stringify(mods), { status: 200 });
  } catch (err) {
    console.log(err)
    return new Response("Internal server error", { status: 500 });
  }
};
