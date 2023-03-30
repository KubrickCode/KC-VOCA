import { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
  const [checked, setChecked] = useState<CheckedState>({});
  const [count, setCount] = useState<CountState>({});
  const [view, setView] = useState({
    state: viewMode.state?.viewState ? false : true,
    toggleBtn: <AutoStoriesIcon />,
    text: "공부 모드",
  });
  const [share, setShare] = useState(false);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const matches = useMediaQuery("(max-width:830px)");
  const matches2 = useMediaQuery("(max-width:1092px)");
  const matches3 = useMediaQuery("(max-width:554px)");

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
      setShare(Boolean(data[3]));
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

  const handleData = (
    type: string,
    id: number | null,
    voca: string,
    voca_mean: string,
    exam: string,
    exam_mean: string
  ) => {
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
        id: id || null,
        voca: voca || "",
        voca_mean: voca_mean || "",
        exam: exam || "",
        exam_mean: exam_mean || "",
      },
    });
  };

  const bgColor = { backgroundColor: isDark ? "hsl(0, 0%, 30%)" : "inherit" };
  const textColor = { color: isDark ? "lightgray" : "inherit" };

  const MyHeader = () => {
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
              handleData("create", null, "", "", "", "");
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
              setView({ ...view, state: !view.state });
            }}
            sx={{ display: share ? "none" : "inlineBlock" }}
          >
            {view.text}
          </Button>
        </Stack>
      </Stack>
    );
  };

  interface MyTableRowProps {
    title: string;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const MyTableRow = ({ title, label, checked, onChange }: MyTableRowProps) => {
    const width = matches3 ? "35%" : matches2 ? "20%" : "10%";
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

  interface dataItem {
    data_id: number;
    voca: string;
    voca_mean: string;
    exam: string;
    exam_mean: string;
  }

  return (
    <div>
      <MyHeader />
      {data.map((item: dataItem, index) => {
        return (
          <TableContainer
            component={Paper}
            key={item.data_id}
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
                      handleData(
                        "modify",
                        item.data_id,
                        item.voca,
                        item.voca_mean,
                        item.exam,
                        item.exam_mean
                      )
                    }
                  >
                    수정
                  </Button>
                  <Button
                    color="error"
                    sx={{ fontSize: 16 }}
                    onClick={() =>
                      handleData(
                        "delete",
                        item.data_id,
                        item.voca,
                        item.voca_mean,
                        item.exam,
                        item.exam_mean
                      )
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
                <MyTableRow
                  title="단어"
                  label={item.voca}
                  checked={Boolean(checked["voca" + index])}
                  onChange={(e) => {
                    setChecked({
                      ...checked,
                      ["voca" + index]: e.target.checked,
                    });
                  }}
                />
                <MyTableRow
                  title="단어 뜻"
                  label={item.voca_mean}
                  checked={Boolean(checked["voca_mean" + index])}
                  onChange={(e) => {
                    setChecked({
                      ...checked,
                      ["voca_mean" + index]: e.target.checked,
                    });
                  }}
                />
                <MyTableRow
                  title="예문"
                  label={item.exam}
                  checked={Boolean(checked["exam" + index])}
                  onChange={(e) => {
                    setChecked({
                      ...checked,
                      ["exam" + index]: e.target.checked,
                    });
                  }}
                />
                <MyTableRow
                  title="예문 뜻"
                  label={item.exam_mean}
                  checked={Boolean(checked["exam_mean" + index])}
                  onChange={(e) => {
                    setChecked({
                      ...checked,
                      ["exam_mean" + index]: e.target.checked,
                    });
                  }}
                />
                <StyledTableRow
                  sx={{ display: view.state ? "none" : "inlineBlock" }}
                >
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
      })}
    </div>
  );
};

export default VocaLoad;
