import { useState } from "react";
import { useMainStore } from "../../../Store/MainStore";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";

const SpeedDialComp = () => {
  const state = useMainStore((state) => state);
  const url = import.meta.env.VITE_SERVER_HOST;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const speedDialActions = [
    {
      icon: <NoteAddIcon />,
      name: "단어장 추가",
      dialog: () =>
        state.setPostDialog({
          isOpen: true,
          title: "단어장 추가",
          label: "단어장명을 입력해 주세요",
          content: "basic",
        }),
    },
    {
      icon: <CreateNewFolderIcon />,
      name: "폴더 추가",
      dialog: () =>
        state.setPostDialog({
          isOpen: true,
          title: "폴더 추가",
          label: "폴더명을 입력해 주세요",
          content: "basic",
        }),
    },
    {
      icon: <DeleteIcon />,
      name: "폴더 삭제",
      dialog: () =>
        state.setCheckDialog({
          isOpen: true,
          title: "폴더 삭제",
          text: "정말 폴더를 삭제하시겠습니까?",
        }),
    },
    {
      icon: <ChangeCircleIcon />,
      name: "폴더명 변경",
      dialog: () =>
        state.setPostDialog({
          isOpen: true,
          title: "폴더명 변경",
          label: "폴더명을 입력해 주세요",
          content: "basic",
        }),
    },
    {
      icon: <DriveFileMoveIcon />,
      name: "폴더 이동",
      dialog: () =>
        state.setMoveDialog({
          isOpen: true,
          type: "folder",
        }),
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial example"
        icon={<SpeedDialIcon />}
        onClose={handleOpen}
        onOpen={handleOpen}
        open={open}
        direction={"up"}
        sx={{
          display: Number(state.selectedFolder) ? "inlineBlock" : "none",
        }}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            sx={{ whiteSpace: "nowrap" }}
            onClick={action.dialog}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default SpeedDialComp;
