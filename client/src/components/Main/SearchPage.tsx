import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePersistStore } from "../../Store/GlobalStore";
import { useMainStore } from "../../Store/MainStore";
import { StyledTableRow } from "../../Style/MUIStyle";
import HomeIcon from "@mui/icons-material/Home";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import {
  Typography,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { SearchDataItem, SearchMyTableRowProps } from "../ComponentsType";
import { useQueryPatch } from "../../ReactQuery/UseQuery";

const SearchPage = () => {
  const location = useLocation();
  const state = useMainStore((state) => state);
  const url = import.meta.env.VITE_SERVER_HOST;
  const theme = usePersistStore((state) => !state.theme);
  const navigate = useNavigate();

  const { data, mutate } = useQueryPatch(`/getdata/search`, "post");
  const memoizedMutate = useCallback(mutate, [location.state.value]);

  const requsetData = {
    body: { word: location.state.value },
  };

  useEffect(() => {
    memoizedMutate(requsetData);
  }, [location.state.value, memoizedMutate]);

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
      {data.data &&
        data.data.map((item: SearchDataItem) => {
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

const MyTableRow = ({ title, label }: SearchMyTableRowProps) => {
  const url = import.meta.env.VITE_SERVER_HOST;
  const theme = usePersistStore((state) => !state.theme);
  const matches2 = useMediaQuery("(max-width:1092px)");
  const matches3 = useMediaQuery("(max-width:554px)");
  const width = matches3 ? "35%" : matches2 ? "20%" : "10%";
  const bgColor = { backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white" };
  const textColor = { color: theme ? "lightgray" : "hsl(0, 0%, 20%)" };
  const { mutate } = useQueryPatch(`/getdata/tts`, "post");

  const onListen = async (text: string) => {
    const requestData = {
      body: { text },
      responseType: { responseType: "arraybuffer" },
    };
    mutate(requestData, {
      onSuccess: (data) => {
        const context = new AudioContext();
        context.decodeAudioData(data, (buffer) => {
          const source = context.createBufferSource();
          source.buffer = buffer;
          source.connect(context.destination);
          source.start(0);
        });
      },
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

const DataBody = ({ voca, voca_mean, exam, exam_mean }: SearchDataItem) => (
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
