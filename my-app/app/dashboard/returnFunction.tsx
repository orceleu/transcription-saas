import { FileAudioIcon, FileVideo } from "lucide-react";
import React from "react";
import { MdAccountCircle } from "react-icons/md";
import { TbFileUnknown } from "react-icons/tb";
import axios from "axios";
const returnIconSpeaker = (speaker: string) => {
  switch (speaker) {
    case "(SPEAKER_00)":
      return <MdAccountCircle className="text-emerald-400" />;
    case "(SPEAKER_01)":
      return <MdAccountCircle className="text-blue-400" />;
    case "(SPEAKER_02)":
      return <MdAccountCircle className="text-yellow-400" />;
    case "(SPEAKER_03)":
      return <MdAccountCircle className="text-slate-400" />;
    case "(SPEAKER_04)":
      return <MdAccountCircle className="text-gray-400" />;
    case "(SPEAKER_05)":
      return <MdAccountCircle className="text-pink-400" />;
    case "(SPEAKER_06)":
      return <MdAccountCircle className="text-red-400" />;
    case "(SPEAKER_07)":
      return <MdAccountCircle className="text-green-400" />;
    case "(SPEAKER_08)":
      return <MdAccountCircle className="text-amber-400" />;
    case "(SPEAKER_09)":
      return <MdAccountCircle className="text-violet-400" />;
    case "(SPEAKER_10)":
      return <MdAccountCircle className="text-purple-400" />;
    case "(null)":
      return <MdAccountCircle className="text-emerald-400" />;
    default:
      <MdAccountCircle className="text-emerald-400" />;
      break;
  }
  return <MdAccountCircle className="text-emerald-400" />;
};

const returnTypeIcon = (type: string) => {
  switch (type) {
    case "audio/mpeg":
      return <FileAudioIcon className="text-emerald-400" />;
    case "audio/ogg":
      return <FileAudioIcon className="text-blue-400" />;
    case "audio/mp3":
      return <FileAudioIcon className="text-yellow-400" />;
    case "video/mp4":
      return <FileVideo className="text-violet-400" />;

    default:
      <TbFileUnknown className="text-gray-400" />;
      break;
  }
  return <TbFileUnknown className="text-gray-400" />;
};
const addAudioElement = (blob: any) => {
  const url = URL.createObjectURL(blob);
  console.log(url);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  document.body.appendChild(audio);
};

const convertirDuree = (dureeEnsecondes: number): string => {
  const dureeEnMinutes = dureeEnsecondes / 60;
  if (dureeEnMinutes < 1) {
    return `${Math.round(dureeEnsecondes)} sec 
    `;
  } else if (dureeEnMinutes < 60) {
    return `${Math.round(dureeEnMinutes)} min`;
  } else {
    const heures = Math.floor(dureeEnMinutes / 60);
    const minute = Math.round(dureeEnMinutes % 60);
    if (!isNaN(heures) && !isNaN(minute)) {
      return `${heures} hours  ${minute} min 
    `;
    } else {
      return "...";
    }
  }
};
function bytesToMB(bytes: number, decimals: number = 2): string {
  if (bytes < 0) {
    throw new Error("La valeur des octets doit être positive.");
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(decimals)} MB`;
}
const formatDate = (date: string): string => {
  const result = date.slice(0, 10);
  return result;
};

export {
  returnIconSpeaker,
  addAudioElement,
  convertirDuree,
  bytesToMB,
  returnTypeIcon,
  formatDate,
};
