"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import capturetranscriptionapp from "../public/capture.jpg";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { FcGoogle, FcSoundRecordingCopyright } from "react-icons/fc";
import { auth } from "@/app/firebase/config";
import { useEffect, useState } from "react";
import { IoCloudUpload } from "react-icons/io5";
import { AiOutlineSelect } from "react-icons/ai";
import { SiConvertio } from "react-icons/si";
import {
  ArrowBigRight,
  EditIcon,
  FileIcon,
  InfinityIcon,
  LanguagesIcon,
  MagnetIcon,
  MoreHorizontal,
  TimerIcon,
  Upload,
  UploadCloud,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import { SelectIcon } from "@radix-ui/react-select";

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";

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
export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(` urerr: ${user}`);
      if (user != null) {
        router.push("/dashboard");
        console.log(currentUser?.displayName);
      }
    });
    return () => unsubscribe();
  }, [user]);
  const handleLoginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main>
      <div className="fixed top-0  w-full flex justify-between  p-5 bg-zinc-50  rounded-md">
        <p className="text-xl font-semibold">AudiScribe</p>
        <div className="hidden lg:flex items-center gap-5">
          <p>Home</p>
          <p>Pricing</p>
          <p>Blog</p>
          <Button>Login</Button>
          <Button variant="outline">Sign up</Button>
        </div>
        <div className="lg:hidden flex items-center gap-5">
          <Button>Login</Button>{" "}
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
                <DropdownMenuItem>
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
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Blog</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Login</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-between p-5 md:p-24">
        <div>
          <br />
          <br />
          <br />

          <p className="text-4xl md:text-6xl text-center font-bold">
            <span className="text-amber-700">Audio & video</span> to text
            converter
          </p>
          <p className="text-center my-5 text-gray-400">
            convert any audio or video{" "}
            <span className="text-violet-900 font-bold">
              with high Acurracy{" "}
            </span>
            to text in few seconds.
          </p>
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
        </div>
        <div className="relative z-[-1] flex place-items-center before:absolute before:h-[500px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-amber-100 after:via-amber-300 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-amber-700 before:dark:opacity-10 after:dark:from-amber-900 after:dark:via-[#ffaf01] after:dark:opacity-40 sm:before:w-[580px] sm:after:w-[340px] before:lg:h-[460px]"></div>

        <div className="w-full md:w-[500px] mt-[100px] shadow-md shadow-amber-200 rounded-md p-2">
          <div className="grid gap-2 my-10">
            <p className="text-center my-4">Upload file to transcribe them</p>
            <Button variant="outline">
              <IoCloudUpload className="mx-3 text-emerald-500" /> Upload audio
              or video
            </Button>
            <p className="text-center text-gray-400">-----or-----</p>
            <Button variant="outline">
              <FcSoundRecordingCopyright className="mx-3" /> Record audio
            </Button>
          </div>
        </div>
        <Button size="lg" className="w-full my-5">
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
              Export your transcriptions in many format (PDF,DOCX,TXT and more).
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
        <div className="bg-red-200 p-10 rounded-md my-[100px] w-full max-w-[600px]">
          <div className="grid  gap-3 ">
            <p className="text-center text-3xl font-semibold my-3 underline">
              3 Step
            </p>
            <div className="p-2 bg-red-100 rounded-md w-full md:w-[500px]">
              <p className="text-center  text-xl font-serif">
                <AiOutlineSelect className="text-emerald-500 mx-3" />
                Select.
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-md w-full md:w-[500px]">
              <p className="text-center  text-xl font-serif">
                <IoCloudUpload className="text-emerald-500 mx-3" />
                Upload.
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-md w-full md:w-[500px]">
              <p className="text-center  text-xl font-serif">
                <SiConvertio className="text-emerald-500 mx-3" />
                Convert
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            alt="capture"
            src={capturetranscriptionapp}
            sizes="500"
            className="rounded-md shadow-md shadow-amber-300"
          />
        </div>

        <p className="text-center text-3xl font-bold mt-[200px]">
          Simple and affordable pricing
        </p>
        <p className="text-gray-600 text-center my-2">
          Sign up and start transcribing your first file.
        </p>
        <div className="w-full h-[900px] my-[100px]  max-w-[700px] bg-slate-900 rounded-md">
          <p className="text-center text-3xl text-white my-2">
            Audiscribe Free
          </p>
          <Separator />
        </div>

        <div className="w-full h-[900px] max-w-[700px] my-10 bg-amber-900 rounded-md">
          <p className="text-center text-3xl text-white my-2">Audiscribe Pro</p>
          <Separator />
        </div>
        <div className="flex justify-center my-10">
          <Button variant="outline" onClick={handleLoginGoogle}>
            Get started <ArrowBigRight />{" "}
          </Button>
        </div>

        <p className="text-center my-10 text-5xl font-bold">FAQ</p>

        <Separator className="my-10" />
        <p className="text-center">outils</p>
        <p className="text-center">Blog</p>
        <p className="text-center">review</p>
        <p className="text-center">support</p>
        <p className="text-center">terms</p>
      </div>{" "}
    </main>
  );
}
