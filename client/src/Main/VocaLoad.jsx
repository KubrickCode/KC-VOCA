import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import { MyContext, ThemeContext } from "./../Context";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Checkbox from "@mui/material/Checkbox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import { StyledTableRow } from "../Style/MUIStyle";

const VocaLoad = () => {
  const { state, dispatch } = useContext(MyContext);
  const { theme } = useContext(ThemeContext);
  const viewMode = useLocation();
  const location = useParams();
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [checked, setChecked] = useState({});
  const [count, setCount] = useState({});
  const [view, setView] = useState({
    state: viewMode.state?.viewState ? false : true,
    toggleBtn: <AutoStoriesIcon />,
    text: "공부 모드",
  });
  const [share, setShare] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    axios
      .post(
        "http://localhost:3000/getdata/get_data",
        {
          file_id: location.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setData(res.data[0]);
        res.data[2] ? setShare(true) : setShare(false);
        setFileName(res.data[1][0].file_name);
        dispatch({
          type: "setSelectedFolder",
          payload: String(res.data[1][0].folder_id),
        });
        dispatch({
          type: "setSelectedFile",
          payload: {
            id: res.data[1][0].file_id,
          },
        });
      });
  }, [state.snackBar.dataState]);

  useEffect(() => {
    view.state
      ? setView({ ...view, toggleBtn: <AutoStoriesIcon />, text: "공부 모드" })
      : setView({ ...view, toggleBtn: <MenuBookIcon />, text: "전체 보기" });
  }, [view.state]);

  const options = {
    modify: {
      title: "데이터 수정",
      link: "http://localhost:3000/modify/modify_data",
    },
    create: {
      title: "데이터 추가",
      link: "http://localhost:3000/create/create_data",
    },
    delete: {
      title: "데이터 삭제",
      link: "http://localhost:3000/delete/delete_data",
      content: "data",
      text: "정말 데이터를 삭제하시겠습니까?",
    },
  };

  const handleData = (type, id, voca, voca_mean, exam, exam_mean) => {
    const { title, link, content, text } = options[type];

    dispatch({
      type: type === "delete" ? "setCheckDialog" : "setPostDialog",
      payload: {
        isOpen: true,
        title,
        link,
        content,
        text,
      },
    });

    dispatch({
      type: "setSelectedData",
      payload: {
        id: id || "",
        voca: voca || "",
        voca_mean: voca_mean || "",
        exam: exam || "",
        exam_mean: exam_mean || "",
      },
    });
  };

  const MyHeader = () => {
    return (
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
          fontSize={20}
          sx={{
            pt: "5px",
            color: isDark ? "lightgray" : undefined,
          }}
        >
          단어장 : {fileName}
        </Typography>
        <Button
          variant={isDark ? "contained" : "outlined"}
          endIcon={<AddIcon />}
          onClick={() => {
            handleData("create");
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
    );
  };

  const MyTableRow = ({ width, title, label, checked, onChange }) => {
    return (
      <StyledTableRow>
        <TableCell
          component="th"
          scope="row"
          sx={{
            width: width,
            borderRight: 1,
            borderRightColor: "grey.300",
            fontSize: 17,
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
          <Stack direction="row">
            <Checkbox
              sx={{
                padding: 0,
                display: view.state ? "none" : "block",
                marginRight: "10px",
                color: isDark ? "lightgray" : undefined,
              }}
              checked={checked}
              icon={<VisibilityIcon />}
              checkedIcon={<VisibilityOffIcon />}
              onChange={onChange}
            />
            <Typography
              sx={{
                fontSize: 17,
                display: checked || view.state ? "block" : "none",
                color: isDark ? "lightgray" : undefined,
              }}
            >
              {label}
            </Typography>
          </Stack>
        </TableCell>
      </StyledTableRow>
    );
  };

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

  return (
    <div>
      <MyHeader />
      {data.map((item, index) => {
        return (
          <TableContainer
            component={Paper}
            key={item.data_id}
            sx={{ mb: "20px" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
              <caption
                style={{
                  padding: "10px",
                  display: share ? "none" : "inlineBlock",
                  backgroundColor: isDark ? "hsl(0, 0%, 30%)" : undefined,
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
                    padding: 0,
                    display: view.state ? "none" : "inlineBlock",
                    marginLeft: "10px",
                    color: isDark ? "lightgray" : undefined,
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
                  width="10%"
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
                  width="7%"
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
                  width="7%"
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
                  width="7%"
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
                      width: "7%",
                      borderRight: 1,
                      borderRightColor: "grey.300",
                      fontSize: 17,
                      backgroundColor: isDark ? "hsl(0, 0%, 30%)" : undefined,
                      color: isDark ? "lightgray" : undefined,
                    }}
                  >
                    따라읽기
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      backgroundColor: isDark ? "hsl(0, 0%, 30%)" : undefined,
                      color: isDark ? "lightgray" : undefined,
                    }}
                  >
                    <IconButton
                      sx={{
                        border: "1px solid lightgray",
                        color: isDark ? "lightgray" : undefined,
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
