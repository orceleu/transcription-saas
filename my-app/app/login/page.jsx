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

  const checkLogin = async () => {
    try {
      setLoggedInUser(await account.get());
      if (await account.get()) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);
  const login = async (email, password) => {
    const session = await account.createEmailPasswordSession(email, password);
    setLoggedInUser(await account.get());
  };

  const register = async (email, password, name) => {
    await account.create(ID.unique(), email, password, name);
    //add userAccount detail
    await login(email, password);
  };
  const logout = async () => {
    await account.deleteSession("current");
    setLoggedInUser(null);
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 space-y-4 bg-white shadow-md rounded-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="createAccount">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-center">Connexion</h2>
              <Button
                onClick={() => {
                  loginWithGoogle();

                  //setIsLoginLoading(!isLoginLoading);
                }}
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <FcGoogle />
                  Login google
                </div>
              </Button>
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
                    <div className=" space-y-4">
                      <div>
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
                      <div>
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

                      <Button
                        type="button"
                        className="w-full mt-4"
                        onClick={() => {
                          setIsLoginLoading(true);
                          login(email, password);
                        }}
                      >
                        {isLoginLoading ? (
                          <>
                            <LoaderIcon className="animate-spin" />
                          </>
                        ) : (
                          <p>Register</p>
                        )}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="createAccount">
              <p>register</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
