"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import {
  FaBahai,
  FaChessKing,
  FaFileExport,
  FaRegFilePdf,
  FaRobot,
  FaSpinner,
  FaToolbox,
} from "react-icons/fa6";
import { TbFileTypeDocx, TbZodiacGemini } from "react-icons/tb";
import { GrAddCircle, GrDocumentTxt, GrEmptyCircle } from "react-icons/gr";
import { useDropzone } from "react-dropzone";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowBigLeft,
  ArrowBigLeftIcon,
  AudioWaveformIcon,
  Check,
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDown,
  CopyIcon,
  CreditCard,
  DeleteIcon,
  DownloadIcon,
  Edit2Icon,
  HistoryIcon,
  Infinity,
  LoaderIcon,
  MoreHorizontal,
  PauseIcon,
  PlayIcon,
  PlusCircleIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  SendIcon,
  Settings,
  SettingsIcon,
  SidebarClose,
  TrashIcon,
  UploadCloud,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Document, Packer, Paragraph, TextRun, PageBreak } from "docx";
import { saveAs } from "file-saver";
import noData from "../../public/nodata2.svg";
import { Player } from "react-simple-player";
import { useRouter } from "next/navigation";
import { fal } from "@fal-ai/client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { MdWorkspacePremium } from "react-icons/md";
import { jsPDF } from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImFilesEmpty } from "react-icons/im";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ReactPlayer from "react-player";
import { MdAccountCircle, MdOutlineSubtitles } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "../../public/logo.jpg";
import { Input } from "@/components/ui/input";
import {
  ChatBubbleIcon,
  FileTextIcon,
  LoopIcon,
  QuestionMarkCircledIcon,
  QuestionMarkIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import YouTubePlayer from "react-player/youtube";
import {
  addAudioElement,
  bytesToMB,
  convertirDuree,
  formatDate,
  returnIconSpeaker,
  returnTypeIcon,
} from "./returnFunction";
import { deleteFileItem, getFileUrl } from "../appwrite/storageFonction";
import { account, ID } from "../appwrite/appwrite";
import {
  addUserAccount,
  addUserData,
  CreateAiConversation,
  deleteAiChat,
  deleteItemUserData,
  getAiConversation,
  getDocument,
  listUserData,
  updateUsedTime,
} from "../appwrite/databaseFunction";
import { FcAddImage } from "react-icons/fc";
import { Message, useChat } from "ai/react";
import FormattedText from "../clientComponent/formattedTextAi";
import { AiFillCloseCircle } from "react-icons/ai";
interface Item {
  name: string;
  path: string;
  url: string;
}
interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface AudioPlayerProps {
  audioUrl: string;
  srtString: string;
}

const parseSRT = (srt: string): Subtitle[] => {
  const regex =
    /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n{2}|\n*$)/g;
  const subtitles: Subtitle[] = [];
  let match;
  while ((match = regex.exec(srt)) !== null) {
    const start = parseSrtTime(match[2]);
    const end = parseSrtTime(match[3]);
    subtitles.push({
      start,
      end,
      text: match[4],
    });
  }
  return subtitles;
};

const parseSrtTime = (srtTime: string): number => {
  const [hours, minutes, seconds] = srtTime.split(":");
  const [sec, millisec] = seconds.split(",");
  return (
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(sec, 10) +
    parseInt(millisec, 10) / 1000
  );
};
const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};
fal.config({
  credentials:
    "3acaf80b-c509-4c6d-a9a3-53201a9b9822:2779e88cfa33dbafceb17400f21c6b6d",
});
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};
type LanguageType = undefined | string;
interface UserDataHistoric {
  userId: string;
  historic: string;
  requestId: string;
  $id: string;
  $createdAt: string;
  associedFileName: string;
  type: string;
  size: string;
}
interface Plan {
  id: string;
  credits: number;
  price: string;
}
interface ModelUserData {
  isPro: boolean;
  Time: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
}
export default function Dashboard() {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
    append,
  } = useChat({
    api: "/api/aichat",
    streamProtocol: "text",
  });
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isAudioUrlDispo, setAudioUrlDispo] = useState(false);
  const router = useRouter();
  const [texte, setText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [changed, setChange] = useState(false);
  const selectedCurrentLanguage = useRef<LanguageType>(undefined);
  const [isSubmitted, setSubmitted] = useState(false);
  const [uploadIsLoaded, setUploadLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [openForMobileExport, setOpenForMobileExport] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [openLanguageMobile, setOpenLanguageMobile] = useState(false);

  const [openDesktopDialogYoutubemp3, setOpenDesktopDialogYoutubemp3] =
    useState(false);
  const [openMobileDialogYoutubemp3, setOpenMobileDialogYoutubemp3] =
    useState(false);
  const [inputYoutubeMp3Download, setinputYoutubeMp3Download] = useState("");
  const [isyoutubeMp3Submitted, setisyoutubeMp3Submitted] = useState(false);
  const [progresspercent, setProgresspercent] = useState(0);
  const [selectedTask, setSelectedTask] = useState("transcribe");
  const selectedCurrentTask = useRef("transcribe");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTranslanteMode, setTranslanteMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [videoIsplaying, setVideoPlaying] = useState(false);
  const [userId, setUserid] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const audioUrl = useRef("");
  const firstcheck = useRef(0);
  const [isVideo, setIsVideo] = useState(false);
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [value, setValue] = useState("transcribe");
  const [valueLanguage, setLanguageValue] = useState("en");
  const setUsedTextLengh = useRef(0);
  const [checkingUrl, setCheckingYoutubeUrl] = useState(false);
  const [youtubePlayerUrl, setYoutubePlayerUrl] = useState(false);
  const [textLanguageDetected, setTextLanguageDetected] = useState("");
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [currentSubtitleDesktop, setCurrentSubtitleDesktop] =
    useState<Subtitle | null>(null);

  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTime, setShowTime] = useState(true);
  const [exportWithShowTime, setExportWithShowTime] = useState(false);
  const [exportWithSpeakerName, setExportWithSpeakerName] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<YouTubePlayer>(null);
  const playerRef1 = useRef<YouTubePlayer>(null);
  const videoPlayerRef = useRef<ReactPlayer>(null);
  const videoPlayerRef1 = useRef<ReactPlayer>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const transcriptionResultInSrt = useRef<string>("");
  const speakerArray = useRef<string[]>([]);
  const [speakerArrayShow, setSpeakerArrayShow] = useState<string[]>([]);
  const fileId = useRef("");
  const associedFileName = useRef("");
  const type = useRef("");
  const size = useRef("");
  const falRequestId = useRef("");
  const [userData, setUserData] = useState<UserDataHistoric[]>([]);
  const [userAccountData, setUserAccountData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const deleteItemUserHistoric = (id: string) => {
    const deletedTable = userData.filter((value) => value.$id !== id);
    setUserData(deletedTable);
  };
  const priceId = "price_1QXnieHMq3uIqhfsieLz1caB";
  const selectedCredits = 72000;
  const fileSizeAllowedToUpload = 5000000000; //5000MB
  const durationUploaded = useRef(0);
  const [fileNameSelected, setfileNameSelected] = useState("");
  const [addButtonPlan, setAddButtonPlan] = useState(false);
  const textCreditInsuffisant =
    "Your credit balance is insufficient. Please add credits to continue";

  // Récupérer une conversation existante
  /*const loadConversation = async (id: string) => {
    try {
      const response = await axios.get("/api/get-conversation", {
        params: { conversationId: id },
      });
      setMessages(response.data.messages);
      setConversationId(id);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };*/
  const parseJsonArray = (stringArray: string[]): Message[] => {
    try {
      return stringArray.map((item) => JSON.parse(item));
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return []; // Retourne un tableau vide en cas d'erreur
    }
  };
  const loadConversation = async (id: string) => {
    const res = await getAiConversation(id);
    setMessages(parseJsonArray(res.messages));

    //console.log(parseJsonArray(res.messages));
  };

  const formatMessagesForAppwrite = (messages: Message[]) => {
    return messages.map((msg) => {
      // Sérialisez le message complet en une chaîne JSON
      return JSON.stringify({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      });
    });
  };

  // Sauvegarder la conversation
  const saveConversation = async () => {
    const msg = formatMessagesForAppwrite(messages);
    //console.log(msg);
    try {
      await axios.post("/api/save-conversation", {
        conversationId,
        msg,
      });
      console.log("ai chat saved");
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  //un doc exclusivement pour le sauvegarde des chats

  /* useEffect(() => {
      // Charger une conversation existante si l'ID est fourni
      if (initialConversationId) loadConversation(initialConversationId);
  }, [initialConversationId]);

  */
  const addUserHistoricData = (
    userId: string,
    historic: string,
    requestId: string,
    id: string,
    createdAt: string,
    associedFileName: string,
    type: string,
    size: string
  ) => {
    setUserData((prev) => [
      ...prev,
      {
        userId: userId,
        historic: historic,
        requestId: requestId,
        $id: id,
        $createdAt: createdAt,
        associedFileName: associedFileName,
        type: type,
        size: size,
      },
    ]);
  };

  const addSpeaker = (newItem: string) => {
    setSpeakerArrayShow((prevItems) => [...prevItems, newItem]);
  };
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditedText(subtitles[index].text);
  };

  const handleEditChange = (e: any) => {
    setEditedText(e.target.value);
  };

  const handleEditSave = (index: number) => {
    const updatedSubtitles = [...subtitles];
    updatedSubtitles[index].text = editedText;
    setSubtitles(updatedSubtitles);
    setEditingIndex(null);
    setEditedText("");
  };

  // Fonction pour convertir un nombre décimal en format SRT
  const convertDecimalToSRTTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.round((time - Math.floor(time)) * 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${milliseconds
      .toString()
      .padStart(3, "0")}`;
  };
  const convertToSRT = (index: number, time: string, text: string) => {
    const [start, end] = time.replace(/[()]/g, "").split(",").map(Number);
    const startTime = convertDecimalToSRTTime(start);
    const endTime = convertDecimalToSRTTime(end);
    return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n`;
  };

  const convertSubtitlesToString = (
    subtitles: Subtitle[],
    includeTimestamps: boolean,
    speaker: boolean
  ): string => {
    return subtitles
      .map((sub, index) => {
        const timeString = includeTimestamps
          ? `(${formatTime(sub.start)}) `
          : "";
        const speakerString = speaker ? `${speakerArray.current[index]}: ` : "";

        return `${speakerString}${timeString}\n${sub.text}`;
      })
      .join("\n\n");
  };
  // Fonction pour ajouter le texte saisi à la chaîne existante
  const handleAddConvertedSrtInText = (text: string) => {
    const inputText = text.trim();
    if (inputText) {
      // Ajoute le texte à la référence du texte concaténé
      transcriptionResultInSrt.current = alignText(
        transcriptionResultInSrt.current
          ? `${transcriptionResultInSrt.current}\n\n ${inputText}`
          : inputText
      );
    }
  };

  const convertSubtitlesToSRT = (subtitles: Subtitle[]): string => {
    return subtitles
      .map((sub, index) => {
        const startTime = formatToSrtTime(sub.start);
        const endTime = formatToSrtTime(sub.end);
        return `${index + 1}\n${startTime} --> ${endTime}\n${sub.text}\n`;
      })
      .join("\n");
  };

  const formatToSrtTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(
      3,
      "0"
    )}`;
  };

  const frameworks = [
    {
      value: "transcribe",
      label: "Transcription",
    },
    {
      value: "translate",
      label: "Translation(experimental)->",
    },
  ];
  const language = [
    { value: "af", label: "Afrikaans (Afrikaans)" },
    { value: "am", label: "Amharic (አማርኛ)" },
    { value: "ar", label: "Arabic (العربية)" },
    { value: "as", label: "Assamese (অসমীয়া)" },
    { value: "az", label: "Azerbaijani (Azərbaycan)" },
    { value: "ba", label: "Bashkir (башҡорт теле)" },
    { value: "be", label: "Belarusian (Беларуская)" },
    { value: "bg", label: "Bulgarian (Български)" },
    { value: "bn", label: "Bengali (বাংলা)" },
    { value: "bo", label: "Tibetan (བོད་སྐད་)" },
    { value: "br", label: "Breton (Brezhoneg)" },
    { value: "bs", label: "Bosnian (Bosanski)" },
    { value: "ca", label: "Catalan (Català)" },
    { value: "cs", label: "Czech (Čeština)" },
    { value: "cy", label: "Welsh (Cymraeg)" },
    { value: "da", label: "Danish (Dansk)" },
    { value: "de", label: "German (Deutsch)" },
    { value: "el", label: "Greek (Ελληνικά)" },
    { value: "en", label: "English (English)" },
    { value: "es", label: "Spanish (Español)" },
    { value: "et", label: "Estonian (Eesti)" },
    { value: "eu", label: "Basque (Euskara)" },
    { value: "fa", label: "Persian (فارسی)" },
    { value: "fi", label: "Finnish (Suomi)" },
    { value: "fo", label: "Faroese (Føroyskt)" },
    { value: "fr", label: "French (Français)" },
    { value: "gl", label: "Galician (Galego)" },
    { value: "gu", label: "Gujarati (ગુજરાતી)" },
    { value: "ha", label: "Hausa (Hausa)" },
    { value: "haw", label: "Hawaiian (ʻŌlelo Hawaiʻi)" },
    { value: "he", label: "Hebrew (עברית)" },
    { value: "hi", label: "Hindi (हिन्दी)" },
    { value: "hr", label: "Croatian (Hrvatski)" },
    { value: "ht", label: "Haitian Creole (Kreyòl Ayisyen)" },
    { value: "hu", label: "Hungarian (Magyar)" },
    { value: "hy", label: "Armenian (Հայերեն)" },
    { value: "id", label: "Indonesian (Bahasa Indonesia)" },
    { value: "is", label: "Icelandic (Íslenska)" },
    { value: "it", label: "Italian (Italiano)" },
    { value: "ja", label: "Japanese (日本語)" },
    { value: "jw", label: "Javanese (Basa Jawa)" },
    { value: "ka", label: "Georgian (ქართული)" },
    { value: "kk", label: "Kazakh (Қазақ)" },
    { value: "km", label: "Khmer (ខ្មែរ)" },
    { value: "kn", label: "Kannada (ಕನ್ನಡ)" },
    { value: "ko", label: "Korean (한국어)" },
    { value: "la", label: "Latin (Latina)" },
    { value: "lb", label: "Luxembourgish (Lëtzebuergesch)" },
    { value: "ln", label: "Lingala (Lingála)" },
    { value: "lo", label: "Lao (ລາວ)" },
    { value: "lt", label: "Lithuanian (Lietuvių)" },
    { value: "lv", label: "Latvian (Latviešu)" },
    { value: "mg", label: "Malagasy (Malagasy)" },
    { value: "mi", label: "Maori (Māori)" },
    { value: "mk", label: "Macedonian (Македонски)" },
    { value: "ml", label: "Malayalam (മലയാളം)" },
    { value: "mn", label: "Mongolian (Монгол)" },
    { value: "mr", label: "Marathi (मराठी)" },
    { value: "ms", label: "Malay (Bahasa Melayu)" },
    { value: "mt", label: "Maltese (Malti)" },
    { value: "my", label: "Burmese (ဗမာစာ)" },
    { value: "ne", label: "Nepali (नेपाली)" },
    { value: "nl", label: "Dutch (Nederlands)" },
    { value: "nn", label: "Norwegian (Nynorsk)" },
    { value: "no", label: "Norwegian (Norsk)" },
    { value: "oc", label: "Occitan (Occitan)" },
    { value: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
    { value: "pl", label: "Polish (Polski)" },
    { value: "ps", label: "Pashto (پښتو)" },
    { value: "pt", label: "Portuguese (Português)" },
    { value: "ro", label: "Romanian (Română)" },
    { value: "ru", label: "Russian (Русский)" },
    { value: "sa", label: "Sanskrit (संस्कृतम्)" },
    { value: "sd", label: "Sindhi (سنڌي)" },
    { value: "si", label: "Sinhala (සිංහල)" },
    { value: "sk", label: "Slovak (Slovenčina)" },
    { value: "sl", label: "Slovenian (Slovenščina)" },
    { value: "sn", label: "Shona (ChiShona)" },
    { value: "so", label: "Somali (Soomaali)" },
    { value: "sq", label: "Albanian (Shqip)" },
    { value: "sr", label: "Serbian (Српски)" },
    { value: "su", label: "Sundanese (Basa Sunda)" },
    { value: "sv", label: "Swedish (Svenska)" },
    { value: "sw", label: "Swahili (Kiswahili)" },
    { value: "ta", label: "Tamil (தமிழ்)" },
    { value: "te", label: "Telugu (తెలుగు)" },
    { value: "tg", label: "Tajik (Тоҷикӣ)" },
    { value: "th", label: "Thai (ไทย)" },
    { value: "tk", label: "Turkmen (Türkmen)" },
    { value: "tl", label: "Tagalog (Tagalog)" },
    { value: "tr", label: "Turkish (Türkçe)" },
    { value: "tt", label: "Tatar (Татар)" },
    { value: "uk", label: "Ukrainian (Українська)" },
    { value: "ur", label: "Urdu (اردو)" },
    { value: "uz", label: "Uzbek (Oʻzbek)" },
    { value: "vi", label: "Vietnamese (Tiếng Việt)" },
    { value: "yi", label: "Yiddish (ייִדיש)" },
    { value: "yo", label: "Yoruba (Yorùbá)" },
    { value: "yue", label: "Cantonese (粵語)" },
    { value: "zh", label: "Chinese (中文)" },
  ];

  // Fonction pour télécharger le fichier
  const handleDownloadSrt = (content: string, filename: string) => {
    if (content) {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      toast({
        variant: "destructive",
        title: "Srt file not found.",
      });
    }
  };
  const downloadWordFile = async (text: string) => {
    if (text) {
      // Diviser le texte en paragraphes (chaque nouvelle ligne dans un nouveau paragraphe)
      const paragraphs = text.split("\n").map((line) => new Paragraph(line));

      // Si nécessaire, on peut aussi ajouter manuellement des sauts de page entre les paragraphes
      const documentParagraphs: any = paragraphs.flatMap((paragraph, index) => [
        paragraph,
        ...(index % 10 === 0 && index !== 0 ? [new PageBreak()] : []), // Ajouter une nouvelle page tous les 10 paragraphes
      ]);

      // Créer un document avec les paragraphes
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: documentParagraphs,
          },
        ],
      });

      // Générer le fichier .docx
      const blob = await Packer.toBlob(doc);

      // Télécharger le fichier .docx
      saveAs(blob, "auddai_.docx");
    } else {
      toast({
        variant: "destructive",
        title: "Text not found.",
      });
    }
  };
  const handleDownloadTxt = (text: string) => {
    if (text) {
      const blob = new Blob([text], { type: "text/plain" });

      // Créer une URL temporaire pour le Blob
      const url = window.URL.createObjectURL(blob);

      // Créer un élément <a> pour télécharger le fichier
      const link = document.createElement("a");
      link.href = url;
      link.download = "auddai_.txt";

      // Ajouter le lien au DOM, cliquer dessus, puis le supprimer
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Libérer la mémoire associée à l'URL temporaire
      window.URL.revokeObjectURL(url);
    } else {
      toast({
        variant: "destructive",
        title: "Text not found.",
      });
    }
  };
  const creatPDF = (text: string) => {
    if (text) {
      const finalText = ` GENERATED WITH Auddai \n ${text}  `;
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height; // Hauteur d'une page
      const marginTop = 10; // Marge en haut de la page
      const lineHeight = 10; // Hauteur d'une ligne de texte
      let yPosition = marginTop; // Position verticale de départ
      // Diviser le texte en lignes en fonction de la largeur de la page
      const splitText = doc.splitTextToSize(finalText, 180); // Largeur du texte dans la page

      // Ajouter chaque ligne de texte
      splitText.forEach((line: any) => {
        // Si la position Y dépasse la hauteur de la page, ajouter une nouvelle page
        if (yPosition + lineHeight > pageHeight) {
          doc.addPage(); // Ajouter une nouvelle page
          yPosition = marginTop; // Réinitialiser la position Y au sommet de la nouvelle page
        }

        // Ajouter la ligne de texte au PDF
        doc.text(line, 10, yPosition);

        yPosition += lineHeight; // Incrémenter la position verticale pour la ligne suivante
      });
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      // Télécharger le fichier PDF
      doc.save("auddai_.pdf");
    } else {
      toast({
        variant: "destructive",
        title: "Text not found.",
      });
    }
  };
  const handleCopy = async () => {
    const result = convertSubtitlesToString(subtitles, false, false);
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        alert("Copied to clipboard!");
      } catch (err) {
        console.error("Error : ", err);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Text not found.",
      });
    }
  };
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    const currentTime = state.playedSeconds;
    setProgress(state.played * 100);

    const currentSub = subtitles.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end
    );
    setCurrentSubtitle(currentSub || null);
  };
  const handleProgressDesktop = (state: {
    played: number;
    playedSeconds: number;
  }) => {
    const currentTime = state.playedSeconds;
    setProgress(state.played * 100);

    const currentSub = subtitles.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end
    );
    setCurrentSubtitleDesktop(currentSub || null);
  };
  const checkVideoYoutube = async (url: string, remainingTime: number) => {
    const data = url.slice(17, 28);
    console.log(data);

    const options = {
      method: "GET",
      url: "https://youtube-media-downloader.p.rapidapi.com/v2/video/details",
      params: {
        videoId: data,
      },
      headers: {
        "x-rapidapi-key": "ea3eb66b12mshb3815582d59c0fcp1ef05fjsnc501524b1af5",
        "x-rapidapi-host": "youtube-media-downloader.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);

      if (response.data.lengthSeconds < remainingTime) {
        durationUploaded.current = response.data.lengthSeconds;
        convertYoutubeMp3();
      } else {
        toast({
          variant: "destructive",
          title: "Youtube video too long,please add credit.",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleActiveButton = () => {
    firstcheck.current += 1;
    if (firstcheck.current < 3) {
      if (youtubeUrl.slice(0, 13) === "https://youtu") {
        //check if long youtube video
        checkVideoYoutube(youtubeUrl, Number(userAccountData?.Time));
      } else {
        toast({
          variant: "destructive",
          title: "Invalid link!.",
        });
      }
    }
  };
  async function selectPlan(
    price_id: string,
    stripeCustomerEmail: string,
    userId: string,
    credits: number
  ) {
    console.log(`selcted plan :${price_id}`);
    await axios
      .post("/api/checkout", {
        price_Id: price_id,
        user_Id: userId,
        customer_Email: stripeCustomerEmail,
        credits: credits,
      })
      .then((res) => {
        //console.log(res.data);
        router.push(`${res.data.session}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const cancelSubscription = async () => {
    await axios
      .post("/api/cancelsub", {
        subscriptionId: userAccountData?.stripeSubscriptionId,
      })
      .then((value) => {
        toast({
          variant: "default",
          description: "subscription will be canceled at the end of the month",
        });
      });
  };
  useEffect(() => {
    if (youtubeUrl) {
      handleActiveButton();
    }
  }, [youtubeUrl]);

  // Fonction pour filtrer les données
  const filteredData = userData.filter((data) =>
    data.associedFileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //upload audio
  const handleSubmitToUpload = (file: any) => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file found.",
      });
    } else {
      fileId.current = ID.unique();
      if (
        (file && file.type.startsWith("audio/")) ||
        file.type.startsWith("video/")
      ) {
        associedFileName.current = file.name;
        type.current = file.type;
        size.current = file.size.toString();
        if (file.size > fileSizeAllowedToUpload) {
          toast({
            variant: "destructive",
            title: "audio size too large (> 500MB).",
          });
        } else {
          const media = document.createElement(
            file.type.startsWith("video") ? "video" : "audio"
          );
          media.src = URL.createObjectURL(file);
          media.onloadedmetadata = () => {
            const durationAllowed = parseInt(userAccountData?.Time, 10);
            if (media.duration < durationAllowed) {
              durationUploaded.current = media.duration;
              setUploadLoaded(true);
              // Créez un nouvel XMLHttpRequest
              const xhr = new XMLHttpRequest();

              // Configurez l'URL et la méthode
              xhr.open(
                "POST",
                `https://cloud.appwrite.io/v1/storage/buckets/67225954001822e6e440/files`,
                true
              );
              xhr.setRequestHeader(
                "X-Appwrite-Project",
                "67224b080010c36860d8"
              );

              // Ajoutez un écouteur de progression
              xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                  const percentComplete = (event.loaded / event.total) * 100;
                  console.log(`Progression : ${percentComplete.toFixed(2)}%`);
                  // Mettez à jour ici votre barre de progression dans l'UI
                  setProgresspercent(Number(percentComplete));
                  if (progresspercent == 100) {
                    setChange(!changed);
                    console.log("upload completed");
                  }
                }
              });

              // Ajoutez un écouteur pour vérifier la fin de l'upload
              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  console.log("Fichier uploadé avec succès", xhr.response);
                  audioUrl.current = getFileUrl(fileId.current);
                  transcriptionResultInSrt.current = "data"; //pour ajouter les donnees userdata

                  submitSpeech();
                  setAudioUrlDispo(true);
                  setConversationId(fileId.current);
                  CreateAiConversation(fileId.current, []);
                  if (file.type.startsWith("video")) {
                    setIsVideo(true);
                  } else {
                    setIsVideo(false);
                  }

                  setfileNameSelected(associedFileName.current);
                } else {
                  console.error("Erreur pendant l'upload", xhr.responseText);
                }
              };

              // Créez un FormData pour envoyer le fichier
              const formData = new FormData();
              formData.append("file", file);
              formData.append("fileId", fileId.current);

              // Envoyez la requête
              xhr.send(formData);
            } else {
              toast({
                variant: "destructive",
                title: textCreditInsuffisant,
              });
            }
          };
        }
      } else {
        //console.log("nest pas");
        toast({
          variant: "destructive",
          title: "Only audio or video file can be uploaded.",
        });
      }
    }
  };

  const checkLogin = async () => {
    try {
      const result = await account.get();

      if (result.email == null || result.email == "") {
        router.push("/login");
      } else {
        setUserEmail(result.email);
        setUserid(result.$id);

        //ajoute 20 min si le doc est inexistant cela veut dire que le compte vient d'etre cree
        const res: any = await getDocument(result.$id);
        if (res.error !== "error") {
          setUserAccountData(res);
          console.log(res);
        } else {
          //add doc
          await addUserAccount(result.$id);

          const res1: any = await getDocument(result.$id);
          setUserAccountData(res1);
        }
      }
    } catch (error) {
      router.push("/login");
    }
  };
  const logOut = async () => {
    await account.deleteSession("current").then(() => {
      console.log("logOut!");
      router.push("/login");
    });
  };

  useEffect(() => {
    checkLogin();
  }, []);
  const listUserDATA = async () => {
    const data: any = await listUserData(userId);
    for (let i = 0; i < data.total; i++) {
      addUserHistoricData(
        data.documents[i].userId,
        data.documents[i].historic,
        data.documents[i].requestId,
        data.documents[i].$id,
        data.documents[i].$createdAt,
        data.documents[i].associedFileName,
        data.documents[i].type,
        data.documents[i].size
      );
    }
  };
  useEffect(() => {
    if (userAccountData?.Time > 10) {
      if (!error) {
        saveConversation();
        //actualise puis update
        const res1Value = parseInt(userAccountData?.Time, 10); // Convertit res1 en entier
        const durationValue = 120; // Garantit un entier pour durationUploaded

        if (!isNaN(res1Value) && !isNaN(durationValue)) {
          const timeToUpdate = res1Value - durationValue;

          // Assurez-vous que la valeur est un entier
          const validTime = Math.round(timeToUpdate); // Utilisez Math.floor ou Math.ceil si nécessaire

          updateUsedTime(userId, validTime);
          setTimeout(async () => {
            const res1: any = await getDocument(userId);
            setUserAccountData(res1);
          }, 3000);
        } else {
          console.log("erreur de conversion string to Int");
        }
      } else console.log("error in chatbot!");
    } else
      toast({
        variant: "destructive",
        title: textCreditInsuffisant,
      });
  }, [isLoading]);
  useEffect(() => {
    if (progresspercent == 100) {
      setTimeout(() => {
        toast({
          title: "Uploaded!",
        });
        setProgresspercent(0);
        setUploadLoaded(false);
      }, 500);
    }
  }, [progresspercent]);

  const options = {
    method: "GET",
    url: "https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/",
    params: {
      url: youtubeUrl,
    },
    headers: {
      "x-rapidapi-key": "ea3eb66b12mshb3815582d59c0fcp1ef05fjsnc501524b1af5",
      "x-rapidapi-host": "youtube-mp3-downloader2.p.rapidapi.com",
    },
  };
  const convertYoutubeMp3 = async () => {
    setCheckingYoutubeUrl(true);
    setYoutubePlayerUrl(true);
    setIsVideo(true);
    setAudioUrlDispo(true);
    try {
      const response = await axios.request(options);
      console.log(response.data.dlink);
      if (response) {
        setCheckingYoutubeUrl(false);
        audioUrl.current = response.data.dlink;
        submitSpeech();
      }
    } catch (error) {
      setCheckingYoutubeUrl(false);
      setYoutubePlayerUrl(false);
      setIsVideo(false);
      setAudioUrlDispo(false);
      console.error(error);
    }
  };
  const options2 = {
    method: "GET",
    url: "https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/",
    params: {
      url: inputYoutubeMp3Download,
    },
    headers: {
      "x-rapidapi-key": "ea3eb66b12mshb3815582d59c0fcp1ef05fjsnc501524b1af5",
      "x-rapidapi-host": "youtube-mp3-downloader2.p.rapidapi.com",
    },
  };
  const downloadMp3FromYT = async () => {
    if (inputYoutubeMp3Download.slice(0, 13) === "https://youtu") {
      if (inputYoutubeMp3Download !== "") {
        setisyoutubeMp3Submitted(true);
        try {
          const response = await axios.request(options2);

          if (response) {
            setisyoutubeMp3Submitted(false);
            //console.log(response.data.dlink);
            router.push(response.data.dlink);
          }
        } catch (error) {
          setisyoutubeMp3Submitted(false);
          console.error(error);
          toast({
            variant: "destructive",
            title: "Uh no ,something went wrong",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Please add the link.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Invalid link!.",
      });
    }
  };

  function alignText(input: string): string {
    // Séparer les lignes par sauts de ligne
    const lines = input.split("\n");

    // Initialiser un tableau pour stocker les paragraphes
    const paragraphs: string[] = [];
    let currentParagraph: string[] = [];

    // Parcourir les lignes
    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Si la ligne est vide, on ignore
      if (trimmedLine.length === 0) return;

      // Si la ligne est un numéro d'index, cela signifie que nous commençons un nouveau paragraphe
      if (/^\d+$/.test(trimmedLine)) {
        // Ajouter le paragraphe précédent s'il y en a un
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph.join("\n"));
          currentParagraph = [];
        }
      }

      // Ajouter la ligne au paragraphe en cours
      currentParagraph.push(trimmedLine);
    });

    // Ajouter le dernier paragraphe s'il reste du contenu
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join("\n"));
    }

    // Joindre les paragraphes avec deux sauts de ligne pour les séparer
    return paragraphs.join("\n\n");
  }

  useEffect(() => {
    const parsedSubtitles = parseSRT(transcriptionResultInSrt.current);
    setSubtitles(parsedSubtitles);
    if (fileId.current) {
      addUserData(
        fileId.current,
        userId,
        transcriptionResultInSrt.current,
        falRequestId.current,
        associedFileName.current,
        type.current,
        size.current
      );
    } else {
      console.log("No fileId found!");
    }
  }, [transcriptionResultInSrt.current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      setProgress((currentTime / audio.duration) * 100);

      const currentSub = subtitles.find(
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );
      setCurrentSubtitle(currentSub || null);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [subtitles]);
  useEffect(() => {
    const audio = audioRef1.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      setProgress((currentTime / audio.duration) * 100);

      const currentSub = subtitles.find(
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );
      setCurrentSubtitleDesktop(currentSub || null);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [subtitles]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime =
      (parseFloat(e.target.value) / 100) * (audioRef.current?.duration || 0);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const handleSubtitleClick = (startTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
    }
    if (playerRef.current) {
      playerRef.current.seekTo(startTime, "seconds");
    }
    if (videoPlayerRef1.current) {
      videoPlayerRef1.current.seekTo(startTime, "seconds");
    }
  };
  const handleSubtitleClickdesktop = (startTime: number) => {
    if (audioRef1.current) {
      audioRef1.current.currentTime = startTime;
    }
    if (playerRef1.current) {
      playerRef1.current.seekTo(startTime, "seconds");
    }
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(startTime, "seconds");
    }
  };

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} className="bg-amber-600 rounded-md">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const dataReturnedProcess = (data: any) => {
    setLoading(false);
    setText(data.text as string);
    //setUsedTextLengh.current = data.text.length;
    setTextLanguageDetected(`${data.inferred_languages}`);
    for (let i = 0; i < data.chunks.length; i++) {
      speakerArray.current.push(`(${data.chunks[i].speaker})`);
      addSpeaker(`(${data.chunks[i].speaker})`);
      let resultInSrt = convertToSRT(
        i,
        `(${data.chunks[i].timestamp})`,
        `${data.chunks[i].text}`
      );
      handleAddConvertedSrtInText(resultInSrt);
    }
  };
  const actualiserTimeUsed = () => {
    //actualise puis update
    const res1Value = parseInt(userAccountData?.Time, 10); // Convertit res1 en entier
    const durationValue = Math.round(durationUploaded.current); // Garantit un entier pour durationUploaded

    if (!isNaN(res1Value) && !isNaN(durationValue)) {
      const timeToUpdate = res1Value - durationValue;

      // Assurez-vous que la valeur est un entier
      const validTime = Math.round(timeToUpdate); // Utilisez Math.floor ou Math.ceil si nécessaire

      updateUsedTime(userId, validTime);
      setTimeout(async () => {
        const res1: any = await getDocument(userId);
        setUserAccountData(res1);
      }, 3000);
    } else {
      console.log("erreur de conversion string to Int");
    }
  };
  const submitSpeech = async () => {
    setSubmitted(true);
    try {
      const { data, requestId } = await fal.subscribe("fal-ai/whisper", {
        input: {
          audio_url: audioUrl.current,
          task: "transcribe",
          chunk_level: "segment",
          version: "3",
          batch_size: 64,
          num_speakers: null,
          diarize: true,
          language: selectedCurrentLanguage.current,
        },
        logs: false,
        /* onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },*/
        // webhookUrl: "",
      });

      falRequestId.current = requestId;

      /*if (falRequestId.current && fileId.current) {
        addUserData(
          fileId.current,
          userId,
          transcriptionResultInSrt.current,
          requestId,
          associedFileName.current,
          type.current,
          size.current
        );
      } else {
        console.log("error: if (requestId && fileId.current) 1212");
      }*/
      if (data) {
        setLoading(false);
        setText(data.text as string);
        setUsedTextLengh.current = data.text.length;
        setTextLanguageDetected(`${data.inferred_languages}`);
        for (let i = 0; i < data.chunks.length; i++) {
          speakerArray.current.push(`(${data.chunks[i].speaker})`);
          addSpeaker(`(${data.chunks[i].speaker})`);
          let resultInSrt = convertToSRT(
            i,
            `(${data.chunks[i].timestamp})`,
            `${data.chunks[i].text}`
          );
          handleAddConvertedSrtInText(resultInSrt);
        }

        toast({
          variant: "default",
          title: "Note.",
          description: "Process finished... ",
        });
        actualiserTimeUsed();

        setSubmitted(false);
        setUserData([]);
        //attend avant de liste les donnees historique de l'user
        setTimeout(() => {
          listUserDATA();
        }, 3000);
      }
    } catch (error) {
      actualiserTimeUsed();
      console.log(error);
      setSubmitted(false);
      console.log("userdata reset! ");
      setUserData([]);
      //attend avant de liste les donnees historique de l'user
      setTimeout(() => {
        console.log("userdata refresh");
        listUserDATA();
      }, 3000);
    }
  };
  //"5111ca19-1af7-48b6-a2a9-fcd6da066eb9"
  const retrieveRequestResult = async (requestId: string) => {
    const result: any = await fal.queue.result("fal-ai/whisper", {
      requestId: "5111ca19-1af7-48b6-a2a9-fcd6da066eb9",
    });
    console.log(result.data);
    dataReturnedProcess(result.data);
  };
  const deleteItemUser_data = async (id: string) => {
    const result = await deleteItemUserData(id);
    deleteAiChat(id);
    await deleteFileItem(id);
    if (result) {
      deleteItemUserHistoric(id);
      console.log(result);
    }
  };

  useEffect(() => {
    if (userId) {
      listUserDATA();
    }
  }, [userId]);

  const onDrop = (acceptedFiles: any) => {
    // On prend le premier fichier s'il est accepté
    setUploadedFile(acceptedFiles[0]);
    handleSubmitToUpload(acceptedFiles[0]);

    transcriptionResultInSrt.current = "";
  };
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { "audio/*": [], "video/*": [] }, onDrop });

  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div>
      {desktopScreen()}
      {mobileScreen()}
    </div>
  );

  function desktopScreen() {
    return (
      <div className="hidden h-screen lg:flex justify-center">
        <ScrollArea className="h-screen w-1/5 p-1">
          <br />
          <br />
          <br />
          <div className="flex justify-center mt-8">
            <div className="grid gap-1 w-[200px] p-3">
              <div className="flex  h-[70px] w-1/5 bg-white fixed top-0 start-0">
                <div className="flex  w-full justify-between mt-5 mx-3">
                  <SidebarClose className="text-gray-500 size-[35px] " />
                  {userAccountData?.isPro ? (
                    <MdWorkspacePremium className="text-amber-500 size-[35px]" />
                  ) : (
                    <p className=" text-gray-500 font-bold mr-2">Free</p>
                  )}
                </div>
              </div>

              <p className="text-center">
                <span className="text-slate-400"> remaining:</span>
                <span>
                  {convertirDuree(parseInt(userAccountData?.Time, 10))}
                </span>
              </p>
              {/* affiche s'il n'y a pas de plan*/}
              {userAccountData?.isPro ? null : (
                <Button
                  className="my-5"
                  variant="outline"
                  onClick={() => {
                    if (userEmail !== null && userEmail !== "") {
                      setAddButtonPlan(true);
                      selectPlan(priceId, userEmail, userId, selectedCredits);
                    } else {
                      console.log("no session!");
                    }
                    console.log(`${priceId}`);
                  }}
                >
                  {addButtonPlan ? (
                    <LoaderIcon className="animate-spin size-5" />
                  ) : (
                    <div className="flex items-center gap-1">
                      <MdWorkspacePremium className="text-amber-500 " />
                      Go pro
                      <span className="text-green-600">20h/mo</span>.
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">
                <SettingsIcon />
              </TabsTrigger>
              <TabsTrigger value="password">
                <HistoryIcon />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div>
                <div className="flex justify-center mt-4">
                  <div className="grid gap-2 max-w-[300px]  shadow-sm rounded-sm p-5 bg-gray-100">
                    <div className="grid gap-2">
                      <p className=" font-bold text-xl ">Task:</p>
                      <Separator />
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                          >
                            {value
                              ? frameworks.find(
                                  (framework) => framework.value === value
                                )?.label
                              : "Select task..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search task..." />
                            <CommandList>
                              <CommandEmpty>No task found.</CommandEmpty>
                              <CommandGroup>
                                {frameworks.map((framework) => (
                                  <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                      setValue(
                                        currentValue === value
                                          ? ""
                                          : currentValue
                                      );

                                      if (currentValue == "translate") {
                                        setAutoDetectLanguage(false);
                                      } else {
                                        selectedCurrentLanguage.current =
                                          undefined;
                                        setAutoDetectLanguage(true);
                                      }
                                      setOpen(false);
                                      //console.log(selectedCurrentTask.current);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        value === framework.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {framework.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>{" "}
                      {!autoDetectLanguage && (
                        <Popover
                          open={openLanguage}
                          onOpenChange={setOpenLanguage}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-[200px] justify-between"
                            >
                              {valueLanguage
                                ? language.find(
                                    (framework) =>
                                      framework.value === valueLanguage
                                  )?.label
                                : "Select Language..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search Language..." />
                              <CommandList>
                                <CommandEmpty>Language not found.</CommandEmpty>
                                <CommandGroup>
                                  {language.map((framework) => (
                                    <CommandItem
                                      key={framework.value}
                                      value={framework.value}
                                      onSelect={(currentValue) => {
                                        setLanguageValue(
                                          currentValue === valueLanguage
                                            ? ""
                                            : currentValue
                                        );
                                        selectedCurrentLanguage.current =
                                          currentValue;
                                        setOpenLanguage(false);
                                        //console.log(selectedCurrentTask.current);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          valueLanguage === framework.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {framework.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                      <div>
                        <Checkbox
                          id="terms2"
                          onCheckedChange={(e: boolean) => {
                            setAutoDetectLanguage(e);
                            if (!e) {
                              selectedCurrentLanguage.current = undefined;
                            } else {
                              selectedCurrentLanguage.current = valueLanguage;
                            }
                            //console.log(e);
                          }}
                          defaultChecked={true}
                        />
                        <br />
                        <p className="text-gray-500">Auto detect Language?</p>
                      </div>
                    </div>

                    <p className=" font-bold text-xl ">Export:</p>
                    <Separator />
                    <Button
                      variant="outline"
                      className="hover:bg-violet-100"
                      onClick={() => {
                        const result = convertSubtitlesToString(
                          subtitles,
                          exportWithShowTime,
                          exportWithSpeakerName
                        );
                        creatPDF(result);
                      }}
                    >
                      export to PDF.{" "}
                      <FaRegFilePdf className="mx-2 text-red-600" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hover:bg-violet-100"
                      onClick={() => {
                        const result = convertSubtitlesToString(
                          subtitles,
                          exportWithShowTime,
                          exportWithSpeakerName
                        );
                        downloadWordFile(result);
                      }}
                    >
                      export to Docx.
                      <TbFileTypeDocx className="mx-2 text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hover:bg-violet-100"
                      onClick={() => {
                        const result = convertSubtitlesToString(
                          subtitles,
                          exportWithShowTime,
                          exportWithSpeakerName
                        );

                        handleDownloadTxt(result);
                      }}
                    >
                      export to Txt.
                      <GrDocumentTxt className="mx-2 text-gray-600" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hover:bg-violet-100"
                      onClick={() => {
                        const result = convertSubtitlesToSRT(subtitles);
                        handleDownloadSrt(result, "srtfile.srt");
                      }}
                    >
                      export to Srt.
                      <MdOutlineSubtitles className="mx-2 text-gray-600" />
                    </Button>
                    <div>
                      <Checkbox
                        id="terms1"
                        onCheckedChange={(e: boolean) => {
                          setExportWithShowTime(e);
                        }}
                        checked={exportWithShowTime}
                      />
                      <br />
                      <p className="text-gray-500 text-sm text-center">
                        export with TimeStamp?
                      </p>
                    </div>
                    <div>
                      <Checkbox
                        id="terms1"
                        onCheckedChange={(e: boolean) => {
                          setExportWithSpeakerName(e);
                        }}
                        checked={exportWithSpeakerName}
                      />
                      <br />
                      <p className="text-gray-500 text-sm text-center">
                        export with Speaker name?
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="flex justify-center mt-10">
                  <div className="grid gap-2 max-w-[200px]  shadow-sm rounded-sm p-5 bg-gray-100">
                    <p className="text-center font-bold">Tools</p>
                    <Separator />
                    <Dialog
                      open={openDesktopDialogYoutubemp3}
                      onOpenChange={setOpenDesktopDialogYoutubemp3}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">Youtube to mp3</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Youtube mp3 downloader</DialogTitle>
                          <DialogDescription>
                            Past youtube link below and get the audio file.
                          </DialogDescription>
                        </DialogHeader>
                        <Input
                          placeholder="Youtube link..."
                          onChange={(e) =>
                            setinputYoutubeMp3Download(e.target.value)
                          }
                          value={inputYoutubeMp3Download}
                        />
                        <Button onClick={downloadMp3FromYT}>
                          {isyoutubeMp3Submitted ? (
                            <ReloadIcon className="animate-spin size-5" />
                          ) : (
                            <DownloadIcon />
                          )}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <br />
                <br />
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="w-full p-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Mettre à jour la requête de recherche
                  placeholder="Search by name..."
                  className="w-full "
                />
              </div>

              {userData.length !== 0 ? (
                <div className="p-2">
                  {filteredData.map((data, index) => (
                    <div
                      key={index}
                      className="grid gap-1  rounded-md p-3 bg-gray-50 hover:bg-slate-100 my-2"
                      onClick={() => {
                        //transcriptionResultInSrt.current = data.historic;
                        const parsedSubtitles = parseSRT(data.historic);
                        // console.log(transcriptionResultInSrt.current)
                        setSubtitles(parsedSubtitles);
                        setTextLanguageDetected("fr");
                        audioUrl.current = getFileUrl(data.$id);
                        loadConversation(data.$id);
                        setConversationId(data.$id);
                        setAudioUrlDispo(true);
                        //setMessages(messagge);
                        setIsVideo(data.type.startsWith("video/"));
                        setfileNameSelected(data.associedFileName);
                        // retrieveRequestResult(data.requestId);

                        // language,name ,type(mp3),size to added
                      }}
                    >
                      <div className="flex justify-between gap-2">
                        <strong className="text-gray-500" key={index + 1}>
                          {data.associedFileName}
                        </strong>
                        {returnTypeIcon(data.type)}
                      </div>

                      <p className="text-[11px]" key={index + 3}>
                        <span className="font-bold">Size:</span>{" "}
                        {bytesToMB(Number(data.size))}
                      </p>

                      <div className="flex items-center" key={index + 5}>
                        <p className="w-3/4 text-[11px]" key={index + 6}>
                          <span className="font-bold">Created at :</span>
                          {formatDate(data.$createdAt)}
                        </p>
                        <Button
                          key={index + 7}
                          className="w-1/4 hover:bg-red-500"
                          variant="ghost"
                          onClick={() => {
                            deleteItemUser_data(data.$id);
                          }}
                        >
                          <TrashIcon className="text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center">
                  <ImFilesEmpty className="mt-10 text-blue-300" size={60} />
                </div>
              )}
              {/* Message si aucun résultat */}
              {filteredData.length === 0 && (
                <p className="text-gray-500 text-center mt-4">
                  No results found.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="flex justify-center w-4/5 bg-gray-50">
          <Separator orientation="vertical" />
          <ScrollArea className="h-screen w-full">
            <br />
            <br />
            <br />
            <br />
            <div className="w-full ">
              <div className="grid gap-5">
                <div className="flex justify-between  h-[70px] w-4/5 bg-white fixed top-0 ">
                  <p className="text-3xl font-bold ml-10 mt-5 text-gray-500 underline   text-center ">
                    Auddai
                  </p>
                  <div className="mr-10 mt-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <MdAccountCircle className="size-[30px] text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuItem onClick={cancelSubscription}>
                          Cancel subscription
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>API</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logOut}>
                          Log out
                          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid gap-1 bg-white mx-10 p-10 rounded-lg">
                  <div>
                    <div className="flex justify-center my-2">
                      {uploadIsLoaded ? (
                        <Progress value={progresspercent} className="w-[60%]" />
                      ) : null}
                    </div>
                    <div className="flex justify-center">
                      <div
                        {...getRootProps({ style })}
                        className=" max-w-[500px]"
                      >
                        <input {...getInputProps()} />
                        {uploadedFile ? (
                          <div>
                            <h4 className="text-center">Uploaded file:</h4>
                            <p className="text-center">{uploadedFile.name}</p>
                          </div>
                        ) : (
                          <div className="grid gap-2">
                            <div className="flex justify-center">
                              <UploadCloud />
                            </div>
                            <p className="text-center">
                              Drag and drop audio /video files here , or click
                              to select files
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-center text-gray-600">-----Or-----</p>
                    <div className="flex justify-center">
                      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <Input
                          className="max-w-[500px] min-w-[400px]"
                          placeholder="Paste youtube link Here..."
                          value={youtubeUrl}
                          onChange={(e) => {
                            setYoutubeUrl(e.target.value);
                          }}
                        />

                        <div>
                          {checkingUrl ? (
                            <>
                              <LoaderIcon className="animate-spin size-5" />
                            </>
                          ) : (
                            <>
                              <Button
                                className="bg-white hover:bg-blue-100"
                                variant="ghost"
                                onClick={() => {
                                  setYoutubeUrl("");
                                  firstcheck.current = 0;
                                }}
                              >
                                <DeleteIcon />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {textLanguageDetected ? (
                  <div className="m-4">
                    <p className=" ml-4  text-gray-600">
                      Language:(
                      <span className="text-blue-400">
                        {textLanguageDetected}
                      </span>
                      )
                    </p>

                    <div className="p-4">
                      <div className="mb-4">
                        <Checkbox
                          id="terms1"
                          onCheckedChange={(e: boolean) => {
                            setShowTime(e);
                          }}
                          defaultChecked={true}
                          checked={showTime}
                        />
                        <p>Show timeStamp & speaker?</p>
                      </div>
                      <div className="flex items-center gap-5 ">
                        <Button variant="outline" onClick={handleCopy}>
                          <CopyIcon className="text-blue-400" />
                        </Button>

                        <Input
                          placeholder="Search text or word..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Separator className="my-3" />
                      <div className=" shadow-md rounded-xl p-3 bg-white">
                        <ScrollArea className="h-[400px]">
                          {subtitles.map((sub, index) => (
                            <div key={index} className="my-2">
                              {editingIndex === index ? (
                                <div className="flex gap-2">
                                  <Input
                                    value={editedText}
                                    onChange={handleEditChange}
                                  />
                                  <Button
                                    variant="outline"
                                    onClick={() => handleEditSave(index)}
                                  >
                                    <CheckIcon className="text-green-600" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="my-2">
                                  {showTime && (
                                    <div>
                                      {returnIconSpeaker(
                                        speakerArrayShow[index]
                                      )}
                                      <p className="text-gray-500">
                                        {speakerArrayShow[index]}
                                      </p>
                                    </div>
                                  )}

                                  <p
                                    className={`cursor-pointer ${
                                      currentSubtitleDesktop === sub
                                        ? "bg-blue-100 rounded-xl"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleSubtitleClickdesktop(sub.start)
                                    }
                                  >
                                    {showTime && (
                                      <span className="mr-2 text-gray-500">
                                        ({formatTime(sub.start)})
                                      </span>
                                    )}
                                    {highlightText(sub.text, searchTerm)}
                                    <Button
                                      onClick={() => handleEditClick(index)}
                                      variant="ghost"
                                      size="sm"
                                    >
                                      <Edit2Icon className="size-[12px] text-gray-500" />
                                    </Button>
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {isSubmitted ? (
                      <div className="flex justify-center">
                        <LoaderIcon className="h-5 w-5 animate-spin" />
                      </div>
                    ) : (
                      <div className="flex justify-center mt-10">
                        <Image
                          alt="no data"
                          src={noData}
                          className="size-[300px]"
                        />
                      </div>
                    )}
                  </>
                )}

                {textLanguageDetected && (
                  <Button
                    variant="outline"
                    className="m-4"
                    onClick={() => {
                      if (uploadedFile) {
                        //handleSubmit(uploadedFile);
                        submitSpeech();
                      } else {
                        alert("file not found!");
                      }
                    }}
                    disabled={isSubmitted}
                  >
                    {isSubmitted ? (
                      <LoaderIcon className="h-5 w-5 animate-spin" />
                    ) : (
                      <div className="flex items-center">
                        <LoopIcon className="m-2" />
                        <p>Retranscribe</p>
                      </div>
                    )}
                  </Button>
                )}

                {isAudioUrlDispo && isVideo && !youtubePlayerUrl && (
                  <div className=" w-[400px]  p-1  rounded-t-md bg-slate-100 lg:fixed bottom-1 end-1">
                    <div className="flex justify-center ">
                      {" "}
                      <ReactPlayer
                        ref={videoPlayerRef}
                        width="100%"
                        height="100%"
                        playing={videoIsplaying}
                        light={true}
                        url={audioUrl.current}
                        onDuration={(e) => console.log(`duration:${e}`)}
                        onSeek={(e) => console.log("onSeek", e)}
                        onProgress={handleProgressDesktop}
                      />
                    </div>

                    <div className="flex justify-center m-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setVideoPlaying(!videoIsplaying);
                        }}
                      >
                        {videoIsplaying ? <PauseIcon /> : <PlayIcon />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {isAudioUrlDispo && isVideo && youtubePlayerUrl && (
                  <div className="bg-gray-100 p-2 rounded-md fixed bottom-0 end-1">
                    <YouTubePlayer
                      width={400}
                      height={200}
                      ref={playerRef1}
                      url={youtubeUrl}
                      controls={true}
                      onProgress={handleProgressDesktop}
                    />
                  </div>
                )}
              </div>{" "}
              <br />
              <Separator />
              <br />
              <div className="grid gap-3 my-10">
                <p className="text-center">2024 AudiScribe </p>
                <div className="flex justify-center">
                  <div className="flex items-center gap-3">
                    <p>Home</p>
                    <p>Blog</p>
                    <p>Pricing</p>
                    <p>FAQs</p>
                    <p>Support</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex items-center gap-3">
                    <p>Youtube downloader</p>
                    <p>WhatsApp</p>
                    <p>Terms</p>
                  </div>
                </div>

                <p className="text-center">Privacy</p>
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </ScrollArea>
          <div className="flex flex-col w-4/5 fixed bottom-0">
            <div className="flex justify-end">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="mb-10 mr-10">
                    <FaRobot className="text-violet-500 size-[60px] " />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-center">
                      Ai Query.
                      <span className="text-sm text-gray-400 ">
                        (Powered by Gemini)
                      </span>
                      <span className="text-sm text-amber-200 ">-2min/req</span>
                    </SheetTitle>
                    <SheetDescription className="text-center">
                      Ask AI about your selected audio:
                      <span className="text-violet-500 font-bold">
                        {fileNameSelected}
                      </span>
                      .
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-screen">
                    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
                      {messages.map((m) => (
                        <div key={m.id} className="whitespace-pre-wrap">
                          {m.role == "user" ? (
                            <div className="flex justify-end">
                              <div className="grid gap-1 mr-5">
                                <div className="flex justify-end">
                                  <UserIcon className="size-[30px] text-blue-500" />
                                </div>
                                <div className="flex items-center p-3  bg-gray-200 rounded-[30px] ">
                                  {m.content}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid gap-1">
                              <FaRobot className="size-[30px] text-violet-500" />
                              <div className="flex items-center p-3  ">
                                <FormattedText text={m.content} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="grid gap-1 mt-5">
                          <div className="flex justify-center">
                            <FaSpinner className="animate-spin" />
                          </div>
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => stop()}
                          >
                            <AiFillCloseCircle />
                          </Button>
                        </div>
                      )}
                      {error && (
                        <>
                          <p className="text-red-500 text-center">
                            An error occurred.
                          </p>
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => reload()}
                          >
                            <ReloadIcon />
                          </Button>
                        </>
                      )}

                      <form
                        onSubmit={(event) => {
                          handleSubmit(event, {
                            body: {
                              customKey: convertSubtitlesToString(
                                subtitles,
                                true,
                                true
                              ),
                            },
                          });
                        }}
                      >
                        <div className="bg-gray-200 fixed bottom-5  rounded-lg p-2">
                          <div className="end-10 flex items-center gap-2 ">
                            <Input
                              value={input}
                              placeholder="ask AI something..."
                              onChange={handleInputChange}
                              disabled={isLoading}
                            />
                            <Button
                              disabled={isLoading}
                              variant="ghost"
                              type="submit"
                            >
                              <SendIcon className="text-violet-500" />
                            </Button>
                          </div>
                        </div>
                      </form>
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                    </div>{" "}
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>

            {isAudioUrlDispo && !isVideo && (
              <div className="grid gap-3 w-full   bg-slate-200 p-3 rounded-t-md">
                <strong className="text-center text-gray-500">
                  {fileNameSelected}
                </strong>
                <audio
                  ref={audioRef1}
                  src={audioUrl.current}
                  controls
                  className="w-full "
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  function mobileScreen() {
    return (
      <div className="lg:hidden p-3 bg-gray-50">
        <div className="flex justify-between  top-2 end-2 m-2">
          <Image src={logo} alt="logo" className="size-[40px] rounded-full" />
          <div className="flex items-center gap-2">
            {userAccountData?.isPro ? (
              <MdWorkspacePremium className="text-amber-500 size-[35px]" />
            ) : (
              <p className=" text-gray-500 font-bold mr-2">Free</p>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MdAccountCircle className="size-[30px] text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem onClick={cancelSubscription}>
                  Cancel subscription
                </DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logOut}>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex justify-center my-5 bg-slate-100 rounded-md p-4">
          <div className="grid gap-3">
            <p className="text-center">
              <span className="text-slate-400"> remaining:</span>
              <span>{convertirDuree(parseInt(userAccountData?.Time, 10))}</span>
            </p>
            {/* affiche s'il n'y a pas de plan*/}
            {userAccountData?.isPro ? null : (
              <Button
                className="my-5"
                variant="outline"
                onClick={() => {
                  if (userEmail !== null && userEmail !== "") {
                    setAddButtonPlan(true);
                    selectPlan(priceId, userEmail, userId, selectedCredits);
                  } else {
                    console.log("no session!");
                  }
                  console.log(`${priceId}`);
                }}
              >
                {addButtonPlan ? (
                  <LoaderIcon className="animate-spin size-5" />
                ) : (
                  <div className="flex items-center gap-1">
                    <MdWorkspacePremium className="text-amber-500 " />
                    Go pro
                    <span className="text-green-600">20h/mo</span>.
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="w-full  mt-5">
          <div className="grid gap-5">
            <div className="grid gap-1">
              <div className="bg-white p-5 rounded-md">
                <div className="flex justify-center my-1">
                  {uploadIsLoaded ? (
                    <Progress value={progresspercent} className="w-[60%]" />
                  ) : null}
                </div>
                <div className="flex justify-center">
                  <div {...getRootProps({ style })} className=" max-w-[400px]">
                    <input {...getInputProps()} />
                    {uploadedFile ? (
                      <div>
                        <h4 className="text-center">Uploaded file:</h4>
                        <p className="text-center">{uploadedFile.name}</p>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <div className="flex justify-center">
                          <UploadCloud />
                        </div>
                        <p className="text-center">
                          Drag and drop audio/video files here,or click to
                          select files
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-center text-gray-300">-----Or-----</p>
                <div className="flex justify-center w-full">
                  <div className="grid gap-3 w-full max-w-[400px]">
                    <div className="flex items-center  gap-2 bg-gray-100 p-3 rounded-lg">
                      <Input
                        className="w-full "
                        placeholder="Paste youtube link Here..."
                        value={youtubeUrl}
                        onChange={(e) => {
                          setYoutubeUrl(e.target.value);
                        }}
                      />

                      {checkingUrl ? (
                        <>
                          <LoaderIcon className="animate-spin size-5" />
                        </>
                      ) : (
                        <>
                          <Button
                            className="bg-white hover:bg-blue-100"
                            variant="ghost"
                            onClick={() => {
                              setYoutubeUrl("");
                              firstcheck.current = 0;
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="mb-4 mt-1 ">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <GrAddCircle />
                    </AccordionTrigger>
                    <AccordionContent>
                      <Tabs defaultValue="historic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="setting">
                            <SettingsIcon />
                          </TabsTrigger>
                          <TabsTrigger value="historic">
                            <HistoryIcon />
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="setting">
                          <div className="grid  gap-4 ">
                            <Popover
                              open={openMobile}
                              onOpenChange={setOpenMobile}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className="w-[200px] justify-between"
                                >
                                  {value
                                    ? frameworks.find(
                                        (framework) => framework.value === value
                                      )?.label
                                    : "Select task..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput placeholder="Search task..." />
                                  <CommandList>
                                    <CommandEmpty>No task found.</CommandEmpty>
                                    <CommandGroup>
                                      {frameworks.map((framework) => (
                                        <CommandItem
                                          key={framework.value}
                                          value={framework.value}
                                          onSelect={(currentValue) => {
                                            setValue(
                                              currentValue === value
                                                ? ""
                                                : currentValue
                                            );
                                            // selectedCurrentTask.current = currentValue;
                                            if (currentValue == "translate") {
                                              setAutoDetectLanguage(false);
                                            } else {
                                              selectedCurrentLanguage.current =
                                                undefined;
                                              setAutoDetectLanguage(true);
                                            }
                                            setOpenMobile(false);
                                            //console.log(selectedCurrentTask.current);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              value === framework.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {framework.label}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>{" "}
                            {!autoDetectLanguage && (
                              <Popover
                                open={openLanguageMobile}
                                onOpenChange={setOpenLanguageMobile}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[200px] justify-between"
                                  >
                                    {valueLanguage
                                      ? language.find(
                                          (framework) =>
                                            framework.value === valueLanguage
                                        )?.label
                                      : "Select Language..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                  <Command>
                                    <CommandInput placeholder="Search Language..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        Language not found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {language.map((framework) => (
                                          <CommandItem
                                            key={framework.value}
                                            value={framework.value}
                                            onSelect={(currentValue) => {
                                              setLanguageValue(
                                                currentValue === valueLanguage
                                                  ? ""
                                                  : currentValue
                                              );
                                              selectedCurrentLanguage.current =
                                                currentValue;

                                              setOpenLanguageMobile(false);
                                              //console.log(selectedCurrentTask.current);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                valueLanguage ===
                                                  framework.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {framework.label}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            )}
                            <div className="flex items-center gap-2">
                              <div>
                                <Checkbox
                                  id="terms2"
                                  onCheckedChange={(e: boolean) => {
                                    setAutoDetectLanguage(e);
                                    if (!e) {
                                      selectedCurrentLanguage.current =
                                        undefined;
                                    } else {
                                      selectedCurrentLanguage.current =
                                        valueLanguage;
                                    }
                                    //console.log(e);
                                  }}
                                  defaultChecked={true}
                                />
                                <br />
                                <p className="text-gray-500 text-[10px]">
                                  Auto detect Language?
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline">
                                    <FaToolbox className="text-blue-400" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Some Tools</DialogTitle>
                                    <DialogDescription>
                                      additionnal tools to simplify your life.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-center mt-10">
                                    <div className="grid gap-2 w-full  shadow-sm rounded-sm p-5 bg-gray-100">
                                      <p className="text-center font-bold">
                                        Tools
                                      </p>

                                      <Drawer
                                        open={openMobileDialogYoutubemp3}
                                        onOpenChange={
                                          setOpenMobileDialogYoutubemp3
                                        }
                                      >
                                        <DrawerTrigger asChild>
                                          <Button variant="outline">
                                            Youtube to mp3
                                          </Button>
                                        </DrawerTrigger>
                                        <DrawerContent>
                                          <DrawerHeader className="text-left">
                                            <DrawerTitle>
                                              Youtube to mp3 downloader.
                                            </DrawerTitle>
                                            <DrawerDescription>
                                              Past youtube link below to
                                              download it.
                                            </DrawerDescription>
                                          </DrawerHeader>
                                          <div className="grid gap-5 p-5 m-4">
                                            <Input
                                              placeholder="Youtube link..."
                                              onChange={(e) =>
                                                setinputYoutubeMp3Download(
                                                  e.target.value
                                                )
                                              }
                                              value={inputYoutubeMp3Download}
                                            />
                                            <Button onClick={downloadMp3FromYT}>
                                              {isyoutubeMp3Submitted ? (
                                                <ReloadIcon className="animate-spin size-5" />
                                              ) : (
                                                <DownloadIcon />
                                              )}
                                            </Button>
                                          </div>

                                          <DrawerFooter className="pt-2">
                                            <DrawerClose asChild>
                                              <Button variant="outline">
                                                Cancel
                                              </Button>
                                            </DrawerClose>
                                          </DrawerFooter>
                                        </DrawerContent>
                                      </Drawer>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Drawer
                                open={openForMobileExport}
                                onOpenChange={setOpenForMobileExport}
                              >
                                <DrawerTrigger asChild>
                                  <Button variant="outline">
                                    <FaFileExport className="text-blue-400" />
                                  </Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                  <DrawerHeader className="text-left">
                                    <DrawerTitle>
                                      Download your file
                                    </DrawerTitle>
                                    <DrawerDescription>
                                      Choose your format.
                                    </DrawerDescription>
                                  </DrawerHeader>
                                  <div className="w-full">
                                    <div className="flex justify-center">
                                      <div className="grid gap-2 w-full  shadow-sm rounded-sm p-5 bg-gray-100">
                                        <p className=" font-bold text-xl ">
                                          Export:
                                        </p>
                                        <Separator />
                                        <Button
                                          variant="outline"
                                          className="hover:bg-blue-100"
                                          onClick={() => {
                                            const result =
                                              convertSubtitlesToString(
                                                subtitles,
                                                exportWithShowTime,
                                                exportWithSpeakerName
                                              );
                                            creatPDF(result);
                                          }}
                                        >
                                          export to PDF.{" "}
                                          <FaRegFilePdf className="mx-2 text-red-600" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="hover:bg-blue-100"
                                          onClick={() => {
                                            const result =
                                              convertSubtitlesToString(
                                                subtitles,
                                                exportWithShowTime,
                                                exportWithSpeakerName
                                              );
                                            downloadWordFile(result);
                                          }}
                                        >
                                          export to Docx.
                                          <TbFileTypeDocx className="mx-2 text-blue-600" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="hover:bg-violet-100"
                                          onClick={() => {
                                            const result =
                                              convertSubtitlesToString(
                                                subtitles,
                                                exportWithShowTime,
                                                exportWithSpeakerName
                                              );
                                            handleDownloadTxt(result);
                                          }}
                                        >
                                          export to Txt.
                                          <GrDocumentTxt className="mx-2 text-gray-600" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="hover:bg-blue-100"
                                          onClick={() => {
                                            const result =
                                              convertSubtitlesToSRT(subtitles);
                                            handleDownloadSrt(
                                              result,
                                              "srtfile.srt"
                                            );
                                          }}
                                        >
                                          export to Srt.
                                          <MdOutlineSubtitles className="mx-2 text-gray-600" />
                                        </Button>
                                        <div className="flex items-center gap-3">
                                          <div>
                                            <Checkbox
                                              id="terms1"
                                              onCheckedChange={(e: boolean) => {
                                                setExportWithShowTime(e);
                                              }}
                                              checked={exportWithShowTime}
                                            />
                                            <br />
                                            <p className="text-gray-500 text-sm text-center">
                                              export with TimeStamp?
                                            </p>
                                          </div>
                                          <div>
                                            <Checkbox
                                              id="terms1"
                                              onCheckedChange={(e: boolean) => {
                                                setExportWithSpeakerName(e);
                                              }}
                                              checked={exportWithSpeakerName}
                                            />
                                            <br />
                                            <p className="text-gray-500 text-sm text-center">
                                              export with Speaker name?
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>{" "}
                                  </div>
                                  <DrawerFooter className="pt-2">
                                    <DrawerClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DrawerClose>
                                  </DrawerFooter>
                                </DrawerContent>
                              </Drawer>
                            </div>{" "}
                          </div>
                        </TabsContent>
                        <TabsContent value="historic">
                          <ScrollArea className="h-[400px]">
                            <div className="w-full p-2">
                              <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // Mettre à jour la requête de recherche
                                placeholder="Search by name..."
                                className="w-full "
                              />
                            </div>
                            {userData.length !== 0 ? (
                              <div className="p-2">
                                {filteredData.map((data, index) => (
                                  <div
                                    key={index}
                                    className="grid gap-1 rounded-md p-3 bg-white hover:bg-slate-100 my-2"
                                    onClick={() => {
                                      //transcriptionResultInSrt.current = data.historic;
                                      const parsedSubtitles = parseSRT(
                                        data.historic
                                      );
                                      setSubtitles(parsedSubtitles);
                                      setTextLanguageDetected("fr");
                                      audioUrl.current = getFileUrl(data.$id);
                                      loadConversation(data.$id);
                                      setConversationId(data.$id);
                                      setAudioUrlDispo(true);
                                      setIsVideo(
                                        data.type.startsWith("video/")
                                      );
                                      setfileNameSelected(
                                        data.associedFileName
                                      );

                                      // language,name ,type(mp3),size to added
                                    }}
                                  >
                                    <div className="flex justify-between gap-1">
                                      <strong
                                        className="text-gray-500"
                                        key={index + 1}
                                      >
                                        {data.associedFileName}
                                      </strong>
                                      {returnTypeIcon(data.type)}
                                    </div>
                                    <p className="text-[11px]" key={index + 3}>
                                      <span className="font-bold">Size:</span>{" "}
                                      {bytesToMB(Number(data.size))}
                                    </p>
                                    <div
                                      className="flex items-center gap-2"
                                      key={index + 5}
                                    >
                                      <p
                                        className="w-3/4 text-[11px]"
                                        key={index + 6}
                                      >
                                        <span className="font-bold">
                                          Created at:
                                        </span>

                                        {formatDate(data.$createdAt)}
                                      </p>
                                      <Button
                                        key={index + 7}
                                        className="w-1/4 hover:bg-red-300"
                                        variant="ghost"
                                        onClick={() => {
                                          deleteItemUser_data(data.$id);
                                        }}
                                      >
                                        <TrashIcon className="text-red-400" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <ImFilesEmpty
                                  className="mt-10 text-blue-300"
                                  size={60}
                                />
                              </div>
                            )}
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            {textLanguageDetected ? (
              <div className="m-1">
                <p className="text-[10px] mb-3 text-gray-600">
                  Language:(
                  <span className="text-blue-400">{textLanguageDetected}</span>)
                </p>
                <div>
                  <div className="mb-4">
                    <Checkbox
                      id="terms1"
                      onCheckedChange={(e: boolean) => {
                        setShowTime(e);
                      }}
                      defaultChecked={true}
                      checked={showTime}
                    />
                    <p>Show timeStamp?</p>
                  </div>

                  <div className="flex items-center gap-5 ">
                    <Button variant="outline" onClick={handleCopy}>
                      <CopyIcon className="text-blue-400" />
                    </Button>

                    <Input
                      placeholder="Search text or word..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Drawer
                      open={openForMobileExport}
                      onOpenChange={setOpenForMobileExport}
                    >
                      <DrawerTrigger asChild>
                        <Button variant="outline">
                          <FaFileExport className="text-blue-400" />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader className="text-left">
                          <DrawerTitle>Download your file</DrawerTitle>
                          <DrawerDescription>
                            Choose your format.
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="w-full">
                          <div className="flex justify-center">
                            <div className="grid gap-2 w-full  shadow-sm rounded-sm p-5 bg-gray-100">
                              <p className=" font-bold text-xl ">Export:</p>
                              <Separator />
                              <Button
                                variant="outline"
                                className="hover:bg-green-100"
                                onClick={() => {
                                  const result = convertSubtitlesToString(
                                    subtitles,
                                    exportWithShowTime,
                                    exportWithSpeakerName
                                  );
                                  creatPDF(result);
                                }}
                              >
                                export to PDF.{" "}
                                <FaRegFilePdf className="mx-2 text-red-600" />
                              </Button>
                              <Button
                                variant="outline"
                                className="hover:bg-green-100"
                                onClick={() => {
                                  const result = convertSubtitlesToString(
                                    subtitles,
                                    exportWithShowTime,
                                    exportWithSpeakerName
                                  );
                                  downloadWordFile(result);
                                }}
                              >
                                export to Docx.
                                <TbFileTypeDocx className="mx-2 text-blue-600" />
                              </Button>
                              <Button
                                variant="outline"
                                className="hover:bg-green-100"
                                onClick={() => {
                                  const result = convertSubtitlesToString(
                                    subtitles,
                                    exportWithShowTime,
                                    exportWithSpeakerName
                                  );
                                  handleDownloadTxt(result);
                                }}
                              >
                                export to Txt.
                                <GrDocumentTxt className="mx-2 text-gray-600" />
                              </Button>
                              <Button
                                variant="outline"
                                className="hover:bg-green-100"
                                onClick={() => {
                                  const result =
                                    convertSubtitlesToSRT(subtitles);
                                  handleDownloadSrt(result, "srtfile.srt");
                                }}
                              >
                                export to Srt.
                                <MdOutlineSubtitles className="mx-2 text-gray-600" />
                              </Button>
                              <div className="flex items-center gap-3">
                                <div>
                                  <Checkbox
                                    id="terms1"
                                    onCheckedChange={(e: boolean) => {
                                      setExportWithShowTime(e);
                                    }}
                                    checked={exportWithShowTime}
                                  />
                                  <br />
                                  <p className="text-gray-500 text-sm text-center">
                                    export with TimeStamp?
                                  </p>
                                </div>
                                <div>
                                  <Checkbox
                                    id="terms1"
                                    onCheckedChange={(e: boolean) => {
                                      setExportWithSpeakerName(e);
                                    }}
                                    checked={exportWithSpeakerName}
                                  />
                                  <br />
                                  <p className="text-gray-500 text-sm text-center">
                                    export with Speaker name?
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>{" "}
                        </div>
                        <DrawerFooter className="pt-2">
                          <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>

                  <Separator className="my-3" />
                  <div className="shadow-md rounded-xl p-3 bg-white">
                    <ScrollArea className="h-[400px]">
                      {subtitles.map((sub, index) => (
                        <div key={index} className="my-2">
                          {editingIndex === index ? (
                            <div className="flex gap-2">
                              <Textarea
                                value={editedText}
                                onChange={handleEditChange}
                                className="h-[100px]"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSave(index)}
                              >
                                <CheckIcon className="text-green-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="my-1">
                              {showTime && (
                                <div>
                                  {returnIconSpeaker(speakerArrayShow[index])}
                                  <p className="text-gray-500">
                                    {speakerArrayShow[index]}
                                  </p>
                                </div>
                              )}
                              <p
                                className={`cursor-pointer ${
                                  currentSubtitle === sub
                                    ? "bg-blue-100 rounded-xl "
                                    : ""
                                }`}
                                onClick={() => handleSubtitleClick(sub.start)}
                              >
                                {showTime && (
                                  <span className="mr-2 text-gray-500">
                                    ({formatTime(sub.start)})
                                  </span>
                                )}
                                {highlightText(sub.text, searchTerm)}
                                <Button
                                  onClick={() => handleEditClick(index)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Edit2Icon className="size-[12px] text-gray-500" />
                                </Button>
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {isSubmitted ? (
                  <div className="flex justify-center">
                    <LoaderIcon className="h-5 w-5 animate-spin" />
                  </div>
                ) : (
                  <div className="flex justify-center mt-5">
                    <Image
                      alt="no data"
                      src={noData}
                      className="size-[200px]"
                    />
                  </div>
                )}
              </>
            )}
            {textLanguageDetected && (
              <Button
                variant="outline"
                onClick={() => {
                  if (uploadedFile) {
                    //handleSubmit(uploadedFile);
                    submitSpeech();
                  } else {
                    alert("file not found!");
                  }
                }}
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center">
                    <LoopIcon className="m-2" />
                    <p>Retranscribe</p>
                  </div>
                )}
              </Button>
            )}

            <div className="flex flex-col w-full fixed bottom-0">
              <div className="flex justify-end">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="lg" className="mb-5 mr-5">
                      <FaRobot className="text-violet-500 size-[40px]" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle className="text-center">
                        Ai query
                        <span className="text-sm text-gray-400 ">
                          (Powered by Gemini)
                        </span>
                        <span className="text-sm text-amber-200 ">
                          -2min/req
                        </span>
                      </SheetTitle>
                      <SheetDescription className="text-center">
                        Ask ai about your selected audio:
                        <span className="text-violet-500">
                          {fileNameSelected}
                        </span>
                        .
                      </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-screen">
                      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
                        {messages.map((m) => (
                          <div key={m.id} className="whitespace-pre-wrap">
                            {m.role == "user" ? (
                              <div className="flex justify-end">
                                <div className="grid gap-1 mr-5">
                                  <div className="flex justify-end">
                                    <UserIcon className="size-[30px] text-blue-500" />
                                  </div>
                                  <div className="flex items-center p-3  bg-gray-200 rounded-[30px] ">
                                    <p className="text-sm">{m.content}</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="grid gap-1 mt-2">
                                <FaRobot className="size-[30px] text-violet-500" />

                                <div className="flex items-center  p-3  ">
                                  <FormattedText text={m.content} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {isLoading && (
                          <div className="grid gap-1 mt-5">
                            <div className="flex justify-center">
                              <FaSpinner className="animate-spin" />
                            </div>
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() => stop()}
                            >
                              <AiFillCloseCircle />
                            </Button>
                          </div>
                        )}
                        {error && (
                          <>
                            <p className="text-red-500 text-center">
                              An error occurred.
                            </p>
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() => reload()}
                            >
                              <ReloadIcon />
                            </Button>
                          </>
                        )}
                        <form
                          onSubmit={(event) => {
                            handleSubmit(event, {
                              body: {
                                customKey: convertSubtitlesToString(
                                  subtitles,
                                  true,
                                  true
                                ),
                              },
                            });
                          }}
                        >
                          <div className="bg-gray-200 fixed bottom-5 mr-5 rounded-lg p-2">
                            <div className="end-10 flex items-center gap-2 ">
                              <Textarea
                                value={input}
                                placeholder="ask AI something..."
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className="h-[40px]"
                              />
                              <Button
                                disabled={isLoading}
                                variant="ghost"
                                type="submit"
                              >
                                <SendIcon className="text-violet-500" />
                              </Button>
                            </div>
                          </div>
                        </form>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </div>

              {isAudioUrlDispo && !isVideo && (
                <div className="grid gap-2 w-full bg-slate-200 p-2 rounded-t-md">
                  <p className="text-gray-500 text-center">
                    {fileNameSelected}
                  </p>
                  <audio
                    ref={audioRef}
                    src={audioUrl.current}
                    controls
                    className="w-full "
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center fixed bottom-0 start-2">
              {isAudioUrlDispo && isVideo && !youtubePlayerUrl && (
                <div className=" w-4/5  p-1  rounded-t-md bg-slate-50">
                  <div className="flex justify-center m-3">
                    <ReactPlayer
                      ref={videoPlayerRef1}
                      width="100%"
                      height="100%"
                      playing={videoIsplaying}
                      light={false}
                      url={audioUrl.current}
                      onDuration={(e) => console.log(`duration:${e}`)}
                      onSeek={(e) => console.log("onSeek", e)}
                      onProgress={handleProgressDesktop}
                    />
                  </div>

                  <div className="flex justify-center m-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setVideoPlaying(!videoIsplaying);
                      }}
                    >
                      {videoIsplaying ? <PauseIcon /> : <PlayIcon />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            {isAudioUrlDispo && isVideo && youtubePlayerUrl && (
              <div className="bg-gray-100 p-2 rounded-md fixed bottom-0 start-2">
                <YouTubePlayer
                  width={350}
                  height={200}
                  ref={playerRef}
                  url={youtubeUrl}
                  controls={true}
                  onProgress={handleProgress}
                />
              </div>
            )}
          </div>{" "}
          <br />
          <Separator />
          <br />
          <div className="grid gap-3 my-10">
            <p className="text-center text-sm text-gray-600 ">
              2024 AudiScribe{" "}
            </p>
            <div className="flex justify-center">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">Home</p>
                <p className="text-sm text-gray-600">Blog</p>
                <p className="text-sm text-gray-600">Pricing</p>
                <p className="text-sm text-gray-600">FAQs</p>
                <p className="text-sm text-gray-600">Support</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">Youtube downloader</p>
                <p className="text-sm text-gray-600">WhatsApp</p>
                <p className="text-sm text-gray-600">Terms</p>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">Privacy</p>
          </div>
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}

/*
 <div className="space-y-2">
                        <p className="font-semibold">Choose a question:</p>
                        {suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendQuestion(question)} // Envoie automatique au clic
                            className="block w-full p-2 rounded-md text-left border bg-gray-100 hover:bg-gray-200"
                          >
                            {question}
                          </button>
                        ))}
                      </div>

*/
