import { Client, Account, OAuthProvider, Databases, Storage } from "appwrite";
const client = new Client();
const databases = new Databases(client);
const storage = new Storage(client);
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67224b080010c36860d8"); // Replace with your project ID

export const account = new Account(client);
export { ID } from "appwrite";
export { OAuthProvider, databases, storage };
