import { Schema, model, models } from "mongoose"

const InstallSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  modId: {
    type: Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})  

const Install = models.Install || model("Install", InstallSchema)
export default Install