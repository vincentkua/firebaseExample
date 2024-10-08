import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Auth = () => {
  const [user, setUser] = useState<User | null>(null); // Type is User or null
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [signinEmail, setSigninEmail] = useState<string>("");
  const [signinPassword, setSigninPassword] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // currentUser can be null, so we allow that in the state
    });
    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  const addUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newEmail,
        newPassword
      );
      console.log(userCredential);
      alert("New User Created!!!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      alert("Sign Out Successfully!!!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signinEmail,
        signinPassword
      );
      console.log(userCredential);
      alert("Sign In Successful!!!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <h3>Current User</h3>
      <span>{user ? user.email : "Not Logged In"} </span>
      <button onClick={signOutUser}>Signout</button>

      <h3>Create User</h3>
      <input
        type="text"
        placeholder="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={addUser}>Add User</button>

      <h3>Signin User</h3>
      <input
        type="text"
        placeholder="email"
        value={signinEmail}
        onChange={(e) => setSigninEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={signinPassword}
        onChange={(e) => setSigninPassword(e.target.value)}
      />
      <button onClick={signIn}>Sign In</button>
    </div>
  );
};

export default Auth;
