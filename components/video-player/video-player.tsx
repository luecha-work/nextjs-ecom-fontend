import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface VidPlayerProps {
  videoRef: React.RefObject<any>;
  setIsDisplayVideo: React.Dispatch<React.SetStateAction<boolean>>;
  videoPath: string;
}

interface VideoPlayerProps {
  videoPath: string;
}

const VidPlayer: React.FC<VidPlayerProps> = ({
  videoRef,
  setIsDisplayVideo,
  videoPath,
}) => {
  useEffect(() => {}, []);
  return (
    <video
      autoPlay
      loop
      style={{ width: "100%" }}
      controls
      onClick={() => {
        setIsDisplayVideo(true);
      }}
      ref={videoRef}
    >
      {/* <source src="/video/project-introduction-video.mp4" type="video/mp4" /> */}
      <source src={videoPath} type="video/mp4" />
      project introduction video.
    </video>
  );
};

const VideoPlayer: NextPage<VideoPlayerProps> = ({ videoPath }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const [isDisplayVideo, setIsDisplayVideo] = useState<boolean>(false);

  useEffect(() => {

    setIsDisplayVideo(false);

    let videoElement: HTMLVideoElement | null = null;

    if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
      videoElement = videoRef.current;
    }

    const handleVideoPlayback = () => {
      if (videoElement !== null && typeof videoElement.paused !== "undefined") {
        if (videoElement.paused) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      }
    };

    if (inView && isDisplayVideo) {
      handleVideoPlayback();
    } else if (
      videoElement !== null &&
      typeof videoElement.paused !== "undefined"
    ) {
      videoElement.pause();
    }

    const handlePageLeave = () => {
      if (videoElement !== null && typeof videoElement.paused !== "undefined") {
        if (!videoElement.paused) {
          videoElement.pause();
        }
      }
    };

    // เพิ่ม Event Listener สำหรับการจัดการขณะออกจากหน้า
    window.addEventListener("beforeunload", handlePageLeave);

    // Cleanup function เมื่อ Component ถูก unmount
    return () => {
      window.removeEventListener("beforeunload", handlePageLeave);
    };
  }, [inView, videoPath]);

  return (
    <div ref={ref}>
      <VidPlayer
        videoRef={videoRef}
        setIsDisplayVideo={setIsDisplayVideo}
        videoPath={videoPath}
      />
    </div>
  );
};

export default VideoPlayer;
