import app from "../config/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage(app, "gs://pahana-edu.firebasestorage.app");

const mediaUpload = async (file) => {
  if (!file) {
    return Promise.reject(new Error("No file provided"));
  }

  const storageRef = ref(storage, `media/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Uploaded a blob or file!", snapshot);

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    return Promise.reject(error);
  }
};

export default mediaUpload;
