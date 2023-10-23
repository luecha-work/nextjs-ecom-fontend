import { NextPage } from "next";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import classec from "./profile.module.css";
import { Button, IconButton } from "@mui/material";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import { useEffect, useState } from "react";

import axios from "axios";

interface ProfileProps {
  // handleSetProfile: (imageProfile: FormData) => void;
  profileImageUrl: string;
  profileAltText: string;
  isShowProfile: boolean;
}

const Profile: NextPage<ProfileProps> = ({
  profileImageUrl,
  profileAltText,
  isShowProfile,
}) => {
  const [profilePath, setProfilePath] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };

      reader.readAsDataURL(file);

      //if can select profile
      let data = new FormData();
      data.append("image", file);
      // handleSetProfile(data);
    }
  };

  useEffect(() => {
    if (profileImageUrl === "") {
      setProfilePath(`images/profile/non-profile.png`);
    }
  }, []);

  return (
    <div className={classec.profileContainer}>
      <img
        className={classec.profileImage}
        //if can select profile
        // src={selectedImage == null ? profilePath : selectedImage}
        src={`https://xsgames.co/randomusers/avatar.php?g=pixel`}
        alt={profileAltText}
        loading="lazy"
      />

      {/* if can select profile */}
      <div className={classec.profileIconImage}>
        {/* <input
          accept="image/*"
          id="image-uploader"
          type="file"
          onChange={handleImageChange}
          style={{ display: "none" }}
        /> */}
        <label>
          <IconButton className={classec.profileIconButton} component="span">
            <PhotoCameraRoundedIcon className={classec.icon} fontSize="large" />
          </IconButton>
        </label>
      </div>
    </div>
  );
};

export default Profile;
