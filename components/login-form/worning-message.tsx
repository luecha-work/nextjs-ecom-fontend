import { NextPage } from "next";

import classec from "./worning-message.module.css";
import { useState } from "react";

interface WorningMessageProps {
  isLoggedIn: boolean;
}

const WorningMessage: NextPage<WorningMessageProps> = ({ isLoggedIn }) => {
  const message: string = `อีเมลหรือรหัสผ่านไม่ถูกต้อง.`;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <p
        className={classec.worningMessage}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isLoggedIn ? "" : message}
      </p>
    </>
  );
};

export default WorningMessage;
