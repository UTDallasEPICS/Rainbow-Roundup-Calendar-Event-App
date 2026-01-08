import { auth } from "~/server/auth"

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })

  const allowedTypes = ["image/jpeg", "image/png"]
  const storage = useStorage("uploads")
  const MAX_FILE_SIZE = 256 * 1024

  const form = await readMultipartFormData(event)
  const file = form?.find((x) => x.name === "file")

  if (!file) return (setResponseStatus(event, 400), { error: "No file" })
  if (!file.data?.length) return (setResponseStatus(event, 400), { error: "Empty upload" })
  if (file.data.length > MAX_FILE_SIZE) return (setResponseStatus(event, 400), { error: "File too big" })
  if (!file.type || !allowedTypes.includes(file.type)) {
    setResponseStatus(event, 400)
    return { error: `File type ${file.type || "unknown"} not allowed` }
  }

  const safeOriginalName = (file.filename || "upload").replace(/[^\w.\-]/g, "_")
  const key = `/${Date.now()}-${safeOriginalName}`

  await storage.setItemRaw(key, file.data)

  return { fileUrl: `/uploads/${key}` }
})
