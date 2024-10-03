"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useDropzone } from "react-dropzone";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/firebase/config";

import {
  ArrowBigLeft,
  AudioWaveformIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  DeleteIcon,
  Infinity,
  LoaderIcon,
  PauseIcon,
  PlayIcon,
  Settings,
  TrashIcon,
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
}
export default function Dashboard() {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isAudioUrlDispo, setAudioUrlDispo] = useState(false);
  const router = useRouter();
  const [texte, setText] = useState("");
  const [changed, setChange] = useState(false);
  const selectedCurrentLanguage = useRef<LanguageType>("en");
  const [isSubmitted, setSubmitted] = useState(false);
  const [uploadIsLoaded, setUploadLoaded] = useState(false);
  const [open, setOpen] = useState(false);
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
  const [items, setItems] = useState<ShunkItems[]>([]);
  const doc = new jsPDF();

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
    const lineHeight = 40; // Nombre de caractères par ligne
    const linesPerPage = 20; // Nombre de lignes par "page"
    let lineCount = 0; // Nombre de lignes actuelles

    // Texte long à générer (simulé avec une répétition)
    const longText = `
    Ceci est un long texte qui sera utilisé pour tester la génération de plusieurs pages 
    dans un fichier texte. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium 
    pretium tempor. Ut eget imperdiet neque. In volutpat ante semper diam molestie, et aliquam 
    erat laoreet. Sed sit amet arcu aliquet, malesuada nisi a, convallis odio. Pellentesque vitae 
    dolor et nisl iaculis aliquet at vitae augue. Nulla efficitur odio nec lectus mattis, eget 
    vehicula lorem ultricies. Mauris faucibus at nisl nec tempus. Quisque mollis sapien enim, 
    et tempor felis lacinia nec. Donec mi orci, sollicitudin in luctus a, varius eget massa.
    `.repeat(10); // Répéter pour simuler un texte plus long

    // Diviser le texte en lignes basées sur une longueur fixe
    const splitText = longText.split(" ").reduce((acc: any, word: any) => {
      const lastLine = acc[acc.length - 1] || "";

      if ((lastLine + " " + word).trim().length <= lineHeight) {
        acc[acc.length - 1] = (lastLine + " " + word).trim();
      } else {
        acc.push(word); // Commencer une nouvelle ligne si la longueur est dépassée
        lineCount++;
      }

      // Si on dépasse le nombre de lignes par page, ajouter une ligne vide pour marquer une nouvelle page
      if (lineCount === linesPerPage) {
        acc.push("--- Nouvelle page ---\n");
        lineCount = 0; // Réinitialiser le compte de lignes
      }

      return acc;
    }, []);

    const finalText = splitText.join("\n"); // Joindre les lignes par des sauts de ligne

    // Créer un Blob pour le fichier .txt
    const blob = new Blob([finalText], { type: "text/plain" });

    // Créer une URL temporaire pour le Blob et déclencher le téléchargement
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exemple.txt"; // Nom du fichier à télécharger
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const creatPDF = (text: string) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height; // Hauteur d'une page
    const marginTop = 10; // Marge en haut de la page
    const lineHeight = 10; // Hauteur d'une ligne de texte
    let yPosition = marginTop; // Position verticale de départ

    // Texte long à afficher
    const longText = `
    Ceci est un long texte qui sera utilisé pour tester la génération de plusieurs pages 
    dans un document PDF. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium 
    pretium tempor. Ut eget imperdiet neque. In volutpat ante semper diam molestie, et aliquam 
    erat laoreet. Sed sit amet arcu aliquet, malesuada nisi a, convallis odio. Pellentesque vitae 
    dolor et nisl iaculis aliquet at vitae augue. Nulla efficitur odio nec lectus mattis, eget 
    vehicula lorem ultricies. Mauris faucibus at nisl nec tempus. Quisque mollis sapien enim, 
    et tempor felis lacinia nec. Donec mi orci, sollicitudin in luctus a, varius eget massa.
    `.repeat(10); // Répéter plusieurs fois pour simuler un long texte

    // Diviser le texte en lignes en fonction de la largeur de la page
    const splitText = doc.splitTextToSize(longText, 180); // Largeur du texte dans la page

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
    //doc.setFontSize(12);
    //doc.setFont("helvetica", "bold");
    // Télécharger le fichier PDF
    doc.save("exemple.pdf");
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(texte);
      alert("Texte copié dans le presse-papier !");
    } catch (err) {
      console.error("Échec de la copie du texte : ", err);
    }
  };

  const task = [
    {
      value: "transcribe",
      label: "transcription ",
    },
    {
      value: "translation",
      label: "translation",
    },
  ];

  const language = [
    {
      value: "en",
      label: "to English ",
    },
    {
      value: "sp",
      label: "to Spanish",
    },
    {
      value: "zh",
      label: "to Shinese",
    },
    {
      value: "it",
      label: "to Italian",
    },
    {
      value: "de",
      label: "to Deutch",
    },
    {
      value: "af",
      label: "to African",
    },
    {
      value: "am",
      label: "to Deutch",
    },
    {
      value: "ar",
      label: "to Deutch",
    },

    {
      value: "as",
      label: "to Deutch",
    },

    {
      value: "az",
      label: "to Deutch",
    },
    {
      value: "ba",
      label: "to Deutch",
    },
    {
      value: "be",
      label: "to Deutch",
    },
    {
      value: "bg",
      label: "to Deutch",
    },
    {
      value: "bn",
      label: "to Deutch",
    },
    {
      value: "bo",
      label: "to Deutch",
    },
    {
      value: "br",
      label: "to Deutch",
    },
    {
      value: "bs",
      label: "to Deutch",
    },
    {
      value: "ca",
      label: "to Deutch",
    },
    {
      value: "cs",
      label: "to Deutch",
    },
    {
      value: "cy",
      label: "to Deutch",
    },
    {
      value: "da",
      label: "to Deutch",
    },
    {
      value: "el",
      label: "to Deutch",
    },
  ];

  const addItem = (text: string, id: number) => {
    // const newId = items.length;
    setItems((prevItems) => [
      ...prevItems,
      {
        texte: text,
        id: id,
      },
    ]);
  };
  const modifyText = (id: number, text: string) => {
    setItems((prev) =>
      prev.map((input) => (input.id === id ? { ...input, texte: text } : input))
    );
  };

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
        router.push("/");
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
          //language: selectedCurrentLanguage.current,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      if (result) {
        setLoading(false);
        setText(result.text as string);
        console.log(`array length : ${result.chunks.length}`);
        console.log(`language : ${result.inferred_languages}`);
        /* console.log(
          `first text: (${result.chunks[0].timestamp}) ${result.chunks[0].text}`
        );*/
        for (let i = 0; i < result.chunks.length; i++) {
          /*console.log(
            ` text-${i}: (${result.chunks[i].timestamp}) ${result.chunks[i].text}`
          );*/
          const time = convertShunksTimeStampInMinute(
            `${result.chunks[i].timestamp}`
          );
          addItem(` text-${i}: (${time}) ${result.chunks[i].text}`, i);
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
        used_char: usedCharCurrent - textvalue.length,
      });

      console.log("great! .");
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

  const handleDownload = () => {
    // Ouvrir un nouvel onglet pour télécharger le fichier PDF
    window.open("/api/download-pdf", "_blank");
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex justify-center">
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
          <div className="grid gap-2 max-w-[200px] h-[300px] shadow-sm rounded-sm p-10 bg-gray-100">
            <p className=" font-bold text-xl ">export</p>
            <Separator />
            <p
              className="hover:bg-green-100"
              onClick={() => {
                creatPDF(texte);
              }}
            >
              <FileTextIcon /> export to pdf.
            </p>
            <p
              className="hover:bg-green-100"
              onClick={() => downloadWordFile(texte)}
            >
              <FileTextIcon /> export to Docx.
            </p>
            <p
              className="hover:bg-green-100"
              onClick={() => handleDownloadTxt(texte)}
            >
              <FileTextIcon /> export to Txt.
            </p>
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
          </div>
        </div>{" "}
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
              <DropdownMenuItem>GitHub</DropdownMenuItem>
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
                        <UploadIcon />
                      </div>
                      <p className="text-center">
                        Drag 'n' drop audio /video files here , or click to
                        select files
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>{" "}
            <div className="mb-4 mt-1 ml-4">
              <div className="flex justify-center">
                {uploadIsLoaded ? (
                  <Progress value={progresspercent} className="w-[60%]" />
                ) : null}
              </div>
              <br />
              <br />

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {selectedTask
                      ? task.find((task) => task.value === selectedTask)?.label
                      : "Select task..."}
                    <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Task..."
                      className="h-9"
                    />
                    <CommandEmpty>Task not found.</CommandEmpty>
                    <CommandGroup>
                      {task.map((task) => (
                        <CommandItem
                          key={task.value}
                          value={task.value}
                          onSelect={(currentValue: any) => {
                            setSelectedTask(
                              currentValue === selectedTask ? "" : currentValue
                            );
                            selectedCurrentTask.current = currentValue;
                            if (currentValue === "transcribe") {
                              selectedCurrentLanguage.current = undefined;
                            }
                            setOpen(false);
                            console.log(
                              ` task selected: ${selectedTask} : ${currentValue}`
                            );
                            if (currentValue == "translation") {
                              setTranslanteMode(true);
                            } else {
                              setTranslanteMode(false);
                            }
                          }}
                        >
                          {task.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedTask === task.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="m-4">
              {isshunktext && (
                <div>
                  {items.map((value, index) => (
                    <Textarea
                      className="mt-2"
                      placeholder="Shunked text "
                      key={index}
                      value={value.texte}
                      onChange={(e) => modifyText(index, e.target.value)}
                    />
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
              {isAudioUrlDispo && isVideo && (
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
/*
<div>
        <ReactPlayer
          playing={videoIsplaying}
          light={true}
          playIcon={<PlayIcon />}
          url="https://firebasestorage.googleapis.com/v0/b/audiscribe-942e8.appspot.com/o/users%2FqwhrQtz0c4bBGcYfxAMHlnokihb2%2Fdata%2FaudioToTranscribe%7D?alt=media&token=4b0c89b6-dede-4ea7-b081-a5346e737418"
        />
        <Button
          variant="outline"
          onClick={() => {
            setVideoPlaying(!videoIsplaying);
          }}
        >
          <PauseIcon />
        </Button>
      </div>

*/
