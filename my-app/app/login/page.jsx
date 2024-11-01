"use client";
import { useEffect, useRef, useState } from "react";
import { account, databases, ID, storage } from "../appwrite/appwrite";
import { addDoc, updateDoc } from "../appwrite/databaseFunction";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { login, logout, loginWithGoogle, register } from "./auth";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [listFile, setListFiles] = useState([]);
  const router = useRouter();
  const [file, setFile] = useState();
  const [progresspercent, setProgresspercent] = useState(0);
  const fileId = useRef("");
  const { toast } = useToast();
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const checkLogin = async () => {
    setLoggedInUser(await account.get());
    /*if (await account.get()) {
      router.push("/dashboard");
    } */
  };
  useEffect(() => {
    if (progresspercent == 100) {
      setTimeout(() => {
        toast({
          title: "Uploaded!",
        });
        setProgresspercent(0);
        // setUploadLoaded(false);
        //submitSpeech()
      }, 500);
    }
  }, [progresspercent]);
  useEffect(() => {
    checkLogin();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    uploadFile(file);
  }
  /*const uploadFile = async (file) => {
    const result = await storage.createFile(
      "67225954001822e6e440", // bucketId
      loggedInUser.$id, // fileId
      file
    );

    console.log(result);
  };*/
  const uploadFile = async (file) => {
    // Créez un nouvel XMLHttpRequest
    const xhr = new XMLHttpRequest();
    fileId.current = ID.unique();
    // Configurez l'URL et la méthode
    xhr.open(
      "POST",
      `https://cloud.appwrite.io/v1/storage/buckets/67225954001822e6e440/files`,
      true
    );
    xhr.setRequestHeader("X-Appwrite-Project", "67224b080010c36860d8");

    // Ajoutez un écouteur de progression
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(`Progression : ${percentComplete.toFixed(2)}%`);
        // Mettez à jour ici votre barre de progression dans l'UI
        setProgresspercent(Number(percentComplete));
        if (progresspercent == 100) {
          //setChange(!changed);
          console.log("upload finished");
        }
      }
    });

    // Ajoutez un écouteur pour vérifier la fin de l'upload
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("Fichier uploadé avec succès", xhr.response);
        getFileUrl(fileId.current);
      } else {
        console.error("Erreur pendant l'upload", xhr.responseText);
      }
    };

    // Créez un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileId", fileId.current);

    // Envoyez la requête
    xhr.send(formData);
  };

  const listFiles = async () => {
    const result = await storage.listFiles(
      "67225954001822e6e440" // bucketId
    );

    console.log(result);
    setListFiles(result.files);
  };
  const getFileUrl = (fileid) => {
    const result = storage.getFileView(
      "67225954001822e6e440", // bucketId
      fileid // fileId
    );

    console.log(result.href);
  };

  if (loggedInUser) {
    return (
      <div className="grid gap-4">
        <p>Logged in as {loggedInUser.name}</p>
        <p>id {loggedInUser.$id}</p>
        <p>email {loggedInUser.email}</p>
        <Progress value={progresspercent} className="w-[60%]" />
        <form onSubmit={handleSubmit}>
          <h1>React File Upload</h1>
          <input type="file" onChange={handleChange} />
          <button type="submit">Upload</button>
        </form>
        <button
          type="button"
          onClick={() => {
            logout();
            setLoggedInUser(null);
          }}
        >
          Logout
        </button>
        <Button onClick={() => addDoc(loggedInUser.$id)}>
          add data to database
        </Button>
        <Button onClick={() => updateDoc(loggedInUser.$id)}>
          update data to database
        </Button>
        <Button onClick={() => getFileUrl()}>get url</Button>
        <Button onClick={() => listFiles()}>list File</Button>
        {listFile && (
          <ul>
            {listFile.map((file) => (
              <li key={file.$id}>
                <strong>Nom :</strong> {file.name}
                <br />
                <strong>Date de création :</strong>{" "}
                {new Date(file.$createdAt).toISOString().slice(0, 10)}
                <br />
                <strong>Taille :</strong>{" "}
                {(file.sizeOriginal / 1048576).toFixed(3)} Mo
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div>
      <Button onClick={loginWithGoogle}>Login google</Button>
      <p>Not logged in</p>
      <button
        onClick={() => {
          logout();
          setLoggedInUser(null);
        }}
      >
        logout
      </button>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="button" onClick={() => login(email, password)}>
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            register(email, password, name);
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};
function MyFileList({ data }) {
  return (
    <ul>
      {data.map((file) => (
        <li key={file.id}>
          <strong>Nom :</strong> {file.name}
          <br />
          <strong>Date de création :</strong>{" "}
          {new Date(file.createdAt).toLocaleDateString()}
          <br />
          <strong>Taille :</strong> {file.sizeOriginal / 1048576} Mo
        </li>
      ))}
    </ul>
  );
}
export default LoginPage;
