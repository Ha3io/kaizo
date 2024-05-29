import { connectToDB } from "@mongodb/database";
import { writeFile } from "fs/promises"
import Mod from "@models/Mod";

export async function POST (req) {
  try {
    /* Connect to MongoDB */
    await connectToDB()

    const data = await req.formData()

    /* Extract info from the data */
    const creator = data.get("creator")
    const category = data.get("category")
    const title = data.get("title")
    const description = data.get("description")
    const price = data.get("price")
    const downloads = data.get("downloads")
    
    const photos = data.getAll("modPhotoPaths")

    const modPhotoPaths = []

    /* Process and store each photo  */
    for (const photo of photos) {
      // Read the photo as an ArrayBuffer
      const bytes = await photo.arrayBuffer()

      // Convert it to a Buffer
      const buffer = Buffer.from(bytes)

      // Define the destination path for the uploaded file
      const modImagePath = `C:/Users/09397/Desktop/kaizo/public/uploads/${photo.name}`

      // Write the buffer to the filessystem
      await writeFile(modImagePath, buffer)

      // Store the file path in an array
      modPhotoPaths.push(`/uploads/${photo.name}`)
    }
    /* Create a new Mod */
    const newMod = new Mod({
      creator, category, title, description, price, downloads, modPhotoPaths
    })
    await newMod.save();
    return new Response(JSON.stringify(newMod), { status: 200 })
  }
  catch (err) {
    console.log(err)
    return new Response("Failed to create a new Mod", { status: 500 })
  }
}
