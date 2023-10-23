import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import classec from "./resiter-form.module.css";
import Profile from "../ui/profile";
import ButtonLogin from "../ui/button";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Textarea from "@mui/joy/Textarea";
import { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import Dropdown from "../ui/dropdown";
import TextFieldPassword from "../ui/textfield-password";
import TambonsService from "@/service/tambons.service";
import AuthService from "@/service/auth.sevice";
import { useRouter } from "next/router";
import { RolesService } from "@/service/roles.service";
import RegisterMarketModal from "../ui/register-market.modal";
import {
  RegisterForm,
  RegisterFormErrors,
} from "@/common/models/register.interface";
import isEmail from "validator/lib/isEmail";

interface RegisProp {
  AddUser: boolean;
}

const ResiterForm: NextPage<RegisProp> = ({ AddUser }) => {
  const router = useRouter();
  const tambonsService = new TambonsService();
  const rolesService = new RolesService();
  const authService = new AuthService();

  const [provinceItems, setProvinceItems] = useState([]);
  const [amphoeItems, setAmphoeItems] = useState([
    { value: "", label: "กรุณาเลือกจังหวัด" },
  ]);

  const [districtItems, setDistrictItems] = useState([
    { value: "", label: "กรุณาเลือกอำเภอ" },
  ]);

  const [rolesItems, setRolesItems] = useState([]);

  const pathImage = "images/";
  const [registerFormData, setRegisterFormData] = useState<RegisterForm>({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: dayjs().toISOString(),
    gender: "",
    detailAddress: "",
    password: "",
    confirmPassword: "",
    roleCode: "",
    province: "",
    amphoe: "",
    district: "",
    zipCode: "",
  });

  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    gender: "",
    detailAddress: "",
    password: "",
    confirmPassword: "",
    roleCode: "",
    province: "",
    amphoe: "",
    district: "",
    zipCode: "",
  });

  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(true);
  const [isValidConfirmPasswordPattern, setIsValidConfirmPasswordPattern] =
    useState(true);

  const validatePasswordPattern = (value: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    const hasMinimumLength = value.length >= 8;
    return regex.test(value) && hasMinimumLength;
  };

  const validateForm = () => {
    let errors: RegisterFormErrors = {};
    let isValid = true;

    if (!registerFormData.firstname) {
      errors.firstname = "กรุณากรอกชื่อ";

      isValid = false;
    }

    if (!registerFormData.lastname) {
      errors.lastname = "กรุณากรอกนามสกุล";

      isValid = false;
    }

    if (
      !registerFormData.phoneNumber ||
      registerFormData.phoneNumber.length > 10
    ) {
      errors.phoneNumber = "กรุณากรอกเบอร์(จะต้องไม่เกิน 10 หลัก)";

      isValid = false;
    }

    if (!registerFormData.email || !isEmail(registerFormData.email)) {
      errors.email = "กรุณากรอกอีเมล(ต้องมี @ และ .com)";

      isValid = false;
    }

    if (!registerFormData.gender) {
      errors.gender = "กรุณาเลือกเพศ";

      isValid = false;
    }

    if (!registerFormData.detailAddress) {
      errors.detailAddress = "กรุณากรอกรายละเอียดที่อยู่";

      isValid = false;
    }

    if (!registerFormData.roleCode || registerFormData.roleCode === "") {
      errors.roleCode = "กรุณาเลือกบทบาท";

      isValid = false;
    }

    if (!registerFormData.province || registerFormData.province === "") {
      errors.province = "กรุณาเลือกจังหวัด";

      isValid = false;
    }

    if (!registerFormData.amphoe || registerFormData.amphoe === "") {
      errors.amphoe = "กรุณาเลือกอำเภอ";

      isValid = false;
    }

    if (!registerFormData.district || registerFormData.district === "") {
      errors.district = "กรุณาเลือกตำบล";

      isValid = false;
    }

    if (!registerFormData.password) {
      errors.password = "กรุณากรอกรหัสผ่าน";

      isValid = false;
    }

    if (!registerFormData.confirmPassword) {
      errors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // const handleSubmit = async () => {
  //   if (validateForm()) {
  //     const registerUser = await authService.register(registerFormData);

  //     if (registerUser && registerUser !== undefined) {
  //       Cookies.set("email", registerFormData.email, { expires: 3 }); // Set cookie to expire in 7 days
  //       Cookies.set("password", registerFormData.password, { expires: 3 });
  //       Cookies.set("rememberMe", "true", { expires: 3 });

  //       Cookies.remove("jwt_token");

  //       router.push("/login");
  //     } else {
  //       Cookies.remove("email");
  //       Cookies.remove("password");
  //       Cookies.remove("rememberMe");
  //     }
  //   }
  // };

  const handleLoginFacebook = async () => {};

  const handleLoginGoogle = async () => {};

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;

    setRegisterFormData({
      ...registerFormData,
      password: newPassword,
    });

    setIsValidPasswordPattern(validatePasswordPattern(newPassword));
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = event.target.value;

    setRegisterFormData({
      ...registerFormData,
      confirmPassword: newPassword,
    });

    setIsValidConfirmPasswordPattern(validatePasswordPattern(newPassword));
  };

  const handleChangeGender = (event: SelectChangeEvent) => {
    setRegisterFormData({
      ...registerFormData,
      gender: event.target.value,
    });
  };

  const handleChangeProvince = async (event: SelectChangeEvent) => {
    setRegisterFormData({
      ...registerFormData,
      province: event.target.value as string,
      zipCode: "",
      amphoe: "",
      district: "",
    });

    const responseAmphoe = await tambonsService.getAmphoe(
      event.target.value as string
    );
    setAmphoeItems(responseAmphoe.result);
  };

  const handleChangeAmphoe = async (event: SelectChangeEvent) => {
    setRegisterFormData({
      ...registerFormData,
      amphoe: event.target.value,
      district: "",
      zipCode: "",
    });

    const responseDistrict = await tambonsService.getDistrict(
      registerFormData.province,
      event.target.value as string
    );

    setDistrictItems(responseDistrict.result);
  };

  const handleChangeDistrict = async (event: SelectChangeEvent) => {
    const responseZipCode = await tambonsService.getZipCode(
      event.target.value as string,
      registerFormData.amphoe,
      registerFormData.province
    );

    setRegisterFormData({
      ...registerFormData,
      district: event.target.value,
      zipCode: responseZipCode.result[0].zipcode,
    });
  };

  const handleChangeRole = async (event: SelectChangeEvent) => {
    setRegisterFormData({
      ...registerFormData,
      roleCode: event.target.value.toString(),
    });
  };

  const handleDateOfBirthChange = (date: any) => {
    setRegisterFormData({
      ...registerFormData,
      dateOfBirth: date.toString(),
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const responseProvince = await tambonsService.getProvince();
        const responseRoles = await rolesService.getRolesToRegister();
        setRolesItems(responseRoles.result);
        setProvinceItems(responseProvince.result);
      } catch (error) {}
    }
    fetchData();
  }, []);

  return (
    <Grid
      item
      container
      className={classec.content}
      rowSpacing={0}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <Grid className={classec.contentGrid} item xs={3}></Grid>
      <Grid className={classec.contentGrid} item xs={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div className={classec.profileContent}>
            <Profile
              // handleSetProfile={handleSetProfile}
              profileImageUrl={""}
              // profileImageUrl={`images/profile/profile.jpeg`}
              profileAltText={`profile`}
              isShowProfile={false}
            />
          </div>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          <h3 style={{ padding: "0rem", margin: "0rem" }}>ข้อมูลส่วนตัว</h3>
          <FormControl
            fullWidth
            size="small"
            required
            error={!!formErrors.firstname}
          >
            <TextField
              label="ชื่อ"
              variant="outlined"
              className={classec.textField}
              size="small"
              onChange={(e) =>
                setRegisterFormData({
                  ...registerFormData,
                  firstname: e.target.value,
                })
              }
              required
              error={!!formErrors.firstname}
            />
            {formErrors.firstname && (
              <FormHelperText>{formErrors.firstname}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            size="small"
            required
            error={!!formErrors.lastname}
          >
            <TextField
              label="นามสกุล"
              variant="outlined"
              className={classec.textField}
              size="small"
              onChange={(e) =>
                setRegisterFormData({
                  ...registerFormData,
                  lastname: e.target.value,
                })
              }
              required
              error={!!formErrors.lastname}
            />
            {formErrors.lastname && (
              <FormHelperText>{formErrors.lastname}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            size="small"
            required
            error={!!formErrors.phoneNumber}
          >
            <TextField
              label="เบอร์โทร"
              variant="outlined"
              className={classec.textField}
              size="small"
              onChange={(e) =>
                setRegisterFormData({
                  ...registerFormData,
                  phoneNumber: e.target.value,
                })
              }
              required
              error={!!formErrors.phoneNumber}
            />
            {formErrors.phoneNumber && (
              <FormHelperText>{formErrors.phoneNumber}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            size="small"
            required
            error={!!formErrors.email}
          >
            <TextField
              type="email"
              label="อีเมล"
              variant="outlined"
              className={classec.textField}
              size="small"
              onChange={(e) =>
                setRegisterFormData({
                  ...registerFormData,
                  email: e.target.value,
                })
              }
              required
              error={!!formErrors.email}
            />
            {formErrors.email && (
              <FormHelperText>{formErrors.email}</FormHelperText>
            )}
          </FormControl>

          <span>
            <InputLabel className={classec.labelInputContent}>
              ปีเกิด
            </InputLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className={classec.datePicker}
                defaultValue={dayjs()}
                slotProps={{ textField: { size: "small" } }}
                onChange={handleDateOfBirthChange}
              />
            </LocalizationProvider>
          </span>
          <span>
            <InputLabel className={classec.labelInputContent}>เพศ</InputLabel>
            <FormControl
              sx={{ width: "100%" }}
              size="small"
              required
              error={!!formErrors.gender}
            >
              <Select
                className={classec.selectGenderContent}
                id="select-label-ender"
                value={registerFormData.gender}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                label=""
                onChange={handleChangeGender}
              >
                <MenuItem value="" disabled>
                  None
                </MenuItem>
                <MenuItem value="men">ชาย</MenuItem>
                <MenuItem value="women">หญิง</MenuItem>
              </Select>
              {formErrors.gender && (
                <FormHelperText>{formErrors.gender}</FormHelperText>
              )}
            </FormControl>
          </span>
        </Box>
      </Grid>
      <Grid className={classec.contentGrid} item xs={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            marginTop: "10rem",
          }}
        >
          <h3 style={{ padding: "0rem", margin: "0rem" }}>ที่อยู่</h3>
          <FormControl
            fullWidth
            size="small"
            required
            error={!!formErrors.detailAddress}
          >
            <Textarea
              placeholder="รายละเอียดที่อยู่"
              minRows={2}
              maxRows={4}
              className={classec.textarea}
              onChange={(e) =>
                setRegisterFormData({
                  ...registerFormData,
                  detailAddress: e.target.value,
                })
              }
              error={!!formErrors.detailAddress}
            />
            {formErrors.detailAddress && (
              <FormHelperText>{formErrors.detailAddress}</FormHelperText>
            )}
          </FormControl>

          <Dropdown
            label="จังหวัด"
            items={provinceItems}
            value={registerFormData.province}
            handleChange={handleChangeProvince}
            validateError={formErrors.province}
          />
          <Dropdown
            label="อำเภอ/เขต"
            items={amphoeItems}
            value={registerFormData.amphoe}
            handleChange={handleChangeAmphoe}
            validateError={formErrors.amphoe}
          />
          <Dropdown
            label="ตำบล/แขวง"
            items={districtItems}
            value={registerFormData.district}
            handleChange={handleChangeDistrict}
            validateError={formErrors.district}
          />
          <TextField
            label="รหัสไปรษณีย์"
            variant="outlined"
            className={classec.textField}
            size="small"
            disabled
            value={registerFormData.zipCode}
          />

          <Dropdown
            label="role"
            items={rolesItems}
            value={registerFormData.roleCode}
            handleChange={handleChangeRole}
            validateError={formErrors.roleCode}
          />

          <TextFieldPassword
            label="password"
            password={registerFormData.password}
            handlePasswordChange={handlePasswordChange}
            validateError={formErrors.password}
            isValidPasswordPattern={isValidPasswordPattern}
          />

          <TextFieldPassword
            label="confirm password"
            password={registerFormData.confirmPassword}
            handlePasswordChange={handleConfirmPasswordChange}
            validateError={formErrors.confirmPassword}
            isValidPasswordPattern={isValidConfirmPasswordPattern}
          />

          <div className={classec.ButtonActions}>
            {/* <ButtonLogin onClick={handleSubmit} background={"color"}>
              ยืนยันการสมัคร
            </ButtonLogin> */}
            <RegisterMarketModal
              validateForm={validateForm}
              registerFormData={registerFormData}
              AddUser={AddUser}
            />
          </div>
        </Box>
      </Grid>
      {/* <Grid
        className={classec.contentGrid}
        item
        xs={2}
        style={{ borderLeft: "1px solid" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "22rem",
          }}
        >
          <h3>หรือลงทะเบียนด้วย</h3>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Grid container>
            <Grid item xs>
              <div className={classec.actions}>
                <ButtonLogin onClick={handleLoginFacebook} background={""}>
                  <span>
                    <img
                      className={classec.img}
                      src={`${pathImage}/facebook.png`}
                      alt={"FaceBook"}
                      loading="lazy"
                    />
                  </span>
                  <span>Facebook</span>
                </ButtonLogin>
              </div>
            </Grid>
            <Grid item xs>
              <div className={(classec.actions, classec.btnLogin)}>
                <ButtonLogin onClick={handleLoginGoogle} background={""}>
                  <span>
                    <img
                      className={classec.img}
                      src={`${pathImage}/google.webp`}
                      alt={"Google"}
                      loading="lazy"
                    />
                  </span>
                  <span>Facebook</span>
                </ButtonLogin>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Grid> */}
      <Grid className={classec.contentGrid} item xs={3}></Grid>
    </Grid>
  );
};

export default ResiterForm;
