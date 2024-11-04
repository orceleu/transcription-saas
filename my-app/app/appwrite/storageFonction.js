import { storage } from "./appwrite";

const BUCKET_ID = "67225954001822e6e440";
const deleteFileItem = async (fileId) => {
  const result = await storage.deleteFile(
    BUCKET_ID, // bucketId
    fileId // fileId
  );
  console.log(result);
};
const getFileUrl = (fileid) => {
  const result = storage.getFileView(
    BUCKET_ID, // bucketId
    fileid // fileId
  );
  return result.href;
};
export { getFileUrl, deleteFileItem };
