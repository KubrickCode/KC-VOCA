import { useState, useEffect, forwardRef, ReactElement, Ref } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { usePersistStore } from "../../Store/GlobalStore";
import { useMainStore } from "../../Store/MainStore";
import { StyledTableRow } from "../../Style/MUIStyle";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import HomeIcon from "@mui/icons-material/Home";
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
  Slide,
  Dialog,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  CheckedState,
  CompleteDialog,
  CountState,
  DataItem,
  MyHeaderProps,
  MyTableRowProps,
  handleDataProps,
} from "../ComponentsType";
import { useQueryGet, useQueryPatch } from "../../ReactQuery/UseQuery";
import { useQueryClient } from "react-query";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";

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

  const { data: loadData } = useQueryGet(
    `/word-data/${location.id}`,
    "getData"
  );
  const { mutate } = useQueryPatch("/word-data/complete", "patch");
  const queryClient = useQueryClient();

  const [data, setData] = useState([]);
  const [completeData, setCompleteData] = useState([]);

  useEffect(() => {
    setData(loadData?.wordData?.filter((item: any) => item.is_complete === 0));
    setCompleteData(
      loadData?.wordData?.filter((item: any) => item.is_complete === 1)
    );
  }, [loadData]);

  useEffect(() => {
    if (viewMode.pathname.includes("/shared/")) {
      setShare(true);
    } else {
      setShare(false);
    }
  }, [viewMode]);

  useEffect(() => {
    view.state
      ? setView({ ...view, toggleBtn: <AutoStoriesIcon />, text: "공부 모드" })
      : setView({ ...view, toggleBtn: <MenuBookIcon />, text: "전체 보기" });
  }, [view.state]);

  const options = {
    modify: {
      title: "데이터 수정",
    },
    create: {
      title: "데이터 추가",
    },
    delete: {
      title: "데이터 삭제",
      text: "정말 데이터를 삭제하시겠습니까?",
    },
  };

  const handleData = ({
    type,
    id,
    word,
    meaning,
    example_sentence,
    example_sentence_meaning,
  }: handleDataProps) => {
    let typeData: { title: string; text?: string } = {
      title: "",
    };

    if (type === "modify") {
      typeData = options.modify;
    } else if (type === "create") {
      typeData = options.create;
    } else if (type === "delete") {
      typeData = options.delete;
    }

    const { title, text } = typeData;
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
          content: "data",
        });

    state.setSelectedFile({
      id: Number(location.id),
    });

    state.setSelectedData({
      id: id || null,
      word: word || "",
      meaning: meaning || "",
      example_sentence: example_sentence || "",
      example_sentence_meaning: example_sentence_meaning || "",
    });
  };

  const onComplete = (id: number, is_complete: number) => {
    mutate(
      {
        body: {
          id,
          is_complete,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("getData");
        },
      }
    );
  };

  const bgColor = { backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white" };
  const textColor = { color: theme ? "lightgray" : "hsl(0, 0%, 20%)" };

  const [openComplete, setOpenComplete] = useState(false);

  return (
    <div>
      <MyHeader
        matches={matches}
        textColor={textColor}
        theme={theme}
        navigate={navigate}
        fileName={loadData?.name}
        handleData={handleData}
        share={share}
        view={view}
        setView={setView}
        bgColor={bgColor}
        setOpenComplete={setOpenComplete}
      />
      {data?.length > 0 ? (
        data?.map((item: DataItem, index: number) => (
          <DataBody
            id={item.id}
            word={item.word}
            meaning={item.meaning}
            example_sentence={item.example_sentence}
            example_sentence_meaning={item.example_sentence_meaning}
            index={index}
            key={item.id}
            share={share}
            handleData={handleData}
            view={view}
            bgColor={bgColor}
            theme={theme}
            textColor={textColor}
            setView={setView}
            url={url}
            is_complete={item.is_complete}
            onComplete={onComplete}
          />
        ))
      ) : (
        <Typography>아직 추가된 단어 데이터가 없습니다</Typography>
      )}
      <FullScreenDialog
        openComplete={openComplete}
        setOpenComplete={setOpenComplete}
        completeData={completeData}
        share={share}
        handleData={handleData}
        view={view}
        bgColor={bgColor}
        theme={theme}
        textColor={textColor}
        setView={setView}
        url={url}
        onComplete={onComplete}
      />
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
  setOpenComplete,
}: MyHeaderProps) => {
  const state = useMainStore((state) => state);
  const queryClient = useQueryClient();

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
            queryClient.invalidateQueries("getWords");
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
          onClick={() => {
            handleData({
              type: "create",
              id: null,
              word: "",
              meaning: "",
              example_sentence: "",
              example_sentence_meaning: "",
            });
          }}
          sx={{ display: share ? "none" : "inlineBlock" }}
        >
          단어 추가
        </Button>
        <Button
          variant={theme ? "contained" : "outlined"}
          color="primary"
          onClick={() => {
            if (setView) {
              setView({ ...view, state: !view.state });
            }
          }}
          sx={{ display: share ? "none" : "inlineBlock" }}
        >
          {view.text}
        </Button>
        <Button
          variant={theme ? "contained" : "outlined"}
          color="primary"
          onClick={() => setOpenComplete(true)}
          sx={{ display: share ? "none" : "inlineBlock" }}
        >
          완료 목록
        </Button>
      </Stack>
    </Stack>
  );
};

const DataBody = ({
  id,
  word,
  meaning,
  example_sentence,
  example_sentence_meaning,
  index,
  handleData,
  view,
  bgColor,
  theme,
  textColor,
  share,
  url,
  onComplete,
  is_complete,
}: DataItem) => {
  const [checked, setChecked] = useState<CheckedState>({});
  const [count, setCount] = useState<CountState>({});

  const rows = [
    {
      title: "단어",
      label: word,
      url: url,
      key: "word" + index,
    },
    {
      title: "단어 뜻",
      label: meaning,
      url: url,
      key: "meaning" + index,
    },
    {
      title: "예문",
      label: example_sentence,
      url: url,
      key: "example_sentence" + index,
    },
    {
      title: "예문 뜻",
      label: example_sentence_meaning,
      url: url,
      key: "example_sentence_meaning" + index,
    },
  ];

  return (
    <TableContainer
      component={Paper}
      key={id}
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
              color="primary"
              onClick={() =>
                handleData({
                  type: "modify",
                  id,
                  word,
                  meaning,
                  example_sentence,
                  example_sentence_meaning,
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
                  id,
                  word,
                  meaning,
                  example_sentence,
                  example_sentence_meaning,
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
              Boolean(checked["word" + index]) &&
              Boolean(checked["meaning" + index]) &&
              Boolean(checked["example_sentence" + index]) &&
              Boolean(checked["example_sentence_meaning" + index])
            }
            icon={<VisibilityIcon />}
            checkedIcon={<VisibilityOffIcon />}
            onChange={(e) => {
              setChecked({
                ...checked,
                ["word" + index]: e.target.checked,
                ["meaning" + index]: e.target.checked,
                ["example_sentence" + index]: e.target.checked,
                ["example_sentence_meaning" + index]: e.target.checked,
              });
            }}
          />
          <Button
            variant={theme ? "contained" : "outlined"}
            sx={{ fontSize: 16, float: "right" }}
            color="primary"
            onClick={() => onComplete(id!, is_complete)}
          >
            {is_complete === 0 ? "학습 완료" : "완료 취소"}
          </Button>
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
  const { mutate } = useQueryPatch(`/word-data/tts`, "post");

  const onListen = async (text: string) => {
    const requestData = {
      body: { text },
      config: { responseType: "arraybuffer" as const },
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

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = ({
  openComplete,
  setOpenComplete,
  completeData,
  share,
  handleData,
  view,
  bgColor,
  theme,
  textColor,
  setView,
  url,
  onComplete,
}: CompleteDialog) => {
  return (
    <div>
      <Dialog
        fullScreen
        open={openComplete}
        onClose={() => setOpenComplete(!open)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "black" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenComplete(!open)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1, mt: 1 }}
              variant="h6"
              component="div"
            >
              학습 완료 목록
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ padding: "10px" }}>
          {completeData?.length > 0 ? (
            completeData?.map((item: DataItem, index: number) => (
              <DataBody
                id={item.id}
                word={item.word}
                meaning={item.meaning}
                example_sentence={item.example_sentence}
                example_sentence_meaning={item.example_sentence_meaning}
                index={index}
                key={item.id}
                share={share}
                handleData={handleData}
                view={view}
                bgColor={bgColor}
                theme={theme}
                textColor={textColor}
                setView={setView}
                url={url}
                is_complete={item.is_complete}
                onComplete={onComplete}
              />
            ))
          ) : (
            <Typography>아직 추가된 단어 데이터가 없습니다</Typography>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default VocaLoad;
