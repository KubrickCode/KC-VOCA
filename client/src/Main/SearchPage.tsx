import { useEffect, useState } from "react";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAxiosHook } from "../CustomHooks";
import { useGlobalStore, usePersistStore } from "../State/GlobalStore";
import { useMainStore } from "../State/MainStore";

type dataItem = {
  data_id: number;
  voca: string;
  voca_mean: string;
  exam: string;
  exam_mean: string;
};

type MyTableRowProps = {
  title: string;
  label: string;
};

const SearchPage = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const state = useMainStore((state) => state);
  const url = import.meta.env.VITE_SERVER_HOST;
  const theme = usePersistStore((state) => !state.theme);
  const navigate = useNavigate();
  const { useAxios } = useAxiosHook();
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  useEffect(() => {
    const fetchData = async () => {
      const data = await useAxios(
        "post",
        `${url}/getdata/search`,
        setIsLoading,
        {
          word: location.state.value,
        }
      );
      setData(data);
    };

    fetchData();
  }, [location.state.value]);

  const textColor = { color: theme ? "lightgray" : "hsl(0, 0%, 20%)" };

  return (
    <>
      <Stack direction="row" spacing={2} mb={2} mt={10}>
        <IconButton
          sx={{
            ...textColor,
            border: "1px solid lightgray",
            "&:hover": {
              backgroundColor: theme ? "hsl(0, 0%, 45%)" : "lightgray",
            },
          }}
          onClick={() => {
            navigate("/");
            state.setSelectedFolder("get_recent_file");
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
          <DataBody
            data_id={item.data_id}
            voca={item.voca}
            voca_mean={item.voca_mean}
            exam={item.exam}
            exam_mean={item.exam_mean}
            key={item.data_id}
          />
        );
      })}
    </>
  );
};

const MyTableRow = ({ title, label }: MyTableRowProps) => {
  const url = import.meta.env.VITE_SERVER_HOST;
  const theme = usePersistStore((state) => !state.theme);
  const matches2 = useMediaQuery("(max-width:1092px)");
  const matches3 = useMediaQuery("(max-width:554px)");
  const width = matches3 ? "35%" : matches2 ? "20%" : "10%";
  const bgColor = { backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white" };
  const textColor = { color: theme ? "lightgray" : "hsl(0, 0%, 20%)" };
  const { useAxios } = useAxiosHook();
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);

  const onListen = async (text: string) => {
    const data = await useAxios(
      "post",
      `${url}/getdata/tts`,
      setIsLoading,
      {
        text,
      },
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

const DataBody = ({ voca, voca_mean, exam, exam_mean }: dataItem) => (
  <TableContainer component={Paper} sx={{ mb: "20px" }}>
    <Table sx={{ minWidth: 650 }} aria-label="caption table">
      <TableBody>
        <MyTableRow title="단어" label={voca} />
        <MyTableRow title="단어 뜻" label={voca_mean} />
        <MyTableRow title="예문" label={exam} />
        <MyTableRow title="예문 뜻" label={exam_mean} />
      </TableBody>
    </Table>
  </TableContainer>
);

export default SearchPage;
