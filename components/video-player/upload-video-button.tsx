// components/UploadButton.tsx
import React from "react";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { NextPage } from "next";
import { Button } from "@mui/material";
import { CommonService } from "@/service/common.service";

interface UploadVideoButtonProps {
  setVideoPath: React.Dispatch<React.SetStateAction<string>>;
}

const UploadVideoButton: NextPage<UploadVideoButtonProps> = ({
  setVideoPath,
}) => {
  const commonService = new CommonService();

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.onloadend = () => {};

      reader.readAsDataURL(file);

      let data = new FormData();
      data.append("video", file);

      commonService.uploadingVideo(data).then((res) => {
        if (res !== undefined) {
          setVideoPath(res?.video_url);
        }
      });
    }
  };

  return (
    <div>
      <input
        type="file"
        id="upload-file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="upload-file">
        <Button
          component="span"
          color="info"
          variant="contained"
          startIcon={<FileUploadOutlinedIcon />}
        >
          Upload Videdo
        </Button>
      </label>
    </div>
  );
};

export default UploadVideoButton;
