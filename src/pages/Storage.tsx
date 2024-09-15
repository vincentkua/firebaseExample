import { useEffect, useState } from "react";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 } from "uuid";

interface ImageItem {
  url: string;
  filepath: string;
}

const Storage = () => {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const StorageRef = ref(storage, "image/");

  const uploadimg = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `image/${imageUpload.name + "aaa"}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      alert("Image Uploaded...");
      console.log(snapshot);
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [
          ...prev,
          { url, filepath: snapshot.ref.fullPath },
        ]);
      });
    });
  };

  const uploadwithprogress = () => {
    if (imageUpload == null) return;
    setUploadProgress(0);
    const imageRef = ref(storage, `image/${imageUpload.name}`);
    const uploadTask = uploadBytesResumable(imageRef, imageUpload);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          alert("Upload Completed");
          console.log("File available at", downloadURL);
          setImageList((prev) => [
            ...prev,
            { url: downloadURL, filepath: uploadTask.snapshot.ref.fullPath },
          ]);
        });
      }
    );
  };

  useEffect(() => {
    renderStorageList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStorageList = () => {
    listAll(StorageRef).then((res) => {
      console.log(res);
      const promises = res.items.map((item) =>
        getDownloadURL(item).then((url) => ({ url, filepath: item.fullPath }))
      );
      // Use Promise.all to wait for all getDownloadURL calls to resolve
      Promise.all(promises).then((newImageList) => {
        setImageList(newImageList); // Set state with the complete list at once
      });
    });
  };

  const deletefile = (filepath: string) => {
    const filebasePathRef = ref(storage, filepath);
    // Delete the file
    deleteObject(filebasePathRef)
      .then(() => {
        // File deleted successfully
        alert("File Deleted");
        renderStorageList();
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        alert(error);
      });
  };

  return (
    <div style={{ padding: "10px" }}>
      <h3>Firebase Storage Upload</h3>
      <br />
      <input
        type="file"
        onChange={(e) => setImageUpload(e.target.files?.[0] || null)}
      />
      <br />
      <br />

      <button onClick={uploadimg}>Simple Upload</button>
      <br />
      <br />

      <button onClick={uploadwithprogress}>Upload With Progress</button>
      <span> Progress: {uploadProgress}% </span>
      <br />
      <br />

      <h3>Files Uploaded</h3>
      <ul>
        {imageList.map((item) => (
          <li key={v4()}>
            {/* v4 to simulate key only */}
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.filepath}
            </a>
            <button
              onClick={() => deletefile(item.filepath)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <br />
      <br />
      <br />
    </div>
  );
};

export default Storage;
