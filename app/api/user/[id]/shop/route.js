import Mod from "@models/Mod";
import User from "@models/User";

import { connectToDB } from "@mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const user = await User.findById(params.id);
    const modList = await Mod.find({ creator: params.id }).populate("creator");

    user.works = modList;
    await user.save();

    return new Response(JSON.stringify({ user: user, modList: modList }), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch work list by user", { status: 500 })
  }
}