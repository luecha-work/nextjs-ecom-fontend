export interface BaseUserInfoResult {
  status_code: string;
  result: {
    id: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    active: boolean;
    createBy: string;
    updateBy: string | null;
    createAt: Date;
    updateAt: Date;
    dateOfBirth: Date;
    gender: string;
    role: {
      id: string;
      roleCode: number;
      roleName: string;
      active: boolean;
      createBy: string;
      updateBy: string | null;
      createAt: Date;
      updateAt: Date;
    };
  };
  JWT_Token: string;
  messes: string;
}
