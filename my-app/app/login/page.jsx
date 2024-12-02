"use client";
import { useEffect, useRef, useState } from "react";
import { account, databases, ID } from "../appwrite/appwrite";
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
import { useToast } from "@/hooks/use-toast";
import { LoaderIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import logo from "../../public/logo.jpg";
import Image from "next/image";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
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
    try {
      const session = await account.createEmailPasswordSession(email, password);
      console.log(session);
      if (session.providerUid) {
        router.push("/dashboard");
      }
    } catch (error) {
      setIsLoginLoading(false);
      toast({
        variant: "destructive",
        title: `${error}`,
      });
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await account.create(ID.unique(), email, password, name);
      console.log(result.$createdAt);

      //add userAccount detail
      await login(email, password);
    } catch (error) {
      setIsLoginLoading(false);
      toast({
        variant: "destructive",
        title: `${error}`,
      });
    }
  };
  const handleSubmitLogin = (e) => {
    e.preventDefault();

    setIsLoginLoading(true);
    login(email, password);
  };
  const handleSubmitRegister = (e) => {
    e.preventDefault();
    if (password == repassword) {
      setIsLoginLoading(true);
      register(email, password, ID.unique());
    } else {
      toast({
        variant: "destructive",
        title: "password must be identique!",
      });
    }
  };
  return (
    <div className="bg-gray-100">
      {" "}
      <br />
      <br />
      <div className="flex justify-center">
        <div className="grid gap-3">
          <div className="flex justify-center">
            <Image
              src={logo}
              alt="logo"
              className="size-[40px] md:size-[50px] rounded-full"
            />{" "}
          </div>

          <p className="text-2xl text-amber-500 text-center ">Audiscribe AI</p>
        </div>
      </div>
      <div className="flex items-center justify-center min-h-screen  p-5">
        <div className="w-full max-w-md p-6 space-y-4 bg-white shadow-md rounded-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="createAccount">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-center">Login</h2>
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
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="p-2">
                        <label className="block text-sm font-medium mb-1">
                          Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-500"
                      >
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
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="p-2">
                        <label className="block text-sm font-medium mb-1">
                          Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="p-2">
                        <label className="block text-sm font-medium mb-1">
                          Re-type password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={repassword}
                          onChange={(e) => setRePassword(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-500"
                      >
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
