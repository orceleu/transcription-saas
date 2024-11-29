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
import { AiOutlineSelect, AiOutlineTranslation } from "react-icons/ai";
import { SiConvertio, SiQuicktime } from "react-icons/si";
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
  ArrowDownNarrowWide,
  ArrowLeftCircle,
  Check,
  DeleteIcon,
  EditIcon,
  FileIcon,
  Flashlight,
  IdCard,
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
  VideoIcon,
} from "lucide-react";
import { SelectIcon } from "@radix-ui/react-select";

import { Cloud, CreditCard } from "lucide-react";
import detailAnalysis from "../public/undraw_detailed_analysis_re_tk6j.svg";
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
import {
  DashboardIcon,
  LightningBoltIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";

import { loginWithGoogle } from "./login/auth";
import { FaStamp, FaToolbox } from "react-icons/fa6";
import { account, ID } from "./appwrite/appwrite";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import logo from "../public/logo.jpg";
export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
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
    <main>
      <div className="fixed top-0  w-full flex justify-between p-5 bg-gray-50 ">
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="logo"
            title="Logo"
            className="size-[40px] md:size-[50px] rounded-full"
          />

          <p className="text-xl font-semibold">AudiScribe</p>
        </div>

        <div className="hidden lg:flex items-center gap-5">
          <Button variant="link">Home</Button>
          <a href="#pricing" className="hover:underline">
            Pricing
          </a>
          <a href="#blog" className="hover:underline">
            Blog
          </a>
          <Button
            onClick={loginWithGoogle}
            className="bg-amber-700 hover:bg-amber-600"
          >
            Login
          </Button>
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
            className="bg-amber-700 hover:bg-amber-600"
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
                  <a href="#pricing" className="hover:underline">
                    Pricing
                  </a>
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
      <div className="flex justify-center">
        <div className=" max-w-[1400px]">
          <div className=" flex min-h-screen flex-col items-center justify-between p-5 md:p-24">
            <div className="bg-gridline w-full p-10">
              <br />
              <br />
              <br />
              <h1 className="text-4xl md:text-6xl text-center font-bold">
                <span className="text-amber-700">Audio & video</span>{" "}
                <a
                  href="https://platform.openai.com/docs/guides/speech-to-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  to text converter
                </a>
              </h1>

              <div className="flex justify-center">
                <h2 className="text-center lg:text-xl text-gray-600 max-w-[700px] my-10">
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
                  . For any language or dialect, no matter the clarity of the
                  audio. Just choose your file, upload it, and the{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Transcription"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    transcription
                  </a>
                  <br />
                  starts automatically.
                </h2>
              </div>
            </div>
            <div className=" grid gap-5 md:grid-cols-2 w-full  my-10 p-5 max-w-[900px] bg-gray-50 rounded-md">
              <p className="text-center">
                <span className="text-2xl">🎯</span> Accuracy 98%
              </p>
              <p className="text-center">
                <span className="text-2xl">🌍</span>100+ languages
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
            <div className="grid grid-cols-1 md:grid-cols-2 md:mt-[40px] gap-3">
              <div className="w-full md:w-[500px]  shadow-md shadow-amber-200 rounded-md p-2">
                <div className="grid gap-2 my-10 p-5 rounded-md border-black border-[1px]">
                  <p className="text-center my-4">
                    Upload file to transcribe them
                  </p>
                  <Button variant="outline">
                    <IoCloudUpload className="mx-3 text-emerald-500" /> Upload
                    audio
                  </Button>
                  <p className="text-center text-gray-400">-----or-----</p>
                  <Button variant="outline">
                    <VideoIcon className="mx-3" /> Video
                  </Button>
                  <p className="text-center text-gray-400">-----or-----</p>
                  <Input placeholder="Youtube link..." />
                </div>
              </div>

              <div className="grid gap-2 ">
                <p className="text-center text-3xl mt-16 md:mt-0  font-bold ">
                  Perfect <span className="text-amber-700">for</span>
                </p>

                <div className="flex items-center gap-3">
                  <div className=" grid gap-1 p-[10px] md:p-[50px]">
                    <p>
                      <span className="font-bold underline">Student</span>__{" "}
                      <span className=" text-[10px] md:text-[14px] text-gray-600">
                        Convert audio/video in PDF and you can use it in other
                        AI tools like{" "}
                        <a
                          href="https://www.chatpdf.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-700 underline"
                        >
                          chatPDF
                        </a>{" "}
                        or
                        <a
                          href="https://www.docuask.ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-700 underline"
                        >
                          docuAsk
                        </a>
                        .
                      </span>{" "}
                    </p>
                    <p>
                      <span className="font-bold underline">Journalist</span>__{" "}
                      <span className=" text-[10px] md:text-[14px] text-gray-600">
                        Quickly transcribe interviews with high accuracy, making
                        it easy to review, quote, and organize important details
                        from conversations.
                      </span>{" "}
                    </p>
                    <p>
                      <span className="font-bold underline">Researsher</span>__{" "}
                      <span className=" text-[10px] md:text-[14px] text-gray-600">
                        Search and locate specific keywords within audio or
                        video files, saving time and enhancing the ability to
                        analyze data and retrieve relevant information
                        effortlessly.
                      </span>{" "}
                    </p>
                    <p>
                      <span className="font-bold underline">Videographer</span>
                      __{" "}
                      <span className=" text-[10px] md:text-[14px] text-gray-600">
                        Export highly accurate transcriptions as SRT files for
                        captions or subtitles.
                      </span>
                    </p>
                  </div>
                  <Image
                    alt="for who is ..."
                    title="Perfect for..."
                    src={detailAnalysis}
                    className="size-[130px] md:size-[250px]"
                  />
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full my-5 md:mt-[100px] bg-amber-700 hover:bg-amber-600"
              onClick={loginWithGoogle}
            >
              <FcGoogle className="mx-3 " />
              start transcribing for free
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
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full mt-4"
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
              </DialogContent>
            </Dialog>
            <p className="my-2 text-center text-gray-400">
              20mn transcription for free --- No CreditCard required
            </p>
            <div className="grid gap-5 md:gap-10 my-[80px]">
              <div className="grid gap-2">
                <p className="text-3xl lg:text-5xl font-bold text-center">
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
                  Supporting many languages with the option to translante.
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
                  Upload files in all popular formats, including MP3, MP4, M4A,
                  MOV, AAC, WAV, OGG, OPUS, MPEG, WMA, YouTube, and more.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-slate-100">
                    <TimerIcon className="text-amber-300 " />
                  </div>
                </div>
                <p className="text-2xl text-center">
                  Get transcribe in Seconds.
                </p>
                <p className="text-gray-600 text-center">
                  Recieve accurate transcriptions within seconds of uploading
                  your files.
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
            <p className="text-center text-3xl lg:text-5xl font-bold">
              Simple and Easy to use cloud based AI software.
            </p>
            <p className="text-gray-400 my-5 text-center lg:text-xl">
              No installation needed,access on{" "}
              <span className="text-amber-700 underline font-bold">
                Any device.
              </span>
            </p>
            <div className="flex items-center gap-5 md:gap-10 my-10">
              <ArrowBigDown className="size-[50px] md:size-[100px]" />
              <ArrowBigDown className="size-[50px] md:size-[100px]" />
              <ArrowBigDown className="size-[50px] md:size-[100px]" />
              <ArrowBigDown className="size-[50px] md:size-[100px]" />
            </div>{" "}
            <Image
              alt="capture"
              title="User-friendly interface."
              src={capturetranscriptionapp}
              sizes="500"
              className="rounded-md shadow-md shadow-amber-300"
            />
            <Separator className="my-[100px]" />
            <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
              <div>
                <p
                  className="text-center text-3xl lg:text-5xl font-bold  "
                  id="pricing"
                >
                  Simple and affordable pricing
                </p>
                <p className="text-gray-600 text-center lg:text-xl my-5 md:my-10">
                  Our easy, pay-as-you-transcribe pricing allows you to top-up
                  your credit whenever you need it. The more transcription hours
                  you top-up on your account, the more you will save. No plans,
                  no packages, no commitments required.
                </p>{" "}
                <div className="flex justify-center w-full  h-[150px]">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="w-full lg:w-[150px] hover:bg-gray-200 h-[80px] bg-gray-100 rounded-lg border-amber-600 border-[2px]">
                      <div className="flex justify-center p-2">
                        <div className="grid gap-1">
                          <strong>Free</strong>
                          <p>20mn</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[150px] h-[80px] bg-gray-100 hover:bg-gray-200 rounded-lg border-gray-400 border-[2px]">
                      <div className="flex justify-center p-2">
                        <div className="grid gap-1">
                          <strong>5$</strong>
                          <p>2 Hours</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[150px] h-[80px] bg-gray-100 hover:bg-gray-200 rounded-lg border-gray-400 border-[2px]">
                      <div className="flex justify-center p-2">
                        <div className="grid gap-1">
                          <strong>10$</strong>
                          <p>6 Hours</p>
                        </div>
                      </div>
                    </div>{" "}
                    <div className="w-full lg:w-[150px] h-[80px] bg-gray-100 hover:bg-gray-200 rounded-lg border-gray-400 border-[2px]">
                      <div className="flex justify-center p-2">
                        <div className="grid gap-1">
                          <strong>15$</strong>
                          <p>8 Hours</p>
                        </div>
                      </div>
                    </div>{" "}
                    <div className="w-full lg:w-[150px] h-[80px] bg-gray-100 hover:bg-gray-200 rounded-lg border-gray-400 border-[2px]">
                      <div className="flex justify-center p-2">
                        <div className="grid gap-1">
                          <strong>25$</strong>
                          <p>15 Hours</p>
                        </div>
                      </div>
                    </div>{" "}
                    <div className="w-full lg:w-[150px] h-[80px] bg-gray-100 hover:bg-gray-200 rounded-lg border-gray-400 border-[2px]">
                      <div className="flex justify-center p-2">
                        <div className="grid gap-1">
                          <strong>35$</strong>
                          <p>20 Hours</p>
                        </div>
                      </div>
                    </div>{" "}
                  </div>
                </div>
              </div>
              <div className="grid gap-3 lg:mt-[300px]">
                <div className="w-full p-10 my-[100px]  md:mt-[60px]  max-w-[700px] bg-amber-700 rounded-md">
                  <p className="text-center text-3xl text-white my-2">
                    Try Audiscribe Free
                  </p>
                  <Separator className="my-2" />
                  <div className="flex justify-center">
                    <div className="grid gap-2 ">
                      <div className="flex justify-center mt-10">
                        <div className="grid gap-2">
                          <Button
                            variant="outline"
                            size="lg"
                            className="font-bold"
                            onClick={loginWithGoogle}
                          >
                            <FcGoogle className="mx-3 " /> Get started
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
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
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
                                    onChange={(e) =>
                                      setRePassword(e.target.value)
                                    }
                                    className="w-full"
                                    required
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  variant="outline"
                                  className="w-full mt-4"
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
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="w-full p-5 lg:p-10  my-10 bg-slate-100 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-[40px]">
                <div className="w-full h-full rounded-lg">
                  <p className="text-3xl lg:text-5xl text-center text-violet-700 font-bold my-10">
                    features
                  </p>
                  <p className="lg:text-xl">
                    We have a few features that help you to reduce the amount of
                    time you spend transcribing. Easily convert your content:
                    automatically transcribe video, automatically transcribe
                    text, enhancing accessibility and efficiency.
                  </p>
                </div>
                <div className="w-full p-10 lg:h-full bg-white rounded-lg">
                  <div className="flex justify-center my-10">
                    <LightningBoltIcon className="text-violet-500 size-[100px] lg:size-[200px]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className=" flex justify-center w-full  bg-white rounded-lg ">
                  <div>
                    <Separator />
                    <div className="grid gap-3 p-10">
                      <div className="flex justify-center">
                        <ArrowDownNarrowWide className="text-violet-500 size-[40px]" />
                      </div>
                      <p className="text-center text-2xl font-bold">Accuracy</p>
                      <p className="text-center  ">
                        Get accurate language transcriptions, even if your video
                        or audio contains multiple languages.
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center w-full  bg-white rounded-lg ">
                  <div>
                    <Separator />
                    <div className="grid gap-3 p-10">
                      <div className="flex justify-center">
                        <AiOutlineTranslation className="text-violet-500 size-[40px]" />
                      </div>
                      <p className="text-center text-2xl font-bold">
                        Transcribe in over 100 Languages.
                      </p>
                      <p className="text-center  ">
                        Transcribe in any language you need.
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center w-full  bg-white rounded-lg ">
                  <div>
                    <Separator />
                    <div className="grid gap-3 p-10">
                      <div className="flex justify-center">
                        <IdCard className="text-violet-500 size-[40px]" />
                      </div>
                      <p className="text-center text-2xl font-bold">
                        {" "}
                        Speaker Identification.
                      </p>
                      <p className="text-center  ">
                        Utilise Speaker Identification for precise speaker
                        labelling in your audios and videos.
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center w-full  bg-white rounded-lg ">
                  <div>
                    <Separator />
                    <div className="grid gap-3 p-10">
                      <div className="flex justify-center">
                        <EditIcon className="text-violet-500 size-[40px]" />
                      </div>
                      <p className="text-center text-2xl font-bold">Editor.</p>
                      <p className="text-center  ">
                        Use our text Editor for customized transcription
                        formatting.
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center w-full  bg-white rounded-lg ">
                  <div>
                    <Separator />
                    <div className="grid gap-3 p-10">
                      <div className="flex justify-center">
                        <FileIcon className="text-violet-500 size-[40px]" />
                      </div>
                      <p className="text-center text-2xl font-bold">
                        Multi-format Files.
                      </p>
                      <p className="text-center  ">
                        Upload files in popular formats and download
                        transcriptions in various layouts, including
                        timestamped.
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center w-full  bg-white rounded-lg ">
                  <div>
                    <Separator />
                    <div className="grid gap-3 p-10">
                      <div className="flex justify-center">
                        <DashboardIcon className="text-violet-500 size-[40px]" />
                      </div>
                      <p className="text-center text-2xl font-bold">
                        Dashboard.
                      </p>
                      <p className="text-center  ">
                        Easily manage all of your transcriptions in one place.
                      </p>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center my-10 text-3xl lg:text-5xl font-bold lg:mt-[200px]">
              Customer review
            </p>
            <p className="text-center ">
              Rated Excellent 4.8/5 based on 450+ reviews
            </p>
            <Separator className="my-10" />
            <div className="grid lg:grid-cols-2  gap-5 lg:gap-10 ">
              <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
                <div className="flex justify-between my-3 ">
                  <p className=" text-xl font-semibold">Good.</p>
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
                  Good services. No ads and transcripts are accurate than other
                  app like this .Also i like the fact there is no subscription.
                </p>
              </div>
              <div className="bg-white shadow-md rounded-md w-full p-5 md:p-10">
                <div className="flex justify-between my-3 ">
                  <p className=" text-xl font-semibold">Indispensable.</p>
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
                  I use this platform to transcribe my meetings, and it has
                  saved me so much time. The accuracy of the transcriptions is
                  impressive, even with different accents. In just a few
                  minutes, I have an accurate text I can use for meeting notes.
                  A must-have for anyone looking to optimize their productivity!
                </p>
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
                  <p className=" text-xl font-semibold">Simple.</p>
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
                  The platform is incredibly easy to use. I just upload my file,
                  and within minutes, I have an accurate transcription. It has
                  allowed me to get my transcriptions done in no time, and
                  it&apos;s worth every penny! Very satisfied with this service.
                </p>
              </div>{" "}
            </div>
            <p className="text-center my-10 text-3xl lg:text-5xl font-bold lg:mt-[200px]">
              FAQ
            </p>
            <Accordion type="single" collapsible className="w-full mb-[100px]">
              <AccordionItem value="item-1">
                <AccordionTrigger className=" lg:text-xl font-bold">
                  What is AudiScribe?
                </AccordionTrigger>
                <AccordionContent className=" lg:text-xl text-gray-600">
                  Audiscribe is an{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Transcription_(linguistics)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    audio-to-text transcription
                  </a>{" "}
                  platform designed to automatically convert audio or video
                  files into text. Using advanced speech recognition algorithms,
                  Audiscribe enables users to easily turn interviews, lectures,
                  meetings, podcasts, and more into written documents.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className=" lg:text-xl font-bold">
                  How long are my credits available?
                </AccordionTrigger>
                <AccordionContent className=" lg:text-xl text-gray-600">
                  Your credits have lifetime availability.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className=" lg:text-xl font-bold">
                  How much file size can i upload?
                </AccordionTrigger>
                <AccordionContent className="3 lg:text-xl text-gray-600">
                  You can upload at most 5GB .
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className=" lg:text-xl font-bold">
                  Which audio / video formats do you support?
                </AccordionTrigger>
                <AccordionContent className="lg:text-xl text-gray-600">
                  AudiScribe supports the vast majority of common audio and
                  video formats, including MP3, M4A, MP4, MOV, AAC, WAV, OGG,
                  OPUS and MPEG
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className=" lg:text-xl font-bold">
                  Is AudiScribe secure?
                </AccordionTrigger>
                <AccordionContent className=" lg:text-xl text-gray-600">
                  Yes. Your transcripts, uploaded files, and account information
                  are encrypted and only you can access them. You can delete
                  them at any time. We use Stripe to securely process payments
                  and we don&apos;t store your credit card number.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className=" lg:text-xl font-bold">
                  What about accents, background noise, and poor audio quality?
                </AccordionTrigger>
                <AccordionContent className=" lg:text-xl text-gray-600">
                  While clean and clear audio produces the best results,
                  AudiScribe generally does well with accents, background noise,
                  and lower audio quality.{" "}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

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
