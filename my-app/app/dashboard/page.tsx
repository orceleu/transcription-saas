"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { FaRegFilePdf } from "react-icons/fa6";
import { TbFileTypeDocx } from "react-icons/tb";
import { GrDocumentTxt } from "react-icons/gr";
import { useDropzone } from "react-dropzone";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowBigLeft,
  AudioWaveformIcon,
  Check,
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDown,
  CopyIcon,
  DeleteIcon,
  Infinity,
  LoaderIcon,
  PauseIcon,
  PlayIcon,
  PlusCircleIcon,
  Settings,
  TrashIcon,
  UploadCloud,
  UploadIcon,
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun, PageBreak } from "docx";
import { saveAs } from "file-saver";

import { Player } from "react-simple-player";
import { useRouter } from "next/navigation";
import * as fal from "@fal-ai/serverless-client";
//import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
//import { useToast } from "@/components/ui/use-toast";
//import { signOut, onAuthStateChanged, User } from "firebase/auth";
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
/*import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";*/
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
/*import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";*/

/*import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";*/

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
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
//import { auth, storage } from "../firebase/config";
/*import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  listAll,
  deleteObject,
} from "firebase/storage";*/
//import { Progress } from "@/components/ui/progress";

interface Item {
  name: string;
  path: string;
  url: string;
}

//type LanguageType = undefined | string;
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
interface ShunkItems {
  id: number;
  texte: string;
  shunkedTime: string;
}
export default function Dashboard() {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isAudioUrlDispo, setAudioUrlDispo] = useState(false);
  const router = useRouter();
  const [texte, setText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [changed, setChange] = useState(false);
  const selectedCurrentLanguage = useRef<LanguageType>("en");
  const [isSubmitted, setSubmitted] = useState(false);
  const [uploadIsLoaded, setUploadLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [openLanguageMobile, setOpenLanguageMobile] = useState(false);
  const [openLang, setOpenLang] = useState(false);
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
  const subscriptionId = useRef("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const audioUrl = useRef("");
  const isTranslante = useRef(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isshunktext, setShunkText] = useState(false);
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [items, setItems] = useState<ShunkItems[]>([]);
  const [value, setValue] = useState("transcribe");
  const [valueLanguage, setLanguageValue] = useState("en");
  const setUsedTextLengh = useRef(0);
  const [checkingUrl, setCheckingYoutubeUrl] = useState(false);
  const [youtubePlayerUrl, setYoutubePlayerUrl] = useState(false);
  const frameworks = [
    {
      value: "transcribe",
      label: "Transcription",
    },
    {
      value: "translate",
      label: "Translation to (en)",
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

  const downloadWordFile = async (text: string) => {
    // Contenu du fichier Word

    // Créer un Blob avec le contenu en type MIME spécifique à Word (.docx)
    /* const blob = new Blob(["\ufeff", text], { type: "application/msword" });

    // Créer une URL temporaire pour le Blob
    const url = window.URL.createObjectURL(blob);

    // Créer un lien de téléchargement
    const link = document.createElement("a");
    link.href = url;
    link.download = "exemple1.docx"; // Nom du fichier Word

    // Ajouter le lien au DOM, simuler un clic, puis le supprimer
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Libérer l'URL Blob
    window.URL.revokeObjectURL(url);

    */

    // Exemple de texte long
    const longText = `
     Ceci est un long texte qui va générer plusieurs paragraphes et potentiellement
     plusieurs pages dans un document Word. Lorem ipsum dolor sit amet, consectetur 
     adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames
     ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, 
     ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. 
     Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. 
     Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, 
     elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. 
     Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, 
     tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, 
     tincidunt quis, accumsan porttitor, facilisis luctus, metus.
   `;

    // Diviser le texte en paragraphes (chaque nouvelle ligne dans un nouveau paragraphe)
    const paragraphs = longText.split("\n").map((line) => new Paragraph(line));

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
    if (texte) {
      try {
        await navigator.clipboard.writeText(texte);
        alert("Texte copié dans le presse-papier !");
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

  const addItem = (text: string, shunkTime: string, id: number) => {
    // const newId = items.length;
    setItems((prevItems) => [
      ...prevItems,
      {
        texte: text,
        shunkedTime: shunkTime,
        id: id,
      },
    ]);
  };
  const modifyText = (id: number, text: string) => {
    setItems((prev) =>
      prev.map((input) => (input.id === id ? { ...input, texte: text } : input))
    );
  };
  const handleActiveButton = () => {
    if (youtubeUrl.length < 5) {
      console.log("url too short ");
    } else {
      convertYoutubeMp3();
    }
  };
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
            `users/${user?.uid}/data/audioToTranscribe}`
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

  const submitSpeech = async () => {
    setSubmitted(true);
    try {
      const result: any = await fal.subscribe("fal-ai/whisper", {
        input: {
          audio_url: audioUrl.current,
          task: selectedCurrentTask.current,
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
        console.log(`used text: ${setUsedTextLengh.current}`);
        console.log(`array length : ${result.chunks.length}`);
        console.log(`language : ${result.inferred_languages}`);
        /* console.log(
          `first text: (${result.chunks[0].timestamp}) ${result.chunks[0].text}`
        );*/
        for (let i = 0; i < result.chunks.length; i++) {
          console.log(
            ` text-${i}: (${result.chunks[i].timestamp}) ${result.chunks[i].text}`
          );
          const time = convertSecondsToMinutes(result.chunks[i].timestamp);

          addItem(`${result.chunks[i].text}`, `[${time}]`, i);
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
  const convertShunksTimeStampInMinute = (data: string): string => {
    let first = Number(data.slice(0, 2));
    let end = Number(data.slice(4, 5));
    console.log(first);
    console.log(end);
    const minuteFirst = Math.floor(first / 60);
    const remainingSecFirst = first % 60;
    const minuteEnd = Math.floor(end / 60);
    const remainingSecEnd = end % 60;

    return `${minuteFirst}:${remainingSecFirst}, ${minuteEnd}:${remainingSecEnd}`;
  };
  const onDrop = (acceptedFiles: any) => {
    // On prend le premier fichier s'il est accepté
    setUploadedFile(acceptedFiles[0]);
    handleSubmit(acceptedFiles[0]);
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
        <div className="w-1/5">
          <div className="bg-amber-100 p-2 shadow-sm">
            <p className="font-bold text-center mt-5"> Setting</p>
          </div>
          <div className="flex justify-center mt-8">
            <div className="grid gap-1 w-[200px] p-3">
              <p className="text-center">3 transciptions left</p>
              <Progress />
              <Button>
                <Infinity />
                Go unlimited
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="grid gap-2 max-w-[200px]  shadow-sm rounded-sm p-5 bg-gray-100">
              <p className=" font-bold text-xl ">Export:</p>
              <Separator />
              <Button
                variant="outline"
                className="hover:bg-green-100"
                onClick={() => {
                  creatPDF(texte);
                }}
              >
                export to PDF. <FaRegFilePdf className="mx-2 text-red-600" />
              </Button>
              <Button
                variant="outline"
                className="hover:bg-green-100"
                onClick={() => downloadWordFile(texte)}
              >
                export to Docx.
                <TbFileTypeDocx className="mx-2 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                className="hover:bg-green-100"
                onClick={() => handleDownloadTxt(texte)}
              >
                export to Txt.
                <GrDocumentTxt className="mx-2 text-gray-600" />
              </Button>
              <div>
                <Checkbox
                  id="terms1"
                  onCheckedChange={(e: boolean) => {
                    setShunkText(e);
                    //console.log(e);
                  }}
                  defaultChecked={false}
                />
                <br />
                <p className="text-gray-500">Shunk the text?</p>
              </div>
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
          </div>{" "}
          <div className="flex justify-center mt-10">
            <div className="grid gap-2 max-w-[200px]  shadow-sm rounded-sm p-5 bg-gray-100">
              <p className="text-center font-bold">Tools</p>
              <Separator />
              <Button onClick={() => router.push("/youtube-to-mp3")}>
                Youtube to mp3
              </Button>
              <Button>Tranlation</Button>
              <Button>Sound effect gen</Button>
            </div>
          </div>
          <br />
          <br />
          <div className="fixed top-2 end-2 m-10">
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
                      // cancelSubscription();
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

        <div className="w-4/5 flex justify-center">
          <Separator orientation="vertical" />
          <div className="w-full mx-3 mt-5">
            <p className="text-3xl font bold m-10 text-center fixed top-2">
              AudiScribe
            </p>
            <div className="grid gap-5">
              <div className="grid gap-1">
                <div className="flex justify-center">
                  <div
                    {...getRootProps({ style })}
                    className="mt-[100px] mb-2 max-w-[400px]"
                  >
                    <input {...getInputProps()} />
                    {uploadedFile ? (
                      <div>
                        <h4 className="text-center">Fichier uploadé:</h4>
                        <p className="text-center">{uploadedFile.name}</p>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <div className="flex justify-center">
                          <UploadCloud />
                        </div>
                        <p className="text-center">
                          Drag 'n' drop audio /video files here , or click to
                          select files
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

                <div className="mb-4 mt-1 ml-4">
                  <div className="flex justify-center">
                    {uploadIsLoaded ? (
                      <Progress value={progresspercent} className="w-[60%]" />
                    ) : null}
                  </div>
                  <br />
                  <br />
                  <div className="flex items-center gap-5">
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
                                    selectedCurrentTask.current = currentValue;
                                    setOpen(false);
                                    console.log(selectedCurrentTask.current);
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
                  </div>
                </div>
              </div>{" "}
              <div className="m-4">
                {isshunktext && (
                  <div>
                    {items.map((value, index) => (
                      <div key={index + 1}>
                        <p className="my-1">
                          Speaker
                          <span className="mx-2">{value.shunkedTime}</span>
                        </p>
                        <Textarea
                          className="mt-2"
                          placeholder="Shunked text "
                          key={index}
                          value={value.texte}
                          onChange={(e) => modifyText(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {!isshunktext && (
                  <Textarea
                    placeholder="result"
                    className="h-[100px]"
                    value={texte}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                    disabled={false}
                  />
                )}
                <Button variant="outline" className="mt-4" onClick={handleCopy}>
                  <CopyIcon />
                </Button>
              </div>
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
              <div className="flex justify-center">
                {isAudioUrlDispo && isVideo && !youtubePlayerUrl && (
                  <div className=" w-4/5  p-1  rounded-t-md bg-slate-50">
                    <div className="flex justify-center m-3">
                      <ReactPlayer
                        width="100%"
                        height="100%"
                        playing={videoIsplaying}
                        light={false}
                        url={audioUrl.current}
                        onDuration={(e) => console.log(`duration:${e}`)}
                        onSeek={(e) => console.log("onSeek", e)}
                        onProgress={(e) => console.log(`onprogress: ${e}`)}
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
                <ReactPlayer controls={true} url={youtubeUrl} />
              )}
            </div>{" "}
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>

          {isAudioUrlDispo && !isVideo && (
            <div className="fixed bottom-0 w-4/5 bg-slate-200 p-10 rounded-t-md">
              <Player src={audioUrl.current} height={40} />
            </div>
          )}
        </div>
      </div>
    );
  }
  function mobileScreen() {
    return (
      <div className="lg:hidden p-2">
        <div className="fixed top-2 end-2 m-2">
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
                    // cancelSubscription();
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

        <div className="w-full  mt-5">
          <p className="text-xl font bold m-2 text-center fixed top-2">
            AudiScribe
          </p>
          <div className="grid gap-5">
            <div className="grid gap-1">
              <div className="flex justify-center">
                <div
                  {...getRootProps({ style })}
                  className="mt-[100px] mb-2 max-w-[400px]"
                >
                  <input {...getInputProps()} />
                  {uploadedFile ? (
                    <div>
                      <h4 className="text-center">Fichier uploadé:</h4>
                      <p className="text-center">{uploadedFile.name}</p>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <div className="flex justify-center">
                        <UploadCloud />
                      </div>
                      <p className="text-center">
                        Drag 'n' drop audio /video files here , or click to
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

              <div className="mb-4 mt-1 ml-4">
                <div className="flex justify-center">
                  {uploadIsLoaded ? (
                    <Progress value={progresspercent} className="w-[60%]" />
                  ) : null}
                </div>
                <br />
                <br />
                <div className="grid  gap-4 ">
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
                                    currentValue === value ? "" : currentValue
                                  );
                                  selectedCurrentTask.current = currentValue;
                                  setOpen(false);
                                  console.log(selectedCurrentTask.current);
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
                </div>

                <Accordion type="single" collapsible className="w-full ">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      More...
                      <PlusCircleIcon />
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="w-full">
                        <div className="flex justify-center">
                          <div className="grid gap-2 w-full  shadow-sm rounded-sm p-5 bg-gray-100">
                            <p className=" font-bold text-xl ">Export:</p>
                            <Separator />
                            <Button
                              variant="outline"
                              className="hover:bg-green-100"
                              onClick={() => {
                                creatPDF(texte);
                              }}
                            >
                              export to PDF.{" "}
                              <FaRegFilePdf className="mx-2 text-red-600" />
                            </Button>
                            <Button
                              variant="outline"
                              className="hover:bg-green-100"
                              onClick={() => downloadWordFile(texte)}
                            >
                              export to Docx.
                              <TbFileTypeDocx className="mx-2 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              className="hover:bg-green-100"
                              onClick={() => handleDownloadTxt(texte)}
                            >
                              export to Txt.
                              <GrDocumentTxt className="mx-2 text-gray-600" />
                            </Button>
                            <div>
                              <Checkbox
                                id="terms1"
                                onCheckedChange={(e: boolean) => {
                                  setShunkText(e);
                                  //console.log(e);
                                }}
                                defaultChecked={false}
                              />
                              <br />
                              <p className="text-gray-500">Shunk the text?</p>
                            </div>
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
                              <p className="text-gray-500">
                                Auto detect Language?
                              </p>
                            </div>
                          </div>
                        </div>{" "}
                        <div className="flex justify-center mt-10">
                          <div className="grid gap-2 w-full  shadow-sm rounded-sm p-5 bg-gray-100">
                            <p className="text-center font-bold">Tools</p>
                            <Separator />
                            <Button
                              onClick={() => router.push("/youtube-to-mp3")}
                            >
                              Youtube to mp3
                            </Button>
                            <Button>Tranlation</Button>
                            <Button>Sound effect gen</Button>
                          </div>
                        </div>
                        <br />
                        <br />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>{" "}
            <div className="m-4">
              {isshunktext && (
                <div>
                  {items.map((value, index) => (
                    <div key={index + 1}>
                      <p className="my-1">
                        Speaker
                        <span className="mx-2">{value.shunkedTime}</span>
                      </p>
                      <Textarea
                        className="mt-2"
                        placeholder="Shunked text "
                        key={index}
                        value={value.texte}
                        onChange={(e) => modifyText(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {!isshunktext && (
                <Textarea
                  placeholder="result"
                  className="h-[100px]"
                  value={texte}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  disabled={false}
                />
              )}
              <Button variant="outline" className="mt-4" onClick={handleCopy}>
                <CopyIcon />
              </Button>
            </div>
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
            <div className="flex justify-center">
              {isAudioUrlDispo && isVideo && !youtubePlayerUrl && (
                <div className=" w-4/5  p-1  rounded-t-md bg-slate-50">
                  <div className="flex justify-center m-3">
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      playing={videoIsplaying}
                      light={false}
                      url={audioUrl.current}
                      onDuration={(e) => console.log(`duration:${e}`)}
                      onSeek={(e) => console.log("onSeek", e)}
                      onProgress={(e) => console.log(`onprogress: ${e}`)}
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
              <ReactPlayer controls={true} url={youtubeUrl} />
            )}
          </div>{" "}
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>

        {isAudioUrlDispo && !isVideo && (
          <div className="fixed bottom-0 w-full bg-slate-200 p-5 rounded-t-md">
            <Player src={audioUrl.current} height={40} />
          </div>
        )}
      </div>
    );
  }
}
