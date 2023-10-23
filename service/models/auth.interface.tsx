export interface loginBody {
  email: string;
  password: string;
}

export interface registerBody {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  detailAddress: string;
  password: string;
  confirmPassword: string;
  roleCode: string;
  province: string;
  amphoe: string;
  district: string;
  zipCode: string;
}

export interface UserType {
  active: boolean;
  createAt: string;
  createBy: string;
  dateOfBirth: any;
  email: string;
  firstname: string;
  gender: string;
  id: string;
  lastname: string;
  phoneNumber: string;
  role: { roleName: string };
  updateAt: string;
  updateBy: string;
  roleId: string;
}
