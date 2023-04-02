import { useState, useEffect, useContext, useMemo } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { MainContext, GlobalContext } from "../Context";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Checkbox from "@mui/material/Checkbox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import { StyledTableRow } from "../Style/MUIStyle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAxios } from "../Module";
import { ActionType } from "../Reducer";

interface DataProps {
  data_id: number | null;
  voca: string;
  voca_mean: string;
  exam: string;
  exam_mean: string;
}
interface DataEnv {
  textColor: { color: string };
  bgColor: { backgroundColor: string };
  isDark?: boolean;
  view: ViewObject;
  setView?: (viewObj: ViewObject) => void;
  share?: boolean;
  url?: string;
  setLoad?: (isloading: boolean) => void;
}
interface ViewObject {
  state: boolean;
  toggleBtn: JSX.Element;
  text: string;
}
interface handleDataProps extends DataProps {
  type: string;
}

interface dataItem extends DataProps, DataEnv {
  index: number;
  handleData: ({}: handleDataProps) => void;
  view: ViewObject;
}

interface MyHeaderProps extends DataEnv {
  matches: boolean;
  navigate: NavigateFunction;
  dispatch: React.Dispatch<ActionType>;
  fileName: string;
  handleData: ({}: handleDataProps) => void;
}

interface MyTableRowProps extends DataEnv {
  title: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type CheckedState = {
  [key: string]: boolean;
};

type CountState = {
  [key: string]: number;
};

const VocaLoad = () => {
  const { state, dispatch } = useContext(MainContext);
  const { theme, url, setLoad } = useContext(GlobalContext);
  const viewMode = useLocation();
  const location = useParams();
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [view, setView] = useState({
    state: viewMode.state?.viewState ? false : true,
    toggleBtn: <AutoStoriesIcon />,
    text: "공부 모드",
  });
  const [share, setShare] = useState(false);
  const isDark: boolean = theme === "dark";
  const navigate = useNavigate();

  const matches = useMediaQuery("(max-width:830px)");

  useEffect(() => {
    const fetchData = async () => {
      const data = await useAxios(
        "post",
        `${url}/getdata/get_data`,
        {
          file_id: location.id,
        },
        setLoad
      );
      setData(data[0]);
      setShare(Boolean(data[2]));
      setFileName(data[1][0].file_name);
      dispatch({
        type: "setSelectedFolder",
        payload: String(data[1][0].folder_id),
      });
      dispatch({
        type: "setSelectedFile",
        payload: {
          id: data[1][0].file_id,
        },
      });
    };
    fetchData();
  }, [state.dataState]);

  useEffect(() => {
    view.state
      ? setView({ ...view, toggleBtn: <AutoStoriesIcon />, text: "공부 모드" })
      : setView({ ...view, toggleBtn: <MenuBookIcon />, text: "전체 보기" });
  }, [view.state]);

  const options = useMemo(
    () => ({
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
    }),
    []
  );

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

    dispatch({
      type: type === "delete" ? "setCheckDialog" : "setPostDialog",
      payload: {
        isOpen: true,
        title,
        link,
        content: "data",
        text,
      },
    });

    dispatch({
      type: "setSelectedData",
      payload: {
        id: data_id || null,
        voca: voca || "",
        voca_mean: voca_mean || "",
        exam: exam || "",
        exam_mean: exam_mean || "",
      },
    });
  };

  const bgColor = { backgroundColor: isDark ? "hsl(0, 0%, 30%)" : "white" };
  const textColor = { color: isDark ? "lightgray" : "hsl(0, 0%, 20%)" };

  return (
    <div>
      <MyHeader
        matches={matches}
        textColor={textColor}
        isDark={isDark}
        navigate={navigate}
        dispatch={dispatch}
        fileName={fileName}
        handleData={handleData}
        share={share}
        view={view}
        setView={setView}
        bgColor={bgColor}
      />
      {data.map((item: dataItem, index) => (
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
          isDark={isDark}
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
  isDark,
  navigate,
  dispatch,
  fileName,
  handleData,
  share,
  view,
  setView,
}: MyHeaderProps) => {
  return (
    <Stack direction={matches ? "column" : "row"} spacing={2} mb={2} mt={10}>
      <Stack direction="row" spacing={2}>
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
          variant={isDark ? "contained" : "outlined"}
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
          variant={isDark ? "contained" : "outlined"}
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
  isDark,
  textColor,
  share,
  url,
  setLoad,
}: dataItem) => {
  const [checked, setChecked] = useState<CheckedState>({});
  const [count, setCount] = useState<CountState>({});

  const rows = [
    {
      title: "단어",
      label: voca,
      url: url,
      setLoad: setLoad,
      key: "voca" + index,
    },
    {
      title: "단어 뜻",
      label: voca_mean,
      url: url,
      setLoad: setLoad,
      key: "voca_mean" + index,
    },
    {
      title: "예문",
      label: exam,
      url: url,
      setLoad: setLoad,
      key: "exam" + index,
    },
    {
      title: "예문 뜻",
      label: exam_mean,
      url: url,
      setLoad: setLoad,
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
            variant={isDark ? "contained" : "outlined"}
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
              setLoad={row.setLoad}
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
                  color: isDark ? "lightgray" : undefined,
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
  setLoad,
}: MyTableRowProps) => {
  const matches2 = useMediaQuery("(max-width:1092px)");
  const matches3 = useMediaQuery("(max-width:554px)");
  const width = matches3 ? "35%" : matches2 ? "20%" : "10%";

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
