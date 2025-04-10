"use client";
import { useRef, useState } from "react";

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        setVideoURL(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-lg font-bold mb-2">Video Recorder</h2>

      <video id="videoPreview" autoPlay playsInline className="w-full max-w-md border rounded"></video>

      <div className="mt-4">
        {recording ? (
          <button onClick={stopRecording} className="px-4 py-2 bg-red-500 text-white rounded">Stop Recording</button>
        ) : (
          <button onClick={startRecording} className="px-4 py-2 bg-blue-500 text-white rounded">Start Recording</button>
        )}
      </div>

      {videoURL && (
        <div className="mt-4">
          <video src={videoURL} controls className="w-full max-w-md border rounded"></video>
          <a href={videoURL} download="recorded-video.webm" className="block mt-2 px-4 py-2 bg-green-500 text-white rounded">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
