import { databases, ID } from "./appwrite";
import { Permission, Query, Role } from "appwrite";
const DATABASE_ID = "6722601a0008810208ab";
const USER_ACCOUNT_COLLECTION_ID = "6726475d0002a67892f2";
const USER_DATA_COLLECTION_ID = "67264810000766295f35";
const addUserAccount = async (documentId) => {
  const promise = databases.createDocument(
    DATABASE_ID,
    USER_ACCOUNT_COLLECTION_ID,
    documentId,
    {
      isPro: false,
      Time: 1200,
      stripeSubscriptionId: "",
      stripeCustomerId: "",
    },
    [
      Permission.write(Role.any()),
      Permission.read(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any()),
    ]
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
const getDocument = async (documentId) => {
  try {
    const result = await databases.getDocument(
      DATABASE_ID, // databaseId
      USER_ACCOUNT_COLLECTION_ID, // collectionId
      documentId // documentId
    );

    return {
      isPro: result.isPro,
      Time: result.Time,
      stripeSubscriptionId: result.stripeSubscriptionId,
      stripeCustomerId: result.stripeCustomerId,
    };
  } catch (error) {
    return {
      error: "error",
    };
  }
};

const updateUsedTime = async (documentId, usedTime) => {
  const result = await databases.updateDocument(
    DATABASE_ID, // databaseId
    USER_ACCOUNT_COLLECTION_ID, // collectionId
    documentId, // documentId
    {
      Time: usedTime,
    }
  );
  console.log(result);
};

const addUserData = async (
  uniqueId,
  userId,
  historicsData,
  requestId,
  associedFileName,
  type,
  size
) => {
  const promise = databases.createDocument(
    DATABASE_ID,
    USER_DATA_COLLECTION_ID,
    uniqueId,

    {
      userId: userId,
      historic: historicsData,
      requestId: requestId,
      associedFileName: associedFileName,
      type: type,
      size: size,
    },
    [
      Permission.write(Role.any()),
      Permission.read(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any()),
    ]
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
const deleteItemUserData = async (documentId) => {
  const result = await databases.deleteDocument(
    DATABASE_ID,
    USER_DATA_COLLECTION_ID,
    documentId // documentId
  );

  return result;
};
const listUserData = async (userId) => {
  const result = await databases.listDocuments(
    DATABASE_ID,
    USER_DATA_COLLECTION_ID,
    [Query.contains("userId", userId)]
  );
  return result;
};

export {
  addUserAccount,
  addUserData,
  updateUsedTime,
  listUserData,
  deleteItemUserData,
  getDocument,
};
/*


1 collection qui recois les webhook stripe avec comme accesKey l'userID,(collection avec userID)

controle de l'user-----
--creation des la premiere enregistrement--- ispro false
{
isPro,
usedProTime,
usedFreeTime
}

1 collection pour l'historique cree avec ID.unique(),(pouvant s'associer avec un files dans storage),mapper ,Query en fonction de l'userID

donnees de l'user-------

{
userId,
historic,
associedFileName,
associedFileSize
}

*/
