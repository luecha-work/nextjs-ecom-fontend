import ButtonBack from "@/components/ui/button-back";
import AuthService from "@/service/auth.sevice";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CrudUser from "@/service/user.sevice";
import ConfirmProcessModal from "@/components/ui/confirm-process-modal";

const ProfilePage: NextPage = () => {
  const authService = new AuthService();
  const userService = new CrudUser();

  const [open, setOpen] = useState(false);
  const [textModal, setTextModal] = useState<string>("");
  const [colorIconModal, setColorIconModal] = useState<string>("");

  const [userId, setUserId] = useState<string>("");
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    roleName: "",
  });
  const [isEdit, setIsEdit] = useState({
    isFirstname: false,
    isLastname: false,
    isPhoneNumber: false,
    isEmail: false,
    isDateOfBirth: false,
    isGender: false,
    isRoleName: false,
  });

  const handleChangeGender = (event: SelectChangeEvent) => {
    setProfile({
      ...profile,
      gender: event.target.value,
    });
  };

  const handleDateOfBirthChange = (date: any) => {
    setProfile({
      ...profile,
      dateOfBirth: date.toString(),
    });
  };

  const handleCancelButton = async () => {
    setIsEdit({
      isFirstname: false,
      isLastname: false,
      isPhoneNumber: false,
      isEmail: false,
      isDateOfBirth: false,
      isGender: false,
      isRoleName: false,
    });

    authService.userInfo().then((res) => {
      if (res?.status_code === "200") {
        setUserId(res?.result.id);
        setProfile({
          firstname: res?.result.firstname,
          lastname: res?.result.lastname,
          phoneNumber: res?.result.phoneNumber,
          email: res?.result.email,
          dateOfBirth: res?.result.dateOfBirth,
          gender: res?.result.gender,
          roleName: res?.result.role.roleName,
        });
      }
    });
  };

  const handleConfirmButton = () => {
    const data = {
      firstname: profile.firstname,
      lastname: profile.lastname,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      role: profile.roleName,
    };

    if (
      isEdit.isFirstname ||
      isEdit.isLastname ||
      isEdit.isPhoneNumber ||
      isEdit.isDateOfBirth ||
      isEdit.isGender
    ) {
      userService.updateById(userId, data).then((res) => {
        if (res?.status_code === "200") {
          setTextModal("แก้ไขข้อมูลส่วนตัวสำเร็จ");
          setColorIconModal("green");
          setOpen(true);
        } else {
          setTextModal("แก้ไขข้อมูลส่วนตัวล้มเหลว");
          setColorIconModal("red");
          setOpen(true);
        }
      });
    } else {
      setTextModal("ไม่มีการแก้ไขข้อมูลส่วนตัว");
      setColorIconModal("#ffa726");
      setOpen(true);
    }
  };

  const nextStepFunction = () => {
    setOpen(false);
    setIsEdit({
      isFirstname: false,
      isLastname: false,
      isPhoneNumber: false,
      isEmail: false,
      isDateOfBirth: false,
      isGender: false,
      isRoleName: false,
    });
    authService.userInfo().then((res) => {
      if (res?.status_code === "200") {
        setUserId(res?.result.id);
        setProfile({
          firstname: res?.result.firstname,
          lastname: res?.result.lastname,
          phoneNumber: res?.result.phoneNumber,
          email: res?.result.email,
          dateOfBirth: res?.result.dateOfBirth,
          gender: res?.result.gender,
          roleName: res?.result.role.roleName,
        });
      }
    });
  };

  useEffect(() => {
    authService.userInfo().then((res) => {
      if (res?.status_code === "200") {
        setUserId(res?.result.id);
        setProfile({
          firstname: res?.result.firstname,
          lastname: res?.result.lastname,
          phoneNumber: res?.result.phoneNumber,
          email: res?.result.email,
          dateOfBirth: res?.result.dateOfBirth,
          gender: res?.result.gender,
          roleName: res?.result.role.roleName,
        });
      }
    });
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ConfirmProcessModal
        open={open}
        text={textModal}
        colorIcon={colorIconModal}
        nextStepFunction={nextStepFunction}
      />
      <Grid container spacing={2} columns={16}>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="row"
          alignItems="center"
        >
          <ButtonBack />
        </Box>
      </Grid>
      <Grid container mt={2} spacing={2} columns={16}>
        <Grid item xs={4}></Grid>
        <Grid item xs={8}>
          <Card sx={{ width: "100%", paddingY: "3rem" }}>
            <CardHeader
              sx={{ textAlign: "center", marginBottom: "2rem" }}
              title="ข้อมูลส่วนบุคคล"
            />
            <CardContent>
              <Typography
                gutterBottom
                component="div"
                sx={{
                  textAlign: "center",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <div>
                  <img
                    className="profilePageImage"
                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel`}
                    alt="setting-profile"
                    loading="lazy"
                  />
                </div>
              </Typography>

              <Typography
                mt={2}
                gutterBottom
                component="div"
                sx={{ textAlign: "center", display: "flex" }}
              >
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={2}>
                    <InputLabel sx={{ display: "flex", color: "black" }}>
                      ชื่อ
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label=""
                      disabled={!isEdit.isFirstname}
                      value={profile.firstname}
                      variant="outlined"
                      sx={{ backgroundColor: "white", width: "80%" }}
                      size="small"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          firstname: e.target.value,
                        })
                      }
                    />
                    <IconButton
                      aria-label="edit firstname"
                      sx={{ marginLeft: "1rem" }}
                      onClick={() => {
                        setIsEdit({
                          ...isEdit,
                          isFirstname: true,
                        });
                      }}
                    >
                      <BorderColorOutlinedIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Typography>

              <Typography
                mt={2}
                gutterBottom
                component="div"
                sx={{ textAlign: "center", display: "flex" }}
              >
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={2}>
                    <InputLabel sx={{ display: "flex", color: "black" }}>
                      นามสกุล
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label=""
                      disabled={!isEdit.isLastname}
                      value={profile.lastname}
                      variant="outlined"
                      sx={{ backgroundColor: "white", width: "80%" }}
                      size="small"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          lastname: e.target.value,
                        })
                      }
                    />
                    <IconButton
                      aria-label="edit lastname"
                      sx={{ marginLeft: "1rem" }}
                      onClick={() => {
                        setIsEdit({
                          ...isEdit,
                          isLastname: true,
                        });
                      }}
                    >
                      <BorderColorOutlinedIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Typography>
              <Typography
                mt={2}
                gutterBottom
                component="div"
                sx={{ textAlign: "center", display: "flex" }}
              >
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={2}>
                    <InputLabel sx={{ display: "flex", color: "black" }}>
                      เบอร์โทร
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label=""
                      disabled={!isEdit.isPhoneNumber}
                      value={profile.phoneNumber}
                      variant="outlined"
                      sx={{ backgroundColor: "white", width: "80%" }}
                      size="small"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                    <IconButton
                      aria-label="edit phone number"
                      sx={{ marginLeft: "1rem" }}
                      onClick={() => {
                        setIsEdit({
                          ...isEdit,
                          isPhoneNumber: true,
                        });
                      }}
                    >
                      <BorderColorOutlinedIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Typography>
              <Typography
                mt={2}
                gutterBottom
                component="div"
                sx={{ textAlign: "center", display: "flex" }}
              >
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={2}>
                    <InputLabel sx={{ display: "flex", color: "black" }}>
                      อีเมล
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label=""
                      disabled={!isEdit.isEmail}
                      value={profile.email}
                      variant="outlined"
                      sx={{ backgroundColor: "white", width: "80%" }}
                      size="small"
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          email: e.target.value,
                        })
                      }
                    />
                    <IconButton
                      aria-label="edit email"
                      sx={{ marginLeft: "1rem" }}
                      onClick={() => {
                        setIsEdit({
                          ...isEdit,
                          isEmail: true,
                        });
                      }}
                    >
                      <BorderColorOutlinedIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Typography>
              <Typography
                mt={2}
                gutterBottom
                component="div"
                sx={{ textAlign: "center", display: "flex" }}
              >
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={2}>
                    <InputLabel sx={{ display: "flex", color: "black" }}>
                      วัน/เดือน/ปี เกิด
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disabled={!isEdit.isDateOfBirth}
                        sx={{ backgroundColor: "white", width: "80%" }}
                        value={dayjs(profile.dateOfBirth?.toString())}
                        slotProps={{ textField: { size: "small" } }}
                        onChange={handleDateOfBirthChange}
                      />
                    </LocalizationProvider>
                    <IconButton
                      aria-label="edit date of birth"
                      sx={{ marginLeft: "1rem" }}
                      onClick={() => {
                        setIsEdit({
                          ...isEdit,
                          isDateOfBirth: true,
                        });
                      }}
                    >
                      <BorderColorOutlinedIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Typography>
              <Typography
                mt={2}
                gutterBottom
                component="div"
                sx={{ textAlign: "center", display: "flex", color: "black" }}
              >
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={2}>
                    <InputLabel sx={{ display: "flex", color: "black" }}>
                      เพศ
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      sx={{ width: "80%" }}
                      size="small"
                      required
                      disabled={!isEdit.isGender}
                    >
                      <Select
                        id="select-label-gender"
                        value={profile.gender}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        label=""
                        sx={{ textAlign: "start" }}
                        onChange={handleChangeGender}
                      >
                        <MenuItem value="" disabled>
                          None
                        </MenuItem>
                        <MenuItem value="men">ชาย</MenuItem>
                        <MenuItem value="women">หญิง</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton
                      aria-label="edit gender"
                      sx={{ marginLeft: "1rem" }}
                      onClick={() => {
                        setIsEdit({
                          ...isEdit,
                          isGender: true,
                        });
                      }}
                    >
                      <BorderColorOutlinedIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Typography>
              <Typography
                gutterBottom
                mt={2}
                component="div"
                sx={{
                  textAlign: "center",
                  display: "flex",
                }}
              >
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={2}>
                    <InputLabel sx={{ display: "flex", color: "black" }}>
                      บทบาท
                    </InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label=""
                      disabled={true}
                      value={profile.roleName}
                      variant="outlined"
                      sx={{ backgroundColor: "white", width: "80%" }}
                      size="small"
                    />
                    <Box component="span" sx={{ marginX: "1.7rem" }}></Box>
                  </Grid>
                </Grid>
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                mt={5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  justifyItems: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{ width: "30%" }}
                  variant="outlined"
                  color="error"
                  onClick={handleCancelButton}
                >
                  ยกเลิก
                </Button>
                <Button
                  sx={{ width: "30%" }}
                  variant="contained"
                  color="success"
                  onClick={handleConfirmButton}
                >
                  ตกลง
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
