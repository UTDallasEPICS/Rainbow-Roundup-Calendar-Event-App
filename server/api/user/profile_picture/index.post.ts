import { auth } from "~/server/auth"
import fs from "fs"
import path from "node:path"

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  const session = await auth.api.getSession({ headers: event.headers })
  if(!session){
    setResponseStatus(event, 400);
    return { error: `Please login` };
  }
  const allowedTypes = ["image/jpeg", "image/png"]

  const MAX_FILE_SIZE = 256 * 1024

  const form = await readMultipartFormData(event)
  const file = form?.find((x) => x.name === "file")
  const fileDir = path.join(
    config.UPLOAD_DIR || "public/uploads", 
    session.user.id
  )

  if (!fs.existsSync(fileDir)) { // Create user directory if it does not exist
    fs.mkdirSync(fileDir);
  }
  if (!file) return (setResponseStatus(event, 400), { error: "No file" })
  if (!file.data?.length) return (setResponseStatus(event, 400), { error: "Empty upload" })
  if (file.data.length > MAX_FILE_SIZE) return (setResponseStatus(event, 400), { error: "File too big" })
  if (!file.type || !allowedTypes.includes(file.type)) {
    setResponseStatus(event, 400)
    return { error: `File type ${file.type || "unknown"} not allowed` }
  }

  const safeOriginalName = (file.filename || "upload").replace(/[^\w.\-]/g, "_") 


  const key = "/profile" // I figured doing this we can ensure there is only one profile picture per user. Browsers can render without extension
  const filePath = path.join(
          fileDir,
          key
      )
  fs.writeFileSync(filePath, file.data)

  const fileUrl = path.join( // public should not be shown during dev, but this is going to be the same in prod!
    (process.env.NUXT_NODE_ENV == "dev") ? "uploads" : config.UPLOAD_DIR,
    session.user.id,
    key
  )

  return { fileUrl: fileUrl }
})
