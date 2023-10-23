export interface RegisterFormErrors {
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
  email?: string;
  gender?: string;
  detailAddress?: string;
  password?: string;
  confirmPassword?: string;
  roleCode?: string;
  province?: string;
  amphoe?: string;
  district?: string;
  zipCode?: string;
}

export interface RegisterForm {
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
