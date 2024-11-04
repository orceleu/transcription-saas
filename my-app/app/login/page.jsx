"use client";
import { useEffect, useRef, useState } from "react";
import { account, databases, ID, storage } from "../appwrite/appwrite";
import { AppwriteException, Permission, Query, Role } from "appwrite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loginWithGoogle } from "./auth";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getURL } from "next/dist/shared/lib/utils";
import { LoaderIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [listFile, setListFiles] = useState([]);
  const [userData, setUserData] = useState([]);
  const router = useRouter();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const fileId = useRef("");
  const { toast } = useToast();
  const getUser = async () => {
    if (await account.get()) {
      router.push("/dashboard");
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  const login = async (email, password) => {
    const session = await account.createEmailPasswordSession(email, password);
    console.log(session);
    if (session.providerUid) {
      router.push("/dashboard");
    } else {
      console.log(session);
    }
  };

  const register = async (email, password, name) => {
    const result = await account.create(ID.unique(), email, password, name);
    console.log(result);

    //add userAccount detail
    await login(email, password);
  };
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    login(email, password);
  };
  const handleSubmitRegister = (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    register(email, password, name);
  };
  return (
    <div className="bg-gray-100">
      {" "}
      <br />
      <br />
      <p className="text-2xl text-amber-500 text-center ">Audiscribe AI</p>
      <div className="flex items-center justify-center min-h-screen  p-5">
        <div className="w-full max-w-md p-6 space-y-4 bg-white shadow-md rounded-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="createAccount">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-center">Connexion</h2>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    loginWithGoogle();

                    //setIsLoginLoading(!isLoginLoading);
                  }}
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <FcGoogle />
                    Login with Google
                  </div>
                </Button>
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <p className="text-gray-500">____</p>
                  <p className="text-gray-500">Or</p>
                  <p className="text-gray-500">____</p>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Login with email and password
                  </AccordionTrigger>
                  <AccordionContent>
                    <form className=" space-y-4" onSubmit={handleSubmitLogin}>
                      <div className="p-2">
                        <label className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="Entrez votre email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="p-2">
                        <label className="block text-sm font-medium mb-1">
                          Mot de passe
                        </label>
                        <Input
                          type="password"
                          placeholder="Entrez votre mot de passe"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full mt-4">
                        {isLoginLoading ? (
                          <>
                            <LoaderIcon className="animate-spin" />
                          </>
                        ) : (
                          <p>Login</p>
                        )}
                      </Button>
                    </form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="createAccount" className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-center">Create Account</h2>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    loginWithGoogle();

                    //setIsLoginLoading(!isLoginLoading);
                  }}
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <FcGoogle />
                    Register with Google
                  </div>
                </Button>
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <p className="text-gray-500">____</p>
                  <p className="text-gray-500">Or</p>
                  <p className="text-gray-500">____</p>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Register with email and password
                  </AccordionTrigger>
                  <AccordionContent>
                    <form
                      className=" space-y-4"
                      onSubmit={handleSubmitRegister}
                    >
                      {" "}
                      <div className="p-2">
                        <label className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="p-2">
                        <label className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="Entrez votre email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="p-2">
                        <label className="block text-sm font-medium mb-1">
                          Mot de passe
                        </label>
                        <Input
                          type="password"
                          placeholder="Entrez votre mot de passe"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full mt-4">
                        {isLoginLoading ? (
                          <>
                            <LoaderIcon className="animate-spin" />
                          </>
                        ) : (
                          <p>Register</p>
                        )}
                      </Button>
                    </form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
