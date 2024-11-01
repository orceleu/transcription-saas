import { databases } from "./appwrite";
const DATABASE_ID = "6722601a0008810208ab";
const COLLETION_ID = "672260660021672e0fa6";
const addDoc = async (documentId) => {
  const promise = databases.createDocument(
    DATABASE_ID,
    COLLETION_ID,
    documentId,
    {
      userId: documentId,
      isPro: true,
    }
  );

  promise.then(
    function (response) {
      console.log(response);
    },
    function (error) {
      console.log(error);
    }
  );
};
const updateDoc = async (documentId) => {
  const result = await databases.updateDocument(
    DATABASE_ID, // databaseId
    COLLETION_ID, // collectionId
    documentId, // documentId
    {
      isPro: false,
    } // data (optional)
  );
  console.log(result);
};

export { addDoc, updateDoc };
