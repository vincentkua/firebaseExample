import { useEffect, useRef, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
} from "@firebase/firestore";

interface Message {
  id: string;
  message: string;
}

const CrudWithFirestore = () => {
  const [messageList, setMessageList] = useState<Message[]>([
    { id: "-", message: "-" },
  ]);
  const messageRef = useRef<HTMLInputElement | null>(null);
  const idRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLInputElement | null>(null);
  const ref = collection(db, "messages");

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageRef.current) {
      let data = {
        message: messageRef.current.value,
      };
      try {
        await addDoc(ref, data);
        alert("New Data Added");
        getData();
        messageRef.current.value = "";
      } catch (error) {
        console.log(error);
      }
    }
  };

  const clearData = () => {
    setMessageList([]);
  };

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "messages"));
      let newMessage: Message[] = [];
      querySnapshot.forEach((doc) => {
        newMessage.push({
          id: doc.id,
          message: doc.data().message,
        });
      });
      setMessageList(newMessage);
    } catch (error: any) {
      alert(`Failed to get data: ${error.message}`);
    }
  };

  const setData = async () => {
    if (idRef.current && textRef.current) {
      let data = {
        message: textRef.current.value,
      };
      try {
        await setDoc(doc(db, "messages", idRef.current.value), data);
        alert("Data set completed");
        getData();
      } catch (error) {
        alert(error);
      }
    }
  };

  const deleteData = async (idToDelete: string) => {
    try {
      await deleteDoc(doc(db, "messages", idToDelete));
      alert("Data Deleted");
      getData();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div>
        <h3>addDoc</h3>
        <form onSubmit={handleSave}>
          <input type="text" ref={messageRef} />
          <button type="submit">addDoc</button>
        </form>
      </div>

      <br />
      <br />

      <div>
        <h3 style={{ display: "inline" }}>getDoc and deleteData</h3>
        <p>
          &gt; firestore data was preloaded using useEffect, click Clear
          useState button before test the Get Data function
        </p>
        <button onClick={clearData}>Clear useState</button>
        <button style={{ marginLeft: "15px" }} onClick={getData}>
          Get Data
        </button>
        <br />
        <br />
        <table>
          <thead>
            <tr style={{ textAlign: "left", backgroundColor: "lightgray" }}>
              <th>ID</th>
              <th>Object</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messageList.map((x) => (
              <tr key={x.id}>
                <td>{x.id}</td>
                <td>{x.message}</td>
                <td>
                  <span
                    style={{
                      color: "red",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => deleteData(x.id)}
                  >
                    deleteDoc
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      </div>

      <div>
        <h3>setDoc</h3>
        <span>ID:</span> <input type="text" ref={idRef} />
        <br />
        <span>Text:</span> <input type="text" ref={textRef} />
        <br />
        <br />
        <button onClick={setData}>setDoc</button>
        <button onClick={() => deleteData(idRef.current?.value || "")}>
          deleteDoc
        </button>
      </div>
    </div>
  );
};

export default CrudWithFirestore;
