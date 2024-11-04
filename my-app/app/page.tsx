"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import capturetranscriptionapp from "../public/capture1.jpg";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  FcGoogle,
  FcNegativeDynamic,
  FcSoundRecordingCopyright,
} from "react-icons/fc";
import { auth } from "@/app/firebase/config";
import { useEffect, useState } from "react";
import { IoCloudUpload } from "react-icons/io5";
import { AiOutlineSelect } from "react-icons/ai";
import { SiConvertio } from "react-icons/si";
import { MdDoNotDisturb } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowBigDown,
  Check,
  DeleteIcon,
  EditIcon,
  FileIcon,
  InfinityIcon,
  LanguagesIcon,
  LoaderIcon,
  LogInIcon,
  MagnetIcon,
  MoreHorizontal,
  TextIcon,
  TimerIcon,
  Upload,
  UploadCloud,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import { SelectIcon } from "@radix-ui/react-select";

import { Cloud, CreditCard } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { loginWithGoogle } from "./login/auth";
import { FaToolbox } from "react-icons/fa6";
import { account, ID } from "./appwrite/appwrite";
import { useToast } from "@/hooks/use-toast";
export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
  const handleSubmitRegister = (e: any) => {
    e.preventDefault();
    setIsLoginLoading(true);
    register(email, password, name);
  };

  return (
    <main>
      <div className="fixed top-0  w-full flex justify-between  p-5 bg-zinc-50  rounded-md">
        <p className="text-xl font-semibold">AudiScribe</p>
        <div className="hidden lg:flex items-center gap-5">
          <Button variant="link">Home</Button>
          <a href="#pricing" className="hover:underline">
            Pricing
          </a>
          <a href="#blog" className="hover:underline">
            Blog
          </a>
          <Button onClick={loginWithGoogle}>Login</Button>
          <Button
            variant="outline"
            onClick={() => {
              router.push("/login");
            }}
          >
            Sign up
          </Button>
        </div>
        <div className="lg:hidden flex items-center gap-5">
          <Button
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </Button>{" "}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-3xl ">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>More</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Sign up</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Pricing</span>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TextIcon className="mr-2 h-4 w-4" />
                  <span>Blog</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className=" flex min-h-screen flex-col items-center justify-between p-5 md:p-24">
        <div className="bg-gridline w-full p-10">
          <br />
          <br />
          <br />

          <p className="text-4xl md:text-6xl text-center font-bold">
            <span className="text-amber-700">Audio & video</span> to text
            converter
          </p>

          <div className="flex justify-center">
            <p className="text-center text-gray-600 max-w-[700px] my-10">
              <span className="text-violet-900 font-bold mx-2 underline">
                Fast
              </span>
              ,
              <span className="text-violet-900 font-bold mx-2 underline">
                safe
              </span>
              ,and
              <span className="text-violet-900 font-bold mx-2 underline">
                accurate
              </span>
              . For any language or dialect, no matter the clarity of the audio.
              Just choose your file, press Transcribe, and its complete.
            </p>
          </div>
        </div>

        <div className=" grid gap-5 md:grid-cols-2 w-full my-10 p-5 max-w-[900px] bg-gray-50 rounded-md">
          <p className="text-center">
            <span className="text-2xl">🎯</span> Accuracy 98%
          </p>
          <p className="text-center">
            <span className="text-2xl">🌍</span>100+ language
          </p>
          <p className="text-center">
            <span className="text-2xl">🤯</span>upload 10hours
          </p>
          <p className="text-center">
            <span className="text-2xl">👥</span>speaker recognition
          </p>
          <p className="text-center">
            <span className="text-2xl">🔒</span> private and secure
          </p>
          <p className="text-center">
            <span className="text-2xl">📝</span> edit and export
          </p>
        </div>
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[500px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-amber-100 after:via-amber-300 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-amber-700 before:dark:opacity-10 after:dark:from-amber-900 after:dark:via-[#ffaf01] after:dark:opacity-40 sm:before:w-[580px] sm:after:w-[340px] before:lg:h-[460px]"></div>

        <div className="w-full md:w-[500px] mt-[100px] shadow-md shadow-amber-200 rounded-md p-2">
          <div className="grid gap-2 my-10 p-5 rounded-md border-black border-[1px]">
            <p className="text-center my-4">Upload file to transcribe them</p>
            <Button variant="outline">
              <IoCloudUpload className="mx-3 text-emerald-500" /> Upload audio
              or video
            </Button>
            <p className="text-center text-gray-400">-----or-----</p>
            <Button variant="outline">
              <FcSoundRecordingCopyright className="mx-3" /> Record audio
            </Button>
            <p className="text-center text-gray-400">-----or-----</p>
            <Input placeholder="Youtube link..." />
          </div>
        </div>
        <Button size="lg" className="w-full my-5" onClick={loginWithGoogle}>
          <FcGoogle className="mx-3 " />
          start transcribing for free
        </Button>
        <p className="my-2 text-center text-gray-400">
          3 transcription per month --- No CreditCard required
        </p>
        <div className="grid gap-5 md:gap-10 my-[80px]">
          <div className="grid gap-2">
            <p className="text-3xl text-center">
              Online Transcription Made Easy.
            </p>
            <p className="text-gray-600 text-center">
              All tools you need to transcribe your audio and video file.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-slate-100">
                <LanguagesIcon className="text-blue-300 " />
              </div>
            </div>
            <p className="text-2xl text-center">100+ Languages.</p>
            <p className="text-gray-600 text-center">
              Supporting many languages with the option to translante .
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-slate-100">
                <FileIcon className="text-red-300 " />
              </div>
            </div>
            <p className="text-2xl text-center">Export.</p>
            <p className="text-gray-600 text-center">
              Export your transcriptions in many format (PDF,DOCX,TXT,SRT).
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-slate-100">
                <UploadCloud className="text-lime-300 " />
              </div>
            </div>
            <p className="text-2xl text-center">Upload any format.</p>
            <p className="text-gray-600 text-center">
              Upload files in all popular formats, including MP3, MP4, M4A, MOV,
              AAC, WAV, OGG, OPUS, MPEG, WMA, YouTube, and more.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-slate-100">
                <TimerIcon className="text-amber-300 " />
              </div>
            </div>
            <p className="text-2xl text-center">Get transcribe in Seconds.</p>
            <p className="text-gray-600 text-center">
              Recieve accurate transcriptions within seconds of uploading your
              files.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-slate-100">
                <EditIcon className="text-violet-300 " />
              </div>
            </div>
            <p className="text-2xl text-center">Edit.</p>
            <p className="text-gray-600 text-center">
              Edit your transcribed text.
            </p>
          </div>
        </div>
        <Separator className="my-10" />
        <p className="text-center text-3xl font-bold">
          Simple and Easy to use cloud based AI software.
        </p>

        <p className="text-gray-400 my-5 text-center">
          (no installation needed)
        </p>

        <div className="bg-red-200 p-10 rounded-md my-[100px] w-full max-w-[600px]">
          <div className="grid  gap-3 ">
            <p className="text-center text-3xl font-semibold my-3 underline">
              3 Steps
            </p>
            <div className="p-2 bg-red-100 rounded-md w-full md:w-[500px]">
              <p className="text-center  text-xl font-serif">
                <AiOutlineSelect className="text-emerald-500 mx-3 my-auto" />
                Select.
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-md w-full md:w-[500px]">
              <p className="text-center  text-xl font-serif">
                <IoCloudUpload className="text-emerald-500 mx-3 my-auto" />
                Upload.
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-md w-full md:w-[500px]">
              <p className="text-center  text-xl font-serif">
                <SiConvertio className="text-emerald-500 mx-3 my-auto " />
                Convert
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 md:gap-10 my-10">
          <ArrowBigDown className="size-[50px] md:size-[100px]" />
          <ArrowBigDown className="size-[50px] md:size-[100px]" />
          <ArrowBigDown className="size-[50px] md:size-[100px]" />
          <ArrowBigDown className="size-[50px] md:size-[100px]" />
        </div>

        <div className="flex justify-center">
          <Image
            alt="capture"
            src={capturetranscriptionapp}
            sizes="500"
            className="rounded-md shadow-md shadow-amber-300"
          />
        </div>

        <p className="text-center text-3xl font-bold mt-[200px]" id="pricing">
          Simple and affordable pricing
        </p>
        <p className="text-gray-600 text-center my-2">
          Sign up and start transcribing your first file.
        </p>
        <div className="w-full p-10 my-[100px]  max-w-[700px] bg-slate-900 rounded-md">
          <p className="text-center text-3xl text-white my-2">
            Audiscribe Free
          </p>
          <Separator className="my-2" />
          <div className="flex justify-center">
            <div className="grid gap-2 mt-10">
              <div className="flex items-center gap-3">
                <Check className="text-blue-100" />
                <p className="text-white text-center text-2xl">Free forever</p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-blue-100" />
                <p className="text-white text-center text-2xl">
                  3 transcriptions per month
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-blue-100" />
                <p className="text-white text-center text-2xl">
                  15mb per file uploaded
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Check className="text-blue-100" />
                <p className="text-white text-center text-2xl">
                  access to additionnal tools
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-blue-100" />
                <p className="text-white text-center text-2xl">
                  translation(100+ languages)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-blue-100" />
                <p className="text-white text-center text-2xl">
                  export to PDF,DOCX,TXT,SRT
                </p>
              </div>
              <div className="flex justify-center mt-10">
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-bold"
                    onClick={loginWithGoogle}
                  >
                    <FcGoogle className="mx-3 " /> Get started for free
                  </Button>
                  <p className="text-center text-gray-200">___Or___</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        className="text-gray-200 font-bold"
                      >
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
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
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
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-amber-300 border-[2px] p-10 max-w-[700px] my-10 bg-amber-900 rounded-md">
          <p className="text-center text-3xl text-white my-2">Audiscribe Pro</p>
          <p className="text-center text-blue-100 font-semibold ">(9$/Month)</p>
          <Separator className="my-2" />

          <div className="flex justify-center">
            <div className="grid gap-2 mt-10">
              <div className="flex items-center gap-3">
                <Check className="text-blue-200" />
                <p className="text-white text-center text-2xl">
                  30 hours of transcription/month
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-blue-200" />
                <p className="text-white text-center text-2xl">
                  unlimited request
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-blue-200" />
                <p className="text-white text-center text-2xl">
                  1gb per file uploaded
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Check className="text-blue-200" />
                <p className="text-white text-center text-2xl">
                  access to additionnal tools
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-blue-200" />
                <p className="text-white text-center text-2xl">
                  translation(100+ languages)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-blue-200" />
                <p className="text-white text-center text-2xl">
                  export to PDF,DOCX,TXT,SRT
                </p>
              </div>
              <div className="flex justify-center mt-10">
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-bold"
                    onClick={loginWithGoogle}
                  >
                    <FcGoogle className="mx-3 " /> GO pro now
                  </Button>
                  <p className="text-center text-gray-200">___Or___</p>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        className="text-gray-200 font-bold"
                      >
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
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
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
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center my-10 text-5xl font-bold">Customer review</p>

        <p className="text-center ">
          Rated Excellent 4.8/5 based on 450+ reviews
        </p>
        <Separator className="my-10" />
        <div className="grid md:grid-cols-2  gap-5 md:gap-10 ">
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <div className="flex justify-between my-3 ">
              <p className=" text-xl font-semibold">love this.</p>
              <div className="flex items-center gap-2">
                {" "}
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
              </div>
            </div>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              aliquam enim soluta dolor nam, consequatur illum nobis, asperiores
              perferendis modi repellat! Nobis odio enim adipisci voluptate
              obcaecati incidunt ipsam illo!
            </p>
          </div>
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <div className="flex justify-between my-3 ">
              <p className=" text-xl font-semibold">Great.</p>
              <div className="flex items-center gap-2">
                {" "}
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
              </div>
            </div>
            <p>This transcription service is great!</p>
          </div>{" "}
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <div className="flex justify-between my-3 ">
              <p className=" text-xl font-semibold">Great.</p>
              <div className="flex items-center gap-2">
                {" "}
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
              </div>
            </div>

            <p>GREAT. FAST ACCURATE REASONABLE PRICE</p>
          </div>{" "}
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <div className="flex justify-between my-3 ">
              <p className=" text-xl font-semibold">Best app.</p>
              <div className="flex items-center gap-2">
                {" "}
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
                <StarFilledIcon className="text-yellow-600" />
              </div>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              aliquam enim soluta dolor nam, consequatur illum nobis, asperiores
              perferendis modi repellat! Nobis odio enim adipisci voluptate
              obcaecati incidunt ipsam illo!
            </p>
          </div>{" "}
        </div>
        <p className="text-center my-10 text-5xl font-bold">FAQ</p>
        <Separator className="my-10" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 ">
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <p className="my-3 text-center text-xl font-semibold">
              Who can use AudiScribe?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              aliquam enim soluta dolor nam, consequatur illum nobis, asperiores
              perferendis modi repellat! Nobis odio enim adipisci voluptate
              obcaecati incidunt ipsam illo!
            </p>
          </div>
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <p className="my-3 text-center text-xl font-semibold">
              How many languages its support?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              aliquam enim soluta dolor nam, consequatur illum nobis, asperiores
              perferendis modi repellat! Nobis odio enim adipisci voluptate
              obcaecati incidunt ipsam illo!
            </p>
          </div>{" "}
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <p className="my-3 text-center text-xl font-semibold">
              Is there a free version?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              aliquam enim soluta dolor nam, consequatur illum nobis, asperiores
              perferendis modi repellat! Nobis odio enim adipisci voluptate
              obcaecati incidunt ipsam illo!
            </p>
          </div>{" "}
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <p className="my-3 text-center text-xl font-semibold">
              How many format does Audiscribe support?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              aliquam enim soluta dolor nam, consequatur illum nobis, asperiores
              perferendis modi repellat! Nobis odio enim adipisci voluptate
              obcaecati incidunt ipsam illo!
            </p>
          </div>{" "}
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <p className="my-3 text-center text-xl font-semibold">
              How many format can i export files?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              aliquam enim soluta dolor nam, consequatur illum nobis, asperiores
              perferendis modi repellat! Nobis odio enim adipisci voluptate
              obcaecati incidunt ipsam illo!
            </p>
          </div>{" "}
          <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
            <p className="my-3 text-center text-xl font-semibold">
              Is there additionnal tools?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              aliquam enim soluta dolor nam, consequatur illum nobis, asperiores
              perferendis modi repellat! Nobis odio enim adipisci voluptate
              obcaecati incidunt ipsam illo!
            </p>
          </div>
        </div>
        <p className="text-3xl font-bold my-10" id="blog">
          Blog
        </p>
        <div className="grid gap-3 sm:p-5">
          <Button
            variant="link"
            className="text-blue-500"
            onClick={() => {
              router.push(
                "/blog/deux-outils-indispensable-pour-les-etudiants-en-2024"
              );
            }}
          >
            Deux outils indispensable pour les etudiants en 2024.
          </Button>
          <Button variant="link" className="text-blue-500">
            comment mieux reviser et optimiser ses etudes?
          </Button>
          <Button variant="link" className="text-blue-500">
            Pourquoi les etudiants
          </Button>
          <Button variant="link" className="text-blue-500">
            Pourquoi les etudiants
          </Button>
        </div>
        <Separator className="my-10" />
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-10 bg-slate-800">
        <div className="grid gap-3">
          <p className="text-center text-white text-2xl font-bold">Tools</p>
          <Separator className="my-5" />
          <Button variant="link" className="text-white">
            {" "}
            Audio to text converter
          </Button>
          <Button variant="link" className="text-white">
            {" "}
            Video to text converter
          </Button>
          <Button variant="link" className="text-white">
            {" "}
            Speech to text converter
          </Button>
          <Button variant="link" className="text-white">
            Ai translation
          </Button>
          <Button variant="link" className="text-white">
            {" "}
            Audio to PDF converter
          </Button>
        </div>
        <div className="grid gap-3">
          <p className="text-center text-white text-2xl font-bold ">Company</p>
          <Separator className="my-5" />

          <Button variant="link" className="text-white">
            about
          </Button>
          <Button variant="link" className="text-white">
            Blog
          </Button>
          <Button variant="link" className="text-white">
            review
          </Button>
          <Button variant="link" className="text-white">
            contact
          </Button>
          <Button variant="link" className="text-white">
            terms
          </Button>
        </div>
        <div className="grid gap-3">
          <p className="text-center text-white text-2xl font-bold ">Product</p>
          <Separator className="my-5" />
          <Button variant="link" className="text-white">
            Feature
          </Button>
          <Button variant="link" className="text-white">
            pricing
          </Button>
          <Button variant="link" className="text-white">
            accuracy
          </Button>
          <Button variant="link" className="text-white">
            Language
          </Button>
        </div>
      </div>
    </main>
  );
}
