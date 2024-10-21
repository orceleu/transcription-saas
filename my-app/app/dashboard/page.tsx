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
  FaChessKing,
  FaFileExport,
  FaRegFilePdf,
  FaToolbox,
} from "react-icons/fa6";
import { TbFileTypeDocx } from "react-icons/tb";
import { GrDocumentTxt } from "react-icons/gr";
import { useDropzone } from "react-dropzone";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  ArrowBigLeft,
  ArrowBigLeftIcon,
  AudioWaveformIcon,
  Check,
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDown,
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  Edit2Icon,
  Infinity,
  LoaderIcon,
  MoreHorizontal,
  PauseIcon,
  PlayIcon,
  PlusCircleIcon,
  SaveIcon,
  SearchIcon,
  Settings,
  TrashIcon,
  UploadCloud,
  UploadIcon,
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun, PageBreak } from "docx";
import { saveAs } from "file-saver";
import noData from "../../public/nodata2.svg";
import { Player } from "react-simple-player";
import { useRouter } from "next/navigation";
import * as fal from "@fal-ai/serverless-client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  listAll,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/app/firebase/config";
import { jsPDF } from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import { Input } from "@/components/ui/input";
import {
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
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import YouTubePlayer from "react-player/youtube";
import { returnIconSpeaker } from "./returnFunction";
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
export default function Dashboard() {
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
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [videoIsplaying, setVideoPlaying] = useState(false);
  const [userId, setUserid] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const audioUrl = useRef("");
  const [usedCharCurrent, setUsedCharCurrent] = useState(0);
  const [having_plan, setHavingPlan] = useState(true);
  const firstcheck = useRef(0);
  const isTranslante = useRef(false);
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
  const MAX_LENGTH = 300;
  const priceId = "price_1Pp8vvHMq3uIqhfsUZwVE60I";
  const addSpeaker = (newItem: string) => {
    setSpeakerArrayShow((prevItems) => [...prevItems, newItem]);
  };
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditedText(subtitles[index].text);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const cancelSubscription = async () => {
    await axios
      .post("/api/cancelsub", {
        subscriptionId: priceId,
      })
      .then((res) => {
        const { data } = res.data;
        console.log(data);
        toast({
          variant: "default",
          title: "update",
          description: `${data}`,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${error}`,
        });
      });
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
      label: "Translation to -->",
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
      saveAs(blob, "exemple.docx");
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
      link.download = "exemple.txt";

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
      const finalText = ` GENERATED WITH AudiSribe AI ---Upgrade your plan to remove this text \n ${text} --- `;
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
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      // Télécharger le fichier PDF
      doc.save("exemple.pdf");
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
        await navigator.clipboard.writeText(texte);
        alert("Copied to clipboard!");
      } catch (err) {
        console.error("Échec de la copie du texte : ", err);
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

  const handleActiveButton = () => {
    firstcheck.current += 1;
    console.log(firstcheck.current);
    if (firstcheck.current < 4) {
      //console.log("not locked");

      if (youtubeUrl.slice(0, 13) === "https://youtu") {
        convertYoutubeMp3();
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
    userId: string
  ) {
    console.log(price_id);
    await axios
      .post("/api/checkout", {
        price_Id: price_id,
        user_Id: userId,
        customer_Email: stripeCustomerEmail,
      })
      .then((res) => {
        console.log(res.data);

        router.push(`${res.data.session}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    handleActiveButton();
  }, [youtubeUrl]);

  //upload audio
  const handleSubmit = (e: any) => {
    // e.preventDefault();
    //setSubmitted(true);
    const file = e;
    if (file && file.type.startsWith("video/")) {
      console.log("video detected!");
      setIsVideo(true);
    } else {
      console.log("audio detected!");
      setIsVideo(false);
    }

    if (!file) {
      toast({
        variant: "destructive",
        title: "No file found.",
      });
    } else {
      if (
        (file && file.type.startsWith("audio/")) ||
        file.type.startsWith("video/")
      ) {
        //console.log("est un fichier audio");
        //console.log(`${file.size / 1024} KB`);
        if (file.size > 20000000) {
          toast({
            variant: "destructive",
            title: "audio size too large (> 20MB).",
          });
        } else {
          setUploadLoaded(true);
          const storageRef = ref(
            storage,
            `users/${user?.uid}/data/audioToTranscribe`
          );
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgresspercent(progress);
              if (progresspercent == 100) {
                setChange(!changed);
                console.log("upload finished");
              }
            },
            (error) => {
              alert(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                audioUrl.current = downloadURL;
                submitSpeech();
                setAudioUrlDispo(true);
              });
            }
          );
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
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const name = currentUser?.displayName;
        const userEmail = currentUser?.email;
        const uiid = currentUser?.uid;
        setUserEmail(userEmail);
        setUserid(uiid);
        console.log(currentUser?.displayName);
        if (name !== undefined && name !== null) {
          setUserName(name);
        } else {
        }
      }
      if (currentUser == null) {
        //router.push("/");
      }
    });
    return () => unsubscribe();
  }, [user]);
  useEffect(() => {
    if (progresspercent == 100) {
      setTimeout(() => {
        toast({
          title: "Uploaded!",
        });
        setProgresspercent(0);
        setUploadLoaded(false);
        //submitSpeech()
      }, 500);
    }
  }, [progresspercent]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const name = currentUser?.displayName;
        const userEmail = currentUser?.email;
        const uiid = currentUser?.uid;
        setUserEmail(userEmail);
        setUserid(uiid);
        console.log(currentUser?.displayName);
        if (name !== undefined && name !== null) {
          setUserName(name);
        } else {
        }
      }
      if (currentUser == null) {
        //router.push("/");
      }
    });
    return () => unsubscribe();
  }, [user]);

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
            console.log(response.data.dlink);
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
        <span key={index} className="bg-green-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const submitSpeech = async () => {
    setSubmitted(true);
    try {
      const result: any = await fal.subscribe("fal-ai/whisper", {
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
      });

      if (result) {
        setLoading(false);
        setText(result.text as string);
        setUsedTextLengh.current = result.text.length;

        //used text for firebase update request limit
        /* console.log(`used text: ${setUsedTextLengh.current}`);
        console.log(`array length : ${result.chunks.length}`);
        console.log(`language : ${result.inferred_languages}`);*/
        setTextLanguageDetected(`${result.inferred_languages}`);
        /* console.log(
          `first text: (${result.chunks[0].timestamp}) ${result.chunks[0].text}`
        );*/
        for (let i = 0; i < result.chunks.length; i++) {
          /*console.log(
            ` text-${i}: (${result.chunks[i].timestamp}) ${result.chunks[i].text}`
          );*/
          speakerArray.current.push(`(${result.chunks[i].speaker})`);
          addSpeaker(`(${result.chunks[i].speaker})`);
          let resultInSrt = convertToSRT(
            i,
            `(${result.chunks[i].timestamp})`,
            `${result.chunks[i].text}`
          );
          handleAddConvertedSrtInText(resultInSrt);
        }

        setSubmitted(false);
        toast({
          variant: "default",
          title: "Note.",
          description: "Process finished... ",
        });
      }
    } catch (error) {
      console.log(error);
      setSubmitted(false);
    }
  };

  const addPlan = async (
    stripe_subscription_id: string,
    stripe_customer_id: string,
    userId: string
  ) => {
    try {
      await setDoc(doc(db, "usersPlan", userId), {
        is_pro: true,
        subscription_id: stripe_subscription_id,
        customer_id: stripe_customer_id,
        time_used: 40000,
      });
      console.log("inserted to userPlan! .");
    } catch (e) {
      console.error("Error:", e);
    }
  };
  const addUsedChar = async () => {
    try {
      await updateDoc(doc(db, "usersPlan", userId), {
        used_char: usedCharCurrent - setUsedTextLengh.current,
      });

      console.log("great! .");
    } catch (e) {
      console.error("Error:", e);
    }
  };
  /*
is_pro,
time_used,
subscription_Id

*/
  const fetchPost = async () => {
    const docRef = doc(db, "usersPlan", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      //setHavingPlan(true);
      // cus_Id.current = docSnap.data().having_plan
      getCustomerAlldata(userId);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("no plan found!");
      //setHavingPlan(false);
    }
  };
  const getCustomerAlldata = async (userId: string) => {
    const docRef = doc(db, "usersPlan", userId); // replace with customerID
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data().is_pro == true) {
        setHavingPlan(true);
        setUsedCharCurrent(docSnap.data().time_used);
        console.log(docSnap.data().is_pro);
        console.log(docSnap.data().time_used);
        //setplanType(` ${docSnap.data().plan}`);
        /*subscriptionId.current = docSnap.data().subscription_id;
        const subscription = await stripe.subscriptions.retrieve(
          `${docSnap.data().subscription_id}`
        );
        console.log(`subscription data:${subscription.status}`);*/
      } else {
        setHavingPlan(false);
      }
    } else {
      setHavingPlan(false);
    }
  };
  useEffect(() => {
    if (userId !== "") {
      fetchPost();
    }
  }, [userId]);
  /*const addUsedChar = async () => {
    try {
      await updateDoc(doc(db, "usersPlan", userId), {
        used_char: usedCharCurrent - texte.length,
      });

      console.log("great! .");
    } catch (e) {
      console.error("Error:", e);
    }
  };
const addCustomerSub_Id = async (
  stripe_subscription_id,
  stripe_customer_id,
  userId
) => {
  try {
    await setDoc(doc(db, "usersPlan", userId), {
      having_plan: true,
      subscription_id: stripe_subscription_id,
      customer_id: stripe_customer_id,
      plan: "starter",
      used_char: 40000,
    });
    console.log("inserted to userPlan! .");
  } catch (e) {
    console.error("Error:", e);
  }
};
   const storedUrlSelected = localStorage.getItem("urlstored");
      if (storedUrlSelected) {
        const indexforVerif = stringToNumber(storedUrlSelected);

        index = indexforVerif;
        setUrlStored(storedUrlSelected);
      }
      
      function stringToNumber(input: string): number {
    const num = Number(input);

    if (isNaN(num)) {
      throw new Error("The input string is not a valid number.");
    }

    return num;
  }
  
   const saveUrlToLocal = (value: string) => {
    localStorage.setItem("urlstored", value);
    console.log(`data added:${value}`);
  };

  let blob;

function download() {
  if (!blob) return;
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'test.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
}

stream.on("finish", function() {
   // get a blob you can do whatever you like with
  blob = stream.toBlob("application/pdf");

  const url = stream.toBlobURL('application/pdf');
  const iframe = document.querySelector('iframe')
  iframe.src = url;
});

*/
  const convertSecondsToMinutes = (
    secondsTuple: [number, number]
  ): [string, string] => {
    return secondsTuple.map((seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);

      return `${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;
    }) as [string, string];
  };

  const onDrop = (acceptedFiles: any) => {
    // On prend le premier fichier s'il est accepté
    setUploadedFile(acceptedFiles[0]);
    handleSubmit(acceptedFiles[0]);

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
  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <div>
      {desktopScreen()}
      {mobileScreen()}
    </div>
  );

  function desktopScreen() {
    return (
      <div className="hidden lg:flex justify-center">
        <ScrollArea className="h-[700px] w-1/5">
          <div>
            <div className="bg-amber-100 p-2 shadow-sm">
              <p className="font-bold text-center mt-5"> Setting</p>
            </div>
            <div className="flex justify-center mt-8">
              <div className="grid gap-1 w-[200px] p-3">
                <p className="text-center">3 transciptions left</p>
                <Progress />
                <Button
                  onClick={() => {
                    if (userEmail !== null && userEmail !== "") {
                      selectPlan(priceId, userEmail, userId);
                    }
                  }}
                >
                  <Infinity />
                  Go Pro
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
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
                                    currentValue === value ? "" : currentValue
                                  );

                                  if (currentValue == "translate") {
                                    setAutoDetectLanguage(false);
                                  } else {
                                    selectedCurrentLanguage.current = undefined;
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
                    <Popover open={openLanguage} onOpenChange={setOpenLanguage}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between"
                        >
                          {valueLanguage
                            ? language.find(
                                (framework) => framework.value === valueLanguage
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
                  export to PDF. <FaRegFilePdf className="mx-2 text-red-600" />
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
                <Button>Tranlation</Button>
              </div>
            </div>
            <br />
            <br />
          </div>
        </ScrollArea>

        <div className="flex justify-center w-4/5 bg-gray-50">
          <Separator orientation="vertical" />
          <ScrollArea className="h-[700px] w-full">
            <div className="w-full mx-3 mt-5">
              <div className="grid gap-5">
                <div className="flex justify-between p-12">
                  <p className="text-3xl font-bold underline  text-amber-500 text-center ">
                    AudiScribe
                  </p>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {" "}
                          {userName ? <p>{userName}</p> : <p>My...</p>}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              router.push("/billing");
                            }}
                          >
                            Billing
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              cancelSubscription();
                            }}
                          >
                            Cancel subscription
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>Support</DropdownMenuItem>
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
                <div className="grid gap-1 bg-white p-10 rounded-md">
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
                      <div className="flex items-center gap-3">
                        <Input
                          className="max-w-[500px] min-w-[400px]"
                          placeholder="Paste youtube link Here..."
                          value={youtubeUrl}
                          onChange={(e) => {
                            setYoutubeUrl(e.target.value);
                          }}
                        />
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setYoutubeUrl("");
                            firstcheck.current = 0;
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                        <div>
                          {checkingUrl ? (
                            <>
                              <LoaderIcon className="animate-spin size-5" />
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {textLanguageDetected ? (
                  <div className="m-4">
                    <p className=" ml-4  text-gray-600">
                      Language:(
                      <span className="text-amber-500">
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
                          <CopyIcon className="text-amber-500" />
                        </Button>

                        <Input
                          placeholder="Search text or word..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Separator className="my-3" />
                      <div className=" shadow-md rounded-xl p-3">
                        <ScrollArea className="h-[300px]">
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
                                        ? "bg-amber-100 rounded-xl"
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
                      <div>
                        <Separator className="my-10" />
                        <p className="text-2xl text-center bg-gradient-to-r from-amber-500  to-pink-500 bg-clip-text text-transparent">
                          Upload your file to start transcribe
                        </p>
                        <div className="flex justify-center mt-10">
                          <Image
                            alt="no data"
                            src={noData}
                            className="size-[300px]"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {textLanguageDetected && (
                  <Button
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

                <div className="flex justify-center">
                  {isAudioUrlDispo && isVideo && !youtubePlayerUrl && (
                    <div className=" w-4/5  p-1  rounded-t-md bg-slate-50">
                      <div className="flex justify-center m-3">
                        {" "}
                        <ReactPlayer
                          ref={videoPlayerRef}
                          width="100%"
                          height="100%"
                          playing={videoIsplaying}
                          light={false}
                          url="https://firebasestorage.googleapis.com/v0/b/audiscribe-942e8.appspot.com/o/users%2FqwhrQtz0c4bBGcYfxAMHlnokihb2%2Fdata%2FaudioToTranscribe%7D?alt=media&token=742bd824-5898-48ac-b745-1425b0084146"
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
          {isAudioUrlDispo && !isVideo && (
            <div className="fixed bottom-0 w-4/5 bg-slate-200 p-3 rounded-t-md">
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
    );
  }
  function mobileScreen() {
    return (
      <div className="lg:hidden p-3 bg-gray-50">
        <div className="flex justify-between  top-2 end-2 m-2">
          <p className="text-xl font-bold underline text-amber-500  text-center">
            AudiScribe
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {" "}
                {userName ? <p>{userName}</p> : <p>My...</p>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/billing");
                  }}
                >
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    cancelSubscription();
                  }}
                >
                  Cancel subscription
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logOut}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-center my-5 bg-slate-100 rounded-md p-4">
          <div className="grid gap-3">
            <p className="text-amber-500 text-center">3 transcriptions left</p>
            <Progress />
            <Button
              onClick={() => {
                if (userEmail) {
                  selectPlan(priceId, userEmail, userId);
                }
              }}
            >
              <FaChessKing className="mx-2" /> Go pro
            </Button>
          </div>
        </div>

        <div className="w-full  mt-5">
          <div className="grid gap-5">
            <div className="grid gap-1">
              <div className="mb-4 mt-1 ">
                <div className="flex justify-center">
                  {uploadIsLoaded ? (
                    <Progress value={progresspercent} className="w-[60%]" />
                  ) : null}
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>More...</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid  gap-4 ">
                        <Separator />
                        <Popover open={openMobile} onOpenChange={setOpenMobile}>
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
                        <div className="flex items-center gap-2">
                          <div>
                            <Checkbox
                              id="terms2"
                              onCheckedChange={(e: boolean) => {
                                setAutoDetectLanguage(e);
                                if (!e) {
                                  selectedCurrentLanguage.current = undefined;
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
                                <FaToolbox className="text-amber-500" />
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
                                  <p className="text-center font-bold">Tools</p>
                                  <Separator />
                                  <Drawer
                                    open={openMobileDialogYoutubemp3}
                                    onOpenChange={setOpenMobileDialogYoutubemp3}
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
                                          Past youtube link below to download
                                          it.
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
                                  <Button>Tranlation</Button>
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
                                <FaFileExport className="text-amber-500" />
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
                                    <p className=" font-bold text-xl ">
                                      Export:
                                    </p>
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
                        <Separator />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div className="bg-white p-5 rounded-md">
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
                          Drag and drop audio /video files here , or click to
                          select files
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-center text-gray-600">-----Or-----</p>
                <div className="flex justify-center">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <Input
                        className="w-[70%] "
                        placeholder="Paste youtube link Here..."
                        value={youtubeUrl}
                        onChange={(e) => {
                          setYoutubeUrl(e.target.value);
                        }}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setYoutubeUrl("");
                          firstcheck.current = 0;
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                    <div className="flex justify-center">
                      {checkingUrl ? (
                        <>
                          <LoaderIcon className="animate-spin size-5" />
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {textLanguageDetected ? (
              <div className="m-1">
                <p className="text-[10px] mb-3 text-gray-600">
                  Language:(
                  <span className="text-amber-500">{textLanguageDetected}</span>
                  )
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
                      <CopyIcon className="text-amber-500" />
                    </Button>

                    <Input
                      placeholder="Search text or word..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Separator className="my-3" />
                  <div className="shadow-md rounded-xl p-3">
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
                                    ? "bg-amber-100 rounded-xl "
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
                  <div>
                    <Separator className="my-5" />
                    <p className="  text-2xl text-center bg-gradient-to-r from-amber-500  to-pink-500 bg-clip-text text-transparent">
                      Upload your file to start transcribe
                    </p>
                    <div className="flex justify-center mt-10">
                      <Image
                        alt="no data"
                        src={noData}
                        className="size-[200px]"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            {textLanguageDetected && (
              <Button
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
            <div className="flex justify-center">
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
              <div className="bg-gray-100 p-2 rounded-md fixed bottom-0">
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

        {isAudioUrlDispo && !isVideo && (
          <div className="fixed bottom-0 flex  w-full bg-slate-200 p-2 rounded-t-md">
            <audio
              ref={audioRef}
              src={audioUrl.current}
              controls
              className="w-full "
            />
          </div>
        )}
      </div>
    );
  }
}
