import VideoPlayer from "@/components/video-player/video-player";
import { Box, Card, CardContent, CircularProgress, Grid } from "@mui/material";
import { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";
import UploadVideoButton from "@/components/video-player/upload-video-button";
import { CommonService } from "@/service/common.service";
import { useStore } from "@/common/class/stateManagement";

const InstructionManual: NextPage = () => {
  const commonService = new CommonService();

  const isLoading_status = useStore((state) => state.spin_status);

  const [videoPath, setVideoPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    commonService.getVideoPath().then((res) => {
      if (res !== undefined) {

        setVideoPath(res?.video_url);
        // setIsLoading(false);
      }
    });
  }, []);

  return (
    <Fragment>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            fontSize: "1rem",
            color: "#9b9090",
          }}
        >
          <CircularProgress size={60} disableShrink={isLoading_status} />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} columns={16}>
            <Grid item xs={1}></Grid>
            <Grid item xs={14}>
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="row"
                alignItems="center"
                alignContent="center"
              >
                <p className="titlePages">คู่มือการใช้งาน</p>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="row"
                alignItems="center"
                alignContent="center"
                marginY={2}
              >
                <Card sx={{ width: "80%", backgroundColor: "#d7ccc8" }}>
                  <CardContent>
                    <section className="video_player">
                      <VideoPlayer videoPath={videoPath} />
                    </section>
                    <Box display="flex" justifyContent="start" marginX={4}>
                      <UploadVideoButton setVideoPath={setVideoPath} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </Box>
      )}
    </Fragment>
  );
};

export default InstructionManual;
