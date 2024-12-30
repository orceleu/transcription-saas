import { Button } from "@/components/ui/button";
import Image from "next/image";
import capturetranscriptionapp from "../public/capture1.jpg";
import { IoCloudUpload, IoSyncCircle } from "react-icons/io5";
import { AiOutlineTranslation } from "react-icons/ai";
import {
  ArrowBigDown,
  ArrowDownNarrowWide,
  ArrowLeftCircle,
  Check,
  CheckCircle,
  CheckIcon,
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DashboardIcon,
  EnterFullScreenIcon,
  LightningBoltIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import logo from "../public/logo.jpg";
import dynamic from "next/dynamic";
import { EMAIL_ADDRESS } from "./constKey/key";
import { RiRobot2Fill } from "react-icons/ri";
import { FaRobot } from "react-icons/fa6";
import { FcSynchronize } from "react-icons/fc";
export default function Home() {
  const NavBar = dynamic(() => import("./clientComponent/navBar"), {
    ssr: false,
  });
  const AuthButton = dynamic(() => import("./clientComponent/authButton"), {
    ssr: false,
    loading: () => <LoaderIcon className="animate-spin" />,
  });

  return (
    <main>
      <NavBar />
      <div className="flex justify-center">
        <div className=" max-w-[1400px]">
          <div className=" flex min-h-screen flex-col items-center justify-between p-5 md:p-24">
            <div className="bg-gridline w-full p-10">
              <br />
              <br />
              <br />
              <h1 className="text-4xl md:text-6xl text-center font-bold">
                <span className="text-blue-600">Audio & video</span>{" "}
                <a
                  title="go to openAI speech-to-text."
                  href="https://platform.openai.com/docs/guides/speech-to-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  transcription software.
                </a>
              </h1>

              <div className="flex justify-center">
                <h2 className="text-center lg:text-xl text-gray-600 max-w-[700px] my-10">
                  <span className="text-violet-600 font-bold mx-2 underline">
                    Fast
                  </span>
                  ,
                  <span className="text-violet-600 font-bold mx-2 underline">
                    safe
                  </span>
                  ,and
                  <span className="text-violet-600 font-bold mx-2 underline">
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
            <div className="relative w-full p-1 my-10 rounded-lg bg-gradient-to-r from-purple-500 via-purple-300 to-transparent">
              <div className=" grid gap-5 md:grid-cols-2 w-full   p-5 max-w-[900px] bg-gray-50 rounded-md">
                <p className="text-center">
                  <span className="text-2xl">🎯</span> Accuracy 98%.
                </p>
                <p className="text-center">
                  <span className="text-2xl">🌍</span>100+ languages.
                </p>
                <p className="text-center">
                  <span className="text-2xl">🤯</span>upload 10hours.
                </p>
                <p className="text-center">
                  <span className="text-2xl">👥</span>speaker recognition.
                </p>
                <p className="text-center">
                  <span className="text-2xl">🔒</span> private and secure.
                </p>
                <p className="text-center">
                  <span className="text-2xl">📝</span> edit and export.
                </p>
                <p className="text-center">
                  <span className="text-2xl">🤖</span> AI tools.
                </p>
              </div>
            </div>
            <div className="relative z-[-1] flex place-items-center before:absolute before:h-[500px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-violet-100 after:via-blue-300 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-blue-900 after:dark:via-[#6201ff] after:dark:opacity-40 sm:before:w-[580px] sm:after:w-[340px] before:lg:h-[460px]"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:mt-[40px] gap-3">
              <div className="w-full md:w-[500px] max-h-[400px]  shadow-md shadow-blue-200 rounded-md p-2">
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
                  Perfect <span className="text-blue-600">for</span>
                </p>

                <div className="flex items-center gap-3">
                  <div className=" grid gap-1 p-[10px] md:p-[50px]">
                    <p>
                      <span className="font-bold underline">Student</span>__{" "}
                      <span className=" text-[10px] md:text-[14px] text-gray-600">
                        Easily transcribe recorded lectures into organized
                        outlines for study purposes. See:
                        <a
                          title="go to chatPdf."
                          href="https://www.chatpdf.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 underline"
                        >
                          chatPDF
                        </a>{" "}
                        or
                        <a
                          title="go to docuAsk AI."
                          href="https://www.docuask.ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 underline mx-1"
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
                        Use Auddai to transcribe interviews for data analysis.
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
            <AuthButton
              buttonColor="#3b82f6"
              text="Start transcribing for free."
              textColor="#ffffff"
              textColor2="#4b5563"
            />
            <p className="my-2 text-center text-gray-500">
              20min transcription for free --- No CreditCard required
            </p>
            <div className="grid gap-5 md:gap-10 my-[80px]">
              <div className="grid gap-2">
                <p className="text-3xl lg:text-5xl font-bold text-center">
                  Online Transcription Made Easy.
                </p>
                <p className="text-gray-600 md:text-xl text-center">
                  All tools you need to transcribe your audio and video file.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-slate-100">
                    <LanguagesIcon className="text-blue-300 md:size-[50px]" />
                  </div>
                </div>
                <p className="text-2xl  md:text-4xl text-center">
                  100+ Languages.
                </p>
                <p className="text-gray-600 md:text-xl text-center">
                  Supporting many languages with the option to translante.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-slate-100">
                    <FileIcon className="text-red-300 md:size-[50px]" />
                  </div>
                </div>
                <p className="text-2xl  md:text-4xl text-center">Export.</p>
                <p className="text-gray-600 md:text-xl text-center">
                  Export your transcriptions in many format (PDF,DOCX,TXT,SRT).
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-slate-100">
                    <UploadCloud className="text-lime-300 md:size-[50px]" />
                  </div>
                </div>
                <p className="text-2xl  md:text-4xl text-center">
                  Upload any format.
                </p>
                <p className="text-gray-600 md:text-xl text-center">
                  Upload files in all popular formats, including MP3, MP4, M4A,
                  MOV, AAC, WAV, OGG, OPUS, MPEG, YouTube, and more.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-slate-100">
                    <TimerIcon className="text-amber-300 md:size-[50px] " />
                  </div>
                </div>
                <p className="text-2xl  md:text-4xl text-center">
                  Get transcribe in Seconds.
                </p>
                <p className="text-gray-600 md:text-xl text-center">
                  Recieve accurate transcriptions within seconds of uploading
                  your files.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-slate-100">
                    <EditIcon className="text-blue-300 md:size-[50px]" />
                  </div>
                </div>
                <p className="text-2xl md:text-4xl text-center">Edit.</p>
                <p className="text-gray-600 md:text-xl text-center">
                  Edit your transcribed text.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-slate-100">
                    <FaRobot className="text-violet-300 md:size-[50px]" />
                  </div>
                </div>
                <p className="text-2xl  md:text-4xl text-center">AI.</p>
                <p className="text-gray-600 md:text-xl text-center">
                  AI query about your audio, (powered by Gemini).
                </p>
              </div>
            </div>
            <Separator className="my-10" />
            <p className="text-center text-3xl lg:text-5xl font-bold">
              Simple and Easy to use cloud based AI software.
            </p>
            <p className="text-gray-400 my-5 text-center lg:text-xl">
              No installation needed,access on{" "}
              <span className="text-blue-600 underline font-bold">
                Any device.
              </span>
            </p>
            <div className="flex items-center gap-5 md:gap-10 my-10">
              <ArrowBigDown className="size-[50px] md:size-[100px] text-blue-100" />
              <ArrowBigDown className="size-[50px] md:size-[100px] text-blue-100" />
              <ArrowBigDown className="size-[50px] md:size-[100px] text-blue-100" />
              <ArrowBigDown className="size-[50px] md:size-[100px] text-blue-100" />
            </div>{" "}
            <Image
              alt="capture"
              title="User-friendly interface."
              src={capturetranscriptionapp}
              sizes="500"
              className="rounded-md shadow-2xl "
            />
            <Separator className="my-[100px]" />{" "}
            <p
              className="text-center my-[90px] text-3xl lg:text-5xl font-bold  "
              id="pricing"
            >
              Simple and affordable pricing
            </p>
            <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
              <div>
                <div className="grid gap-3 ">
                  <div className="w-full p-10   shadow-2xl  max-w-[700px] bg-slate-400 rounded-md">
                    <p className="text-center text-3xl text-white my-2">
                      Try Auddai Free
                    </p>
                    <Separator />
                    <p className="my-[30px] text-gray-100 text-xl">
                      Key Features.
                    </p>
                    <div className="flex justify-center">
                      <div className="grid gap-2  ">
                        <div className="flex items-center gap-2">
                          <CheckIcon className="text-white" />
                          <p className=" text-white">20min/month.</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <CheckIcon className="text-white" />
                          <p className=" text-white">15MB/upload.</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <CheckIcon className="text-white" />
                          <p className=" text-white">
                            AI Query,AI assistant, transcribes,translante and
                            summarizes.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <CheckIcon className="text-white" />
                          <p className=" text-white">Powerfull Editor.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="text-white" />
                          <p className=" text-white">Export in any format.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="text-white" />
                          <p className=" text-white">
                            Chat with PDF(coming soon).
                          </p>
                        </div>
                        <div className="flex items-center mt-10 gap-2">
                          <CheckCircle className="text-white" />
                          <p className=" text-white text-xl">
                            Cancel anytime(no question asked).
                          </p>
                        </div>
                        <div className="flex justify-center mt-5">
                          <div className="grid gap-2">
                            <AuthButton
                              buttonColor="#ffffff"
                              text="Start with Google."
                              textColor="#000000"
                              textColor2="#e5e7eb"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 ">
                <div className="w-full p-10 my-[100px]  md:mt-[50px] shadow-2xl  max-w-[700px] bg-violet-700 rounded-md">
                  <p className="text-center text-3xl text-white my-2">
                    Auddai Pro
                    <span className="text-amber-500 font-bold">10$/month</span>
                  </p>
                  <Separator />
                  <p className="my-[30px] text-gray-100 text-xl">
                    Key Features.
                  </p>
                  <div className="flex justify-center">
                    <div className="grid gap-2  ">
                      <div className="flex items-center gap-2">
                        <CheckIcon className="text-white" />
                        <p className=" text-white">20Hours /month.</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckIcon className="text-white" />
                        <p className=" text-white">5GB/upload.</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckIcon className="text-white" />
                        <p className=" text-white">
                          AI Query,AI assistant, transcribes,translante and
                          summarizes
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckIcon className="text-white" />
                        <p className=" text-white">Powerfull Editor.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="text-white" />
                        <p className=" text-white">Export in any format.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="text-white" />
                        <p className=" text-white">
                          Chat with PDF(coming soon).
                        </p>
                      </div>

                      <div className="flex items-center mt-10 gap-2">
                        <CheckCircle className="text-white" />
                        <p className=" text-white text-xl">
                          Cancel anytime(no question asked).
                        </p>
                      </div>

                      <div className="flex justify-center mt-5">
                        <div className="grid gap-2">
                          <AuthButton
                            buttonColor="#ffffff"
                            text="Start with Google."
                            textColor="#000000"
                            textColor2="#e5e7eb"
                          />
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
                      <p className="text-center  text-gray-600 ">
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
                      <p className="text-center text-gray-600  ">
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
                      <p className="text-center text-gray-600  ">
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
                      <p className="text-center  text-gray-600 ">
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
                      <p className="text-center  text-gray-600 ">
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
                      <p className="text-center text-gray-600  ">
                        Easily manage all of your transcriptions in one place.
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center w-full  bg-white rounded-lg ">
                  <div>
                    <Separator />
                    <div className="grid gap-3 p-10">
                      <div className="flex justify-center">
                        <IoSyncCircle className="text-violet-500 size-[40px]" />
                      </div>
                      <p className="text-center text-2xl font-bold">
                        Sync with Audio/Video.
                      </p>
                      <p className="text-center text-gray-600 ">
                        Synchronization of transcripts with video or audio
                        enables quick navigation.
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center w-full  bg-white rounded-lg ">
                  <div>
                    <Separator />
                    <div className="grid gap-3 p-10">
                      <div className="flex justify-center">
                        <EnterFullScreenIcon className="text-violet-500 size-[40px]" />
                      </div>
                      <p className="text-center text-2xl font-bold">
                        Fully Responsive Interface.
                      </p>
                      <p className="text-center  text-gray-600 ">
                        Our interface supports tablets phones, desktops,and
                        smart TVs.
                      </p>{" "}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center w-full  bg-white rounded-lg ">
                  <div>
                    <Separator />
                    <div className="grid gap-3 p-10">
                      <div className="flex justify-center">
                        <FaRobot className="text-violet-500 size-[40px]" />
                      </div>
                      <p className="text-center text-2xl font-bold">AI .</p>
                      <p className="text-center text-gray-600  ">
                        Ask AI gemini powered anything about your audio/video.
                      </p>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center my-10 text-3xl lg:text-5xl font-bold lg:mt-[200px]">
              Customer review
            </p>
            <p className="text-center text-gray-600  ">
              Rated Excellent 4.8/5 based on 450+ reviews
            </p>
            <Separator className="my-10" />
            <div className="grid lg:grid-cols-2  gap-5 lg:gap-10 ">
              <div className="bg-white border-[2px] shadow-2xl border-blue-100 rounded-2xl w-full p-5 md:p-10">
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

                <p className="text-gray-600 ">
                  Good services. No ads and transcripts are accurate than other
                  app like this,resonnable price with a bunch of fonctionnality.
                </p>
              </div>
              <div className="bg-white border-[2px] shadow-2xl border-emerald-100 rounded-2xl w-full p-5 md:p-10">
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
                <p className="text-gray-600 ">
                  I use this platform to transcribe my meetings, and it has
                  saved me so much time. The accuracy of the transcriptions is
                  impressive, even with different accents. In just a few
                  minutes, I have an accurate text I can use for meeting notes.
                  A must-have for anyone looking to optimize their productivity!
                </p>
              </div>{" "}
              <div className="bg-white border-[2px] shadow-2xl border-amber-100 rounded-2xl w-full p-5 md:p-10">
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
              <div className="bg-white border-[2px] shadow-2xl border-green-100 rounded-2xl w-full p-5 md:p-10">
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
                <p className="text-gray-600 ">
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
                <AccordionTrigger className=" lg:text-xl font-bold text-gray-600 ">
                  What is Auddai?
                </AccordionTrigger>
                <AccordionContent className=" lg:text-xl text-gray-500">
                  Auddai is an{" "}
                  <a
                    title="go to wikipedia."
                    href="https://en.wikipedia.org/wiki/Transcription_(linguistics)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline mx-2"
                  >
                    audio-to-text transcription
                  </a>
                  platform whith a bunch of fonctionnality, designed to
                  automatically convert audio or video files into text. Using
                  advanced speech recognition algorithms, Auddai enables users
                  to easily turn interviews, lectures, meetings, podcasts, and
                  more into written documents.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className=" lg:text-xl font-bold text-gray-600 ">
                  How long are my credits available?
                </AccordionTrigger>
                <AccordionContent className=" lg:text-xl text-gray-500">
                  Your credits have lifetime availability.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className=" lg:text-xl font-bold text-gray-600 ">
                  How much file size can i upload?
                </AccordionTrigger>
                <AccordionContent className="lg:text-xl text-gray-500">
                  You can upload at most 5GB.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className=" lg:text-xl font-bold text-gray-600 ">
                  Which audio / video formats do you support?
                </AccordionTrigger>
                <AccordionContent className="lg:text-xl text-gray-500">
                  Auddai supports the vast majority of common audio and video
                  formats, including MP3, M4A, MP4, MOV, AAC, WAV, OGG, OPUS and
                  MPEG
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className=" lg:text-xl font-bold text-gray-600 ">
                  Is Auddai secure?
                </AccordionTrigger>
                <AccordionContent className=" lg:text-xl text-gray-500">
                  Yes. Your transcripts, uploaded files, and account information
                  are encrypted and only you can access them. You can delete
                  them at any time. We use Stripe to securely process payments
                  and we don&apos;t store your credit card number.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className=" lg:text-xl font-bold text-gray-600 ">
                  What about accents, background noise, and poor audio quality?
                </AccordionTrigger>
                <AccordionContent className=" lg:text-xl text-gray-500">
                  While clean and clear audio produces the best results, Auddai
                  generally does well with accents, background noise, and lower
                  audio quality.{" "}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className=" lg:text-xl font-bold text-gray-600 ">
                  How do i cancel my plan?
                </AccordionTrigger>
                <AccordionContent className=" lg:text-xl text-gray-500">
                  You can cancel your plan at anytime, just click on top right
                  dashboard and click cancel subscription.
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
          <a
            title=" Audio & video to text converter"
            href="/"
            className="text-white text-center"
          >
            {" "}
            Audio & video to text converter
          </a>

          <a title="Ai translation" href="/" className="text-white text-center">
            Ai translation
          </a>
          <a
            title="Audio to PDF converter"
            href="/"
            className="text-white text-center"
          >
            {" "}
            Audio to PDF converter
          </a>
        </div>
        <div className="grid gap-3">
          <p className="text-center text-white text-2xl font-bold ">Company</p>
          <Separator className="my-5" />

          <a title="about" href="/about" className="text-white text-center">
            about
          </a>

          <a
            title="contact"
            href={`mailto:${EMAIL_ADDRESS}`}
            className="text-white text-center"
          >
            contact
          </a>

          <a
            title="privacy policy"
            className="text-white text-center"
            href="/privacy"
          >
            privacy
          </a>
        </div>
        <div className="grid gap-3">
          <p className="text-center text-white text-2xl font-bold ">Product</p>
          <Separator className="my-5" />
          <a title="Feature" href="/" className="text-white text-center">
            Feature
          </a>

          <a title="Accuracy" href="/" className="text-white text-center">
            accuracy
          </a>
          <a title="Language" href="/" className="text-white text-center">
            Language
          </a>
        </div>
      </div>
    </main>
  );
}
