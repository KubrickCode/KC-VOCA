import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useMainStore } from "../../State/MainStore";
import { usePersistStore } from "../../State/GlobalStore";
import { blue } from "@mui/material/colors";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Dialog,
} from "@mui/material";
import { DialBodyProps, FormDialogProps } from "../../ComponentsType";

const FileDial = ({ open, setOpen }: FormDialogProps) => {
  const url = import.meta.env.VITE_SERVER_HOST;
  const navigate = useNavigate();
  const [favObject, setFavObject] = useState({
    title: "",
    text: "",
    color: "",
  });
  const [shaObject, setShaObject] = useState({
    title: "",
    text: "",
  });

  const state = useMainStore((state) => state);
  const theme = usePersistStore((state) => !state.theme);

  const toggleStyle = {
    backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white",
    color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
  };

  useEffect(() => {
    setOpen(open);

    setFavObject({
      ...favObject,
      title: state.selectedFile.fav === 0 ? "즐겨찾기 등록" : "즐겨찾기 해제",
      text:
        state.selectedFile.fav === 0
          ? "단어장을 즐겨찾기에 등록하시겠습니까?"
          : "단어장을 즐겨찾기에서 해제하시겠습니까?",
      color: state.selectedFile.fav === 0 ? "skyblue" : "yellow",
    });

    setShaObject({
      ...shaObject,
      title: state.selectedFile.sha === 0 ? "단어장 공유" : "단어장 공유 해제",
      text:
        state.selectedFile.sha === 0
          ? "단어장을 다른 회원들과 공유하시겠습니까?"
          : "단어장을 공유 해제하시겠습니까?",
    });
  }, [open]);

  const newfileOptions = [
    {
      icon: <AutoStoriesIcon />,
      name: "단어장 공부",
      click: () => {
        navigate(`/load/${state.selectedFile.id}`, {
          state: { viewState: true },
        });
      },
    },
    {
      icon: <ChangeCircleIcon />,
      name: "단어장명 변경",
      click: () => {
        setOpen(!open);
        state.setPostDialog({
          isOpen: true,
          title: "단어장 변경",
          label: "단어장명을 입력해 주세요",
          link: `${url}/modify/rename_file`,
          content: "basic",
        });
      },
    },
    {
      icon: <DriveFileMoveIcon />,
      name: "단어장 이동",
      click: () => {
        setOpen(!open);
        state.setMoveDialog({
          isOpen: true,
          link: `${url}/modify/move_file`,
        });
      },
    },
    {
      icon: <StarIcon sx={{ color: favObject.color }} />,
      name: favObject.title,
      click: () => {
        setOpen(!open);
        state.setCheckDialog({
          isOpen: true,
          title: favObject.title,
          text: favObject.text,
          link: `${url}/modify/favorites`,
        });
      },
    },
    {
      icon: <ShareIcon />,
      name: shaObject.title,
      click: () => {
        setOpen(!open);
        state.setCheckDialog({
          isOpen: true,
          title: shaObject.title,
          text: shaObject.text,
          link: `${url}/modify/shared`,
        });
      },
    },
    {
      icon: <DeleteIcon />,
      name: "단어장 삭제",
      click: () => {
        setOpen(!open);
        state.setCheckDialog({
          isOpen: true,
          title: "단어장 삭제",
          text: "정말 단어장을 삭제하시겠습니까?",
          link: `${url}/delete/delete_file`,
        });
      },
    },
  ];

  return (
    <>
      <Dialog onClose={() => setOpen(!open)} open={open}>
        <List sx={{ pt: 0, ...toggleStyle }}>
          {newfileOptions.map((option) => (
            <DialBody
              key={option.name}
              name={option.name}
              icon={option.icon}
              click={option.click}
            />
          ))}
        </List>
      </Dialog>
    </>
  );
};

const DialBody = ({ name, click, icon }: DialBodyProps) => (
  <ListItem disableGutters>
    <ListItemButton onClick={click}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>{icon}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} />
    </ListItemButton>
  </ListItem>
);

export default memo(FileDial);
