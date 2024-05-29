import Install from "@models/Install";
import Mod from "@models/Mod";
import { connectToDB } from "@mongodb/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const mod = await Mod.findById(params.id).populate("creator");

    if (!mod) return new Response("The Mod Not Found", { status: 404 });

    return new Response(JSON.stringify(mod), { status: 200 });
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();

    const data = await req.formData();

    /* Extract info from the data */
    const creator = data.get("creator");
    const category = data.get("category");
    const title = data.get("title");
    const description = data.get("description");
    const price = data.get("price");
    const downloads = data.get("downloads");
    /* Get an array of uploaded photos */
    const photos = data.getAll("modPhotoPaths");

    const modPhotoPaths = [];

    /* Process and store each photo  */
    for (const photo of photos) {
      if (photo instanceof Object) {
        // Read the photo as an ArrayBuffer
        const bytes = await photo.arrayBuffer();

        // Convert it to a Buffer
        const buffer = Buffer.from(bytes);

        // Define the destination path for the uploaded file
        const modImagePath = `C:/Users/09397/Desktop/kaizo/public/uploads/${photo.name}`;

        // Write the buffer to the filessystem
        await writeFile(modImagePath, buffer);

        // Store the file path in an array
        modPhotoPaths.push(`/uploads/${photo.name}`);
      } else {
        // If it's an old photo
        modPhotoPaths.push(photo);
      }
    }

    /* Find the existing Mod */
    const existingMod = await Mod.findById(params.id)

    if (!existingMod) {
      return new Response("The Mod Not Found", { status: 404 });
    }

    /* Update the Mod with the new data */
    existingMod.category = category
    existingMod.title = title
    existingMod.description = description
    existingMod.price = price
    existingMod.modPhotoPaths = modPhotoPaths
    existingMod.downloads = downloads
    await existingMod.save()

    return new Response("Successfully updated the Mod", { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response("Error updating the Mod", { status: 500 })
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB()
    await Mod.findByIdAndDelete(params.id)
    await Install.deleteMany({ modId: params.id }); 
    
    return new Response("Successfully deleted the Mod", { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response("Error deleting the Mod", { status: 500 })
  }
}