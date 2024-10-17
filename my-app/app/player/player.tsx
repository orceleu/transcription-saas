import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { Player } from "react-simple-player";
import ReactPlayer from "react-player";

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
      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Search for a word..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={showTime}
            onChange={(e) => setShowTime(e.target.checked)}
          />{" "}
          Show time before each subtitle
        </label>
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
      <audio ref={audioRef} src={audioUrl} controls className="w-full mb-4 " />
    </div>
  );
};

const YoutubeVideoPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  srtString,
}) => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTime, setShowTime] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    const parsedSubtitles = parseSRT(srtString);
    setSubtitles(parsedSubtitles);
  }, [srtString]);

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    const currentTime = state.playedSeconds;
    setProgress(state.played * 100);

    const currentSub = subtitles.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end
    );
    setCurrentSubtitle(currentSub || null);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime =
      (parseFloat(e.target.value) / 100) *
      (playerRef.current?.getDuration() || 0);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, "seconds");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleSubtitleClick = (startTime: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(startTime, "seconds");
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
      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Search for a word..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={showTime}
            onChange={(e) => setShowTime(e.target.checked)}
          />{" "}
          Show time before each subtitle
        </label>
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
      <ReactPlayer
        ref={playerRef}
        url="https://youtu.be/yodStW-737k?si=a3ZnC3BdLjOPsSDt"
        controls={true}
        onProgress={handleProgress}
      />
    </div>
  );
};

export { AudioPlayer, YoutubeVideoPlayer, parseSRT };
