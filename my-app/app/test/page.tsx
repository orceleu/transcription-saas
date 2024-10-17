"use client";
import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { Player } from "react-simple-player";

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
const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, srtString }) => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTime, setShowTime] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const parsedSubtitles = parseSRT(srtString);
    setSubtitles(parsedSubtitles);
  }, [srtString]);

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

  return (
    <div className="p-4">
      <audio ref={audioRef} src={audioUrl} controls className="w-full mb-4" />

      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Search for a word..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mt-4">
        {subtitles.map((sub, index) => (
          <p
            key={index}
            className={`my-2 cursor-pointer ${
              currentSubtitle === sub ? "bg-yellow-300" : ""
            }`}
            onClick={() => handleSubtitleClick(sub.start)}
          >
            {" "}
            {showTime && (
              <span className="mr-2 text-gray-500">
                [{formatTime(sub.start)}]
              </span>
            )}
            {highlightText(sub.text, searchTerm)}
          </p>
        ))}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const audioUrl =
    "https://firebasestorage.googleapis.com/v0/b/audiscribe-942e8.appspot.com/o/users%2FqwhrQtz0c4bBGcYfxAMHlnokihb2%2Fdata%2FaudioToTranscribe%7D?alt=media&token=23c0eb42-fe7c-4434-b69d-7f4765a887b9"; // Remplacez par l'URL de votre audio.
  // Remplacez par l'URL de votre audio.
  const srtString = `
1
00:00:00,000 --> 00:00:04,620
Considéré comme voix-off professionnel, il faut être capable de comprendre rapidement,

2
00:00:05,080 --> 00:00:08,700
de lire ou d'interpréter un texte ou un script que l'on n'a pas écrit,

3
00:00:09,140 --> 00:00:13,720
sans changer un mot, sans répétition préalable, en un maximum de trois prises,

4
00:00:14,040 --> 00:00:17,460
pour rassurer tout simplement le client ou le producteur qui vous a choisi.

5
00:00:17,460 --> 00:00:20,280
D'ailleurs, dès la première prise, il faut qu'il soit rassuré.

6
00:00:20,460 --> 00:00:26,000
Pour être pro de la voix-off, vous devez aussi être réactif et proposer toujours une solution.

7
00:00:26,160 --> 00:00:30,800
Parce que n'oubliez pas, le but ultime d'une voix off, c'est de satisfaire un client ou
`;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">
        Audio Player with Synchronized Subtitles
      </h1>
      <AudioPlayer audioUrl={audioUrl} srtString={srtString} />
    </div>
  );
};

export default Home;

/*
    "https://firebasestorage.googleapis.com/v0/b/audiscribe-942e8.appspot.com/o/users%2FqwhrQtz0c4bBGcYfxAMHlnokihb2%2Fdata%2FaudioToTranscribe%7D?alt=media&token=23c0eb42-fe7c-4434-b69d-7f4765a887b9"; // Remplacez par l'URL de votre audio.

*/
