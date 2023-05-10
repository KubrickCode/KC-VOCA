import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { usePersistStore } from "../../Store/GlobalStore";
import { useMainStore } from "../../Store/MainStore";
import { StyledTableRow } from "../../Style/MUIStyle";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  Button,
  ButtonGroup,
  Stack,
  Typography,
  IconButton,
  Checkbox,
  useMediaQuery,
} from "@mui/material";
import {
  CheckedState,
  CountState,
  DataItem,
  MyHeaderProps,
  MyTableRowProps,
  handleDataProps,
} from "../ComponentsType";
import { useQueryGet, useQueryPatch } from "../../ReactQuery/UseQuery";

const VocaLoad = () => {
  const state = useMainStore((state) => state);
  const url = import.meta.env.VITE_SERVER_HOST;
  const theme = usePersistStore((state) => !state.theme);
  const viewMode = useLocation();
  const location = useParams();
  const navigate = useNavigate();
  const [share, setShare] = useState(false);
  const [view, setView] = useState({
    state: viewMode.state?.viewState ? false : true,
    toggleBtn: <AutoStoriesIcon />,
    text: "공부 모드",
  });

  const matches = useMediaQuery("(max-width:830px)");

  const { data } = useQueryGet(`/word-data/${location.id}`, "getData");

  useEffect(()=>{
    console.log(data)
  },[data])

  useEffect(() => {
    setShare(Boolean(data[2]));
    state.setSelectedFolder(String(data[1][0].folder_id));
    state.setSelectedFile({
      id: data[1][0].file_id,
    });
  }, []);

  useEffect(() => {
    view.state
      ? setView({ ...view, toggleBtn: <AutoStoriesIcon />, text: "공부 모드" })
      : setView({ ...view, toggleBtn: <MenuBookIcon />, text: "전체 보기" });
  }, [view.state]);

  const options = {
    modify: {
      title: "데이터 수정",
      link: `${url}/modify/modify_data`,
    },
    create: {
      title: "데이터 추가",
      link: `${url}/create/create_data`,
    },
    delete: {
      title: "데이터 삭제",
      link: `${url}/delete/delete_data`,
      text: "정말 데이터를 삭제하시겠습니까?",
    },
  };

  const handleData = ({
    type,
    data_id,
    voca,
    voca_mean,
    exam,
    exam_mean,
  }: handleDataProps) => {
    let typeData: { title: string; link: string; text?: string } = {
      title: "",
      link: "",
    };

    if (type === "modify") {
      typeData = options.modify;
    } else if (type === "create") {
      typeData = options.create;
    } else if (type === "delete") {
      typeData = options.delete;
    }

    const { title, link, text } = typeData;
    type === "delete"
      ? state["setCheckDialog"]({
          isOpen: true,
          title,
          text,
        })
      : state["setPostDialog"]({
          isOpen: true,
          title,
          label: "데이터 변경",
        });

    state.setSelectedData({
      id: data_id || null,
      voca: voca || "",
      voca_mean: voca_mean || "",
      exam: exam || "",
      exam_mean: exam_mean || "",
    });
  };

  const bgColor = { backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white" };
  const textColor = { color: theme ? "lightgray" : "hsl(0, 0%, 20%)" };

  return (
    <div>
      <MyHeader
        matches={matches}
        textColor={textColor}
        theme={theme}
        navigate={navigate}
        fileName={data[1][0].file_name}
        handleData={handleData}
        share={share}
        view={view}
        setView={setView}
        bgColor={bgColor}
      />
      {data &&
        data[0].map((item: DataItem, index: number) => (
          <DataBody
            data_id={item.data_id}
            voca={item.voca}
            voca_mean={item.voca_mean}
            exam={item.exam}
            exam_mean={item.exam_mean}
            index={index}
            key={item.data_id}
            handleData={handleData}
            view={view}
            bgColor={bgColor}
            theme={theme}
            textColor={textColor}
            setView={setView}
            url={url}
          />
        ))}
    </div>
  );
};

const MyHeader = ({
  matches,
  textColor,
  theme,
  navigate,
  fileName,
  handleData,
  share,
  view,
  setView,
}: MyHeaderProps) => {
  const state = useMainStore((state) => state);
  return (
    <Stack direction={matches ? "column" : "row"} spacing={2} mb={2} mt={10}>
      <Stack direction="row" spacing={2}>
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
        <Typography
          fontSize={20}
          sx={{
            ...textColor,
            pt: "5px",
          }}
        >
          단어장 : {fileName}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button
          variant={theme ? "contained" : "outlined"}
          endIcon={<AddIcon />}
          onClick={() => {
            handleData({
              type: "create",
              data_id: null,
              voca: "",
              voca_mean: "",
              exam: "",
              exam_mean: "",
            });
          }}
          sx={{ display: share ? "none" : "inlineBlock" }}
        >
          단어 추가
        </Button>
        <Button
          variant={theme ? "contained" : "outlined"}
          endIcon={view.toggleBtn}
          color="secondary"
          onClick={() => {
            if (setView) {
              setView({ ...view, state: !view.state });
            }
          }}
          sx={{ display: share ? "none" : "inlineBlock" }}
        >
          {view.text}
        </Button>
      </Stack>
    </Stack>
  );
};

const DataBody = ({
  data_id,
  voca,
  voca_mean,
  exam,
  exam_mean,
  index,
  handleData,
  view,
  bgColor,
  theme,
  textColor,
  share,
  url,
}: DataItem) => {
  const [checked, setChecked] = useState<CheckedState>({});
  const [count, setCount] = useState<CountState>({});

  const rows = [
    {
      title: "단어",
      label: voca,
      url: url,
      key: "voca" + index,
    },
    {
      title: "단어 뜻",
      label: voca_mean,
      url: url,
      key: "voca_mean" + index,
    },
    {
      title: "예문",
      label: exam,
      url: url,
      key: "exam" + index,
    },
    {
      title: "예문 뜻",
      label: exam_mean,
      url: url,
      key: "exam_mean" + index,
    },
  ];

  return (
    <TableContainer
      component={Paper}
      key={data_id}
      sx={{
        mb: "20px",
        overflow: "hidden",
      }}
    >
      <Table aria-label="caption table">
        <caption
          style={{
            ...bgColor,
            padding: "10px",
            display: share ? "none" : "inlineBlock",
          }}
        >
          <ButtonGroup
            variant={theme ? "contained" : "outlined"}
            aria-label="outlined button group"
          >
            <Button
              sx={{ fontSize: 16 }}
              color="success"
              onClick={() =>
                handleData({
                  type: "modify",
                  data_id,
                  voca,
                  voca_mean,
                  exam,
                  exam_mean,
                })
              }
            >
              수정
            </Button>
            <Button
              color="error"
              sx={{ fontSize: 16 }}
              onClick={() =>
                handleData({
                  type: "delete",
                  data_id,
                  voca,
                  voca_mean,
                  exam,
                  exam_mean,
                })
              }
            >
              삭제
            </Button>
          </ButtonGroup>
          <Checkbox
            sx={{
              ...textColor,
              padding: 0,
              display: view.state ? "none" : "inlineBlock",
              marginLeft: "10px",
            }}
            checked={
              Boolean(checked["voca" + index]) &&
              Boolean(checked["voca_mean" + index]) &&
              Boolean(checked["exam" + index]) &&
              Boolean(checked["exam_mean" + index])
            }
            icon={<VisibilityIcon />}
            checkedIcon={<VisibilityOffIcon />}
            onChange={(e) => {
              setChecked({
                ...checked,
                ["voca" + index]: e.target.checked,
                ["voca_mean" + index]: e.target.checked,
                ["exam" + index]: e.target.checked,
                ["exam_mean" + index]: e.target.checked,
              });
            }}
          />
        </caption>
        <TableBody>
          {rows.map((row) => (
            <MyTableRow
              title={row.title}
              label={row.label}
              checked={Boolean(checked[row.key])}
              onChange={(e) => {
                setChecked({
                  ...checked,
                  [row.key]: e.target.checked,
                });
              }}
              view={view}
              textColor={textColor}
              bgColor={bgColor}
              url={row.url}
              key={row.key}
            />
          ))}
          <StyledTableRow sx={{ display: view.state ? "none" : "inlineBlock" }}>
            <TableCell
              component="th"
              scope="row"
              sx={{
                ...textColor,
                ...bgColor,
                width: "7%",
                borderRight: 1,
                borderRightColor: "grey.300",
                fontSize: 17,
              }}
            >
              따라읽기
            </TableCell>
            <TableCell
              align="left"
              component="th"
              scope="row"
              sx={{
                ...textColor,
                ...bgColor,
              }}
            >
              <IconButton
                sx={{
                  ...textColor,
                  border: "1px solid lightgray",
                }}
                onClick={() => {
                  setCount({
                    ...count,
                    [index]: !count?.[index] ? 1 : count[index] + 1,
                  });
                }}
              >
                <PlusOneIcon />
              </IconButton>
              <Typography sx={{ display: "inline", margin: "10px" }}>
                반복 횟수 : {count[index] ? count[index] : 0}
              </Typography>
              <IconButton
                sx={{
                  border: "1px solid lightgray",
                  color: theme ? "lightgray" : undefined,
                }}
                onClick={() => {
                  setCount({ ...count, [index]: 0 });
                }}
              >
                <RestartAltIcon />
              </IconButton>
            </TableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MyTableRow = ({
  title,
  label,
  checked,
  onChange,
  view,
  textColor,
  bgColor,
  url,
}: MyTableRowProps) => {
  const matches2 = useMediaQuery("(max-width:1092px)");
  const matches3 = useMediaQuery("(max-width:554px)");
  const width = matches3 ? "35%" : matches2 ? "20%" : "10%";
  const { mutate } = useQueryPatch(`${url}/getdata/tts`, "post");

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
          ...textColor,
          ...bgColor,
          width: width,
          borderRight: 1,
          borderRightColor: "grey.300",
          fontSize: 17,
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
        <Stack direction="row">
          <Checkbox
            sx={{
              ...textColor,
              padding: 0,
              display: view.state ? "none" : "block",
              marginRight: "10px",
            }}
            checked={checked}
            icon={<VisibilityIcon />}
            checkedIcon={<VisibilityOffIcon />}
            onChange={onChange}
          />
          <Typography
            sx={{
              ...textColor,
              fontSize: 17,
              display: checked || view.state ? "block" : "none",
            }}
          >
            {label}
          </Typography>
        </Stack>
      </TableCell>
    </StyledTableRow>
  );
};

export default VocaLoad;
