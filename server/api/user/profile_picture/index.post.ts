import { auth } from "~/server/auth"
import fs from "fs"
import path from "node:path"

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  const session = await auth.api.getSession({ headers: event.headers })

  const allowedTypes = ["image/jpeg", "image/png"]

  const MAX_FILE_SIZE = 256 * 1024

  const form = await readMultipartFormData(event)
  const file = form?.find((x) => x.name === "file")
  const filePath = path.join(
    config.UPLOAD_DIR || "public/uploads", 
    file?.filename || "upload"
  )
  if (!file) return (setResponseStatus(event, 400), { error: "No file" })
  if (!file.data?.length) return (setResponseStatus(event, 400), { error: "Empty upload" })
  if (file.data.length > MAX_FILE_SIZE) return (setResponseStatus(event, 400), { error: "File too big" })
  if (!file.type || !allowedTypes.includes(file.type)) {
    setResponseStatus(event, 400)
    return { error: `File type ${file.type || "unknown"} not allowed` }
  }

  const safeOriginalName = (file.filename || "upload").replace(/[^\w.\-]/g, "_") 

  // this removes characters that can exec/escape stuff or stuff that doesn't belong in filenames
  const key = `/${Date.now()}-${safeOriginalName}`

  const fileStream = fs.createReadStream(filePath)
  fs.writeFileSync(filePath, file.data)

  const fileUrl = path.join( // public should not be shown during dev, but this is going to be the same in prod!
    config.UPLOAD_DIR || "uploads", 
    file?.filename || "upload"
  )

  return { fileUrl: fileUrl }
})
