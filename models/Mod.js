import { Schema, model, models } from "mongoose"

const ModSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  category: {
    type: String,
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  downloads: { 
    type: Number
  },
  price: {
    type: Number
  },
  modPhotoPaths: [{type: String}]
})

const Mod = models.Mod || model("Mod", ModSchema)
export default Mod