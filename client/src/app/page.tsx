"use client";
import { useRef, useState } from "react";
import "../../styles/page.css";
import BasicTextFields from "./components/Home";

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [uploadURL, setUploadURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [showVideo, setShowVideo] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const handleDeviceIdSubmit = (id: string) => {
    setDeviceId(id);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        await uploadVideo(blob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setPaused(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    setPaused(false);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setPaused(false);
    }
  };

  const uploadVideo = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob, `${deviceId}.mp4`);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setUploadURL(data.url);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div style={{ height: "95%" }} className="videoContainer">
      {!deviceId ? (
        <BasicTextFields onSubmit={handleDeviceIdSubmit} />
      ) : (
        <>
          <div className="buttonContainer">
            {!recording ? (
              <button onClick={startRecording} className="startBtn">
                Start Recording
              </button>
            ) : (
              <>
                {!paused ? (
                  <button onClick={pauseRecording} className="pauseBtn">
                    Pause
                  </button>
                ) : (
                  <button onClick={resumeRecording} className="resumeBtn">
                    Resume
                  </button>
                )}
                <button onClick={stopRecording} className="stopBtn">
                  Stop Recording
                </button>
              </>
            )}
          </div>

          {uploadURL && (
            <div className="linkContainer">
              <h3 className="text-sm font-semibold">Uploaded Video:</h3>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowVideo(true);
                }}
                className="block mt-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                {videoURL}
              </a>

              {showVideo && (
                <video controls className="w-full max-w-md border rounded mt-4">
                  <source src={uploadURL} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoRecorder;
