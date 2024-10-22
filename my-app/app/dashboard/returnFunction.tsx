import React from "react";
import { MdAccountCircle } from "react-icons/md";

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
  return <div>returnIconSpeaker</div>;
};
const addAudioElement = (blob: any) => {
  const url = URL.createObjectURL(blob);
  console.log(url);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  document.body.appendChild(audio);
};
export { returnIconSpeaker, addAudioElement };
