import ResiterForm from "@/components/register-form/resiter-form";
import { NextPage } from "next";
import { useEffect } from "react";

const RegisterPage: NextPage = () => {
  useEffect(() => {}, []);

  return <ResiterForm AddUser={false} />;
};

export default RegisterPage;
