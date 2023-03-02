import { useEffect, useState, useContext, memo } from "react";
import { MyContext } from "../../Context";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import { blue } from "@mui/material/colors";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { useHandleOpen } from "./../../CustomHook";

const FileDial = (props) => {
  const { state, dispatch } = useContext(MyContext);
  const [favObject, setFavObject] = useState({
    title: "",
    text: "",
    color: "",
  });
  const [shaObject, setShaObject] = useState({
    title: "",
    text: "",
  });

  const [open, , setOpen] = useHandleOpen(false, () => {
    setOpen(props.open);
  });

  useEffect(() => {
    setOpen(props.open);
    const favTitle =
      state.selectedFile.fav == 0 ? "즐겨찾기 등록" : "즐겨찾기 해제";
    const favText =
      state.selectedFile.fav == 0
        ? "단어장을 즐겨찾기에 등록하시겠습니까?"
        : "단어장을 즐겨찾기에서 해제하시겠습니까?";
    const favColor = state.selectedFile.fav == 0 ? "skyblue" : "yellow";
    setFavObject({
      ...favObject,
      title: favTitle,
      text: favText,
      color: favColor,
    });

    const shaTitle =
      state.selectedFile.sha == 0 ? "단어장 공유" : "단어장 공유 해제";
    const shaText =
      state.selectedFile.sha == 0
        ? "단어장을 다른 회원들과 공유하시겠습니까?"
        : "단어장을 공유 해제하시겠습니까?";
    setShaObject({
      ...shaObject,
      title: shaTitle,
      text: shaText,
    });
  }, [props.open]);

  const newfileOptions = [
    {
      icon: <AutoStoriesIcon />,
      name: "단어장 공부",
      click: () => {
        props.handleOpen();
        console.log("Hi");
      },
    },
    {
      icon: <ChangeCircleIcon />,
      name: "단어장명 변경",
      click: () => {
        props.handleOpen();
        dispatch({
          type: "setPostDialog",
          payload: {
            isOpen: true,
            title: "단어장 변경",
            label: "단어장명을 입력해 주세요",
            link: "http://localhost:3000/modify/rename_file",
          },
        });
      },
    },
    {
      icon: <DriveFileMoveIcon />,
      name: "단어장 이동",
      click: () => {
        props.handleOpen();
        console.log("Hi");
      },
    },
    {
      icon: <StarIcon sx={{ color: favObject.color }} />,
      name: favObject.title,
      click: () => {
        props.handleOpen();
        dispatch({
          type: "setCheckDialog",
          payload: {
            isOpen: true,
            title: favObject.title,
            text: favObject.text,
            link: "http://localhost:3000/modify/favorites",
          },
        });
      },
    },
    {
      icon: <ShareIcon />,
      name: shaObject.title,
      click: () => {
        props.handleOpen();
        dispatch({
          type: "setCheckDialog",
          payload: {
            isOpen: true,
            title: shaObject.title,
            text: shaObject.text,
            link: "http://localhost:3000/modify/shared",
          },
        });
      },
    },
    {
      icon: <DeleteIcon />,
      name: "단어장 삭제",
      click: () => {
        props.handleOpen();
        dispatch({
          type: "setCheckDialog",
          payload: {
            isOpen: true,
            title: "단어장 삭제",
            text: "정말 단어장을 삭제하시겠습니까?",
            link: "http://localhost:3000/delete/delete_file",
          },
        });
      },
    },
  ];

  return (
    <>
      <Dialog onClose={props.handleOpen} open={open}>
        <List sx={{ pt: 0 }}>
          {newfileOptions.map((option) => (
            <ListItem disableGutters key={option.name}>
              <ListItemButton onClick={option.click} key={option.name}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    {option.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={option.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
};

export default memo(FileDial);
