import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
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
import { GlobalContext, MainContext } from "../Context";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAxios } from "../Module";

const SearchPage = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const { dispatch } = useContext(MainContext);
  const { theme, url, setLoad } = useContext(GlobalContext);
  const isDark = theme === "dark";
  const matches2 = useMediaQuery("(max-width:1092px)");
  const matches3 = useMediaQuery("(max-width:554px)");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await useAxios(
        "post",
        `${url}/getdata/search`,
        {
          word: location.state.value,
        },
        setLoad
      );
      setData(data);
    };

    fetchData();
  }, [location.state.value]);

  const onListen = async (text: string) => {
    const data = await useAxios(
      "post",
      `${url}/getdata/tts`,
      {
        text,
      },
      setLoad,
      {
        responseType: "arraybuffer",
      }
    );
    const context = new AudioContext();
    context.decodeAudioData(data, (buffer) => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    });
  };

  const bgColor = { backgroundColor: isDark ? "hsl(0, 0%, 30%)" : "white" };
  const textColor = { color: isDark ? "lightgray" : "hsl(0, 0%, 20%)" };

  interface MyTableRowProps {
    title: string;
    label: string;
  }

  const MyTableRow = ({ title, label }: MyTableRowProps) => {
    const width = matches3 ? "35%" : matches2 ? "20%" : "10%";

    return (
      <StyledTableRow>
        <TableCell
          component="th"
          scope="row"
          sx={{
            ...bgColor,
            ...textColor,
            width: width,
            borderRight: 1,
            borderRightColor: "grey.300",
            padding: "0 15px",
          }}
        >
          <Typography sx={{ display: "inline" }}>{title}</Typography>
          <IconButton
            onClick={() => {
              onListen(label);
            }}
            sx={{
              ...textColor,
              float: "right",
              padding: 0,
            }}
          >
            <VolumeMuteIcon />
          </IconButton>
        </TableCell>
        <TableCell
          align="left"
          sx={{
            ...bgColor,
            wordBreak: "break-all",
          }}
        >
          <Typography
            sx={{
              ...textColor,
              fontSize: 17,
            }}
          >
            {label}
          </Typography>
        </TableCell>
      </StyledTableRow>
    );
  };

  interface dataItem {
    data_id: number;
    voca: string;
    voca_mean: string;
    exam: string;
    exam_mean: string;
  }

  return (
    <>
      <Stack direction="row" spacing={2} mb={2} mt={10}>
        <IconButton
          sx={{
            ...textColor,
            border: "1px solid lightgray",
            "&:hover": {
              backgroundColor: isDark ? "hsl(0, 0%, 45%)" : "lightgray",
            },
          }}
          onClick={() => {
            navigate("/");
            dispatch({
              type: "setSelectedFolder",
              payload: "get_recent_file",
            });
          }}
        >
          <HomeIcon />
        </IconButton>
        <Typography fontSize={"18px"} pt={"7px"} sx={textColor}>
          검색 키워드 : {location.state.value}
        </Typography>
      </Stack>
      {data.map((item: dataItem) => {
        return (
          <TableContainer
            component={Paper}
            key={item.data_id}
            sx={{ mb: "20px" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
              <TableBody>
                <MyTableRow title="단어" label={item.voca} />
                <MyTableRow title="단어 뜻" label={item.voca_mean} />
                <MyTableRow title="예문" label={item.exam} />
                <MyTableRow title="예문 뜻" label={item.exam_mean} />
              </TableBody>
            </Table>
          </TableContainer>
        );
      })}
    </>
  );
};

export default SearchPage;