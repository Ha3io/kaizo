import Mod from "@models/Mod";
import User from "@models/User";

import { connectToDB } from "@mongodb/database";

export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();
    
    const userId = params.id;
    const modId = params.modId;

    const user = await User.findById(userId);
    const mod = await Mod.findById(modId).populate("creator");

    const favoriteMod = user.wishlist.find((item) => item._id.toString() === modId)
    console.log(favoriteMod);
    if (favoriteMod) {
      user.wishlist = user.wishlist.filter((item) => item._id.toString() !== modId);
      await user.save()
      return new Response(JSON.stringify({ message: "Mod removed from wishlist", wishlist: user.wishlist }), { status: 200 });
    } else {
      user.wishlist.push(mod);
      await user.save()
      return new Response(JSON.stringify({ message: "Mod added to wishlist", wishlist: user.wishlist }), { status: 200 });
    }
  } catch (err) {
    console.log(err)
    return new Response("Failed to patch mod to wishlist", { status: 500 })
  }
}
