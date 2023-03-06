import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import { StyledTableRow } from "../Style/MUIStyle";
import { ThemeContext } from "./../Context";

const SearchPage = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    axios
      .post(
        "http://localhost:3000/getdata/search",
        {
          word: location.state.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setData(res.data);
      });
  }, [location.state.value]);

  const onListen = (text) => {
    axios
      .post(
        "http://localhost:3000/getdata/tts",
        {
          text,
        },
        {
          responseType: "arraybuffer",
        }
      )
      .then((res) => {
        const context = new AudioContext();
        context.decodeAudioData(res.data, (buffer) => {
          const source = context.createBufferSource();
          source.buffer = buffer;
          source.connect(context.destination);
          source.start(0);
        });
      });
  };

  const MyTableRow = ({ width, title, label }) => {
    return (
      <StyledTableRow>
        <TableCell
          component="th"
          scope="row"
          sx={{
            width: width,
            borderRight: 1,
            borderRightColor: "grey.300",
            padding: "0 15px",
            backgroundColor: isDark ? "hsl(0, 0%, 30%)" : undefined,
            color: isDark ? "lightgray" : undefined,
          }}
        >
          <Typography sx={{ display: "inline" }}>{title}</Typography>
          <IconButton
            onClick={() => {
              onListen(label);
            }}
            sx={{
              float: "right",
              padding: 0,
              color: isDark ? "lightgray" : undefined,
            }}
          >
            <VolumeMuteIcon />
          </IconButton>
        </TableCell>
        <TableCell
          align="left"
          sx={{
            backgroundColor: isDark ? "hsl(0, 0%, 30%)" : undefined,
          }}
        >
          <Typography
            sx={{
              fontSize: 17,
              color: isDark ? "lightgray" : undefined,
            }}
          >
            {label}
          </Typography>
        </TableCell>
      </StyledTableRow>
    );
  };

  return (
    <>
      <Stack direction="row" spacing={2} mb={2}>
        <IconButton
          sx={{
            border: "1px solid lightgray",
            color: isDark ? "lightgray" : undefined,
            "&:hover": {
              backgroundColor: isDark ? "hsl(0, 0%, 45%)" : "lightgray",
            },
          }}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <HomeIcon />
        </IconButton>
        <Typography
          fontSize={"18px"}
          pt={"7px"}
          sx={{ color: isDark ? "lightgray" : undefined }}
        >
          검색 키워드 : {location.state.value}
        </Typography>
      </Stack>
      {data.map((item) => {
        return (
          <TableContainer
            component={Paper}
            key={item.data_id}
            sx={{ mb: "20px" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
              <TableBody>
                <MyTableRow width="10%" title="단어" label={item.voca} />
                <MyTableRow width="7%" title="단어 뜻" label={item.voca_mean} />
                <MyTableRow width="7%" title="예문" label={item.exam} />
                <MyTableRow width="7%" title="예문 뜻" label={item.exam_mean} />
              </TableBody>
            </Table>
          </TableContainer>
        );
      })}
    </>
  );
};

export default SearchPage;
