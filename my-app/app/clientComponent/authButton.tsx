"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderIcon } from "lucide-react";
import { SelectIcon } from "@radix-ui/react-select";

import { Input } from "@/components/ui/input";
import { loginWithGoogle } from "../login/auth";
import { account, ID } from "../appwrite/appwrite";
import { useToast } from "@/hooks/use-toast";
interface ChildProps {
  buttonColor: string;
  text: string;
  textColor: string;
}
const AuthButton: React.FC<ChildProps> = ({ buttonColor, text, textColor }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const login = async (email: string, password: string) => {
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
  const register = async (email: string, password: string, name: string) => {
    let uid = ID.unique();
    try {
      const result = await account.create(uid, email, password, name);
      console.log(result.$createdAt);

      //add userAccount detail
      //addUserAccount(uid);
      await login(email, password);
    } catch (error) {
      setIsLoginLoading(false);
      toast({
        variant: "destructive",
        title: `${error}`,
      });
    }
  };
  const handleSubmitRegister = (e: any) => {
    e.preventDefault();
    if (password == repassword) {
      setIsLoginLoading(true);
      register(email, password, ID.unique());
    } else {
      toast({
        variant: "destructive",
        title: "password must be identique",
      });
    }
  };
  return (
    <div>
      {" "}
      <Button
        size="lg"
        className="w-full my-5 md:mt-[100px]  hover:bg-amber-500"
        onClick={loginWithGoogle}
        style={{ background: buttonColor }}
      >
        <FcGoogle className="mx-3 " />
        <p style={{ color: textColor }}>{text}</p>
      </Button>
      <p className="text-center text-gray-400">___Or___</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-gray-600 font-bold">
            Start with email and password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Get started </DialogTitle>
            <DialogDescription>
              Get started with email and password
            </DialogDescription>
          </DialogHeader>

          <form className=" space-y-4" onSubmit={handleSubmitRegister}>
            {" "}
            <div className="p-2">
              <label className="block text-sm font-medium mb-1">Email</label>
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
              <label className="block text-sm font-medium mb-1">Password</label>
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
                Re-type Password
              </label>
              <Input
                type="password"
                placeholder="Re-type your password"
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AuthButton;
