

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  console.log("TODO: Refactor the profile picture url to be something nginx can handle") // TODO: Refactor the profile picture url to be something nginx can handle
  const allowedTypes = ["image/jpeg", "image/png"];
  const storage = useStorage("uploads");
  const MAX_FILE_SIZE = 256 * 1024; // 256kb

  const form = await readMultipartFormData(event);

  const file = form?.find((x) => x.name === "file");

  if (!file) {
    setResponseStatus(event, 400);
    return { error: "No file" };
  }

  
  console.log("Filename:", file.filename);
  console.log("Filesize:", file.data?.length);
  console.log("Type:", file.type);

  if (!file.data || file.data.length === 0) {
    setResponseStatus(event, 400);
    return { error: "Empty upload" };
  }

  if (file.data.length > MAX_FILE_SIZE) {
    setResponseStatus(event, 400);
    return { error: "File too big" };
  }

  if (!file.type || !allowedTypes.includes(file.type)) {
    setResponseStatus(event, 400);
    return {
      error: `File type ${file.type || "unknown"} not allowed. Allowed types: ${allowedTypes.join(", ")}`
    };
  }
  const safeOriginalName = (file.filename || "upload").replace(/[^\w.\-]/g, "_");
  const fileName = `${Date.now()}-${safeOriginalName}`;
  await storage.setItemRaw(fileName, file.data);
  const fileUrl = `/uploads/${fileName}`;
  return { fileUrl };

});
