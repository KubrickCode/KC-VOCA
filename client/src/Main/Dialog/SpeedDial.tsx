import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useMemo, useState } from "react";
import { useMainStore } from "../../State/MainStore";

const SpeedDialComp = () => {
  const state = useMainStore((state) => state);
  const url = import.meta.env.VITE_SERVER_HOST;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const speedDialActions = useMemo(() => {
    return [
      {
        icon: <NoteAddIcon />,
        name: "단어장 추가",
        dialog: () =>
          state.setPostDialog({
            isOpen: true,
            title: "단어장 추가",
            label: "단어장명을 입력해 주세요",
            link: `${url}/create/create_file`,
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
            link: `${url}/create/create_folder`,
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
            link: `${url}/delete/delete_folder`,
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
            link: `${url}/modify/rename_folder`,
            content: "basic",
          }),
      },
      {
        icon: <DriveFileMoveIcon />,
        name: "폴더 이동",
        dialog: () =>
          state.setMoveDialog({
            isOpen: true,
            link: `${url}/modify/move_folder`,
          }),
      },
    ];
  }, []);

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
