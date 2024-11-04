import { account, ID, OAuthProvider } from "../appwrite/appwrite";

const login = async (email, password) => {
  const session = await account.createEmailPasswordSession(email, password);
  //setLoggedInUser(await account.get());
};

const register = async (email, password, name) => {
  await account.create(ID.unique(), email, password, name);
  login(email, password);
};
const logout = async () => {
  await account.deleteSession("current");
  //setLoggedInUser(null);
};
const loginWithGoogle = () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      "http://localhost:3000/dashboard"
    );
  } catch (error) {
    console.error(error);
  }
};

export { login, register, loginWithGoogle, logout };
