import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useContext, useMemo } from "react";
import { MyContext, ThemeContext } from "../../Context";
import { useHandleOpen } from "./../../CustomHook";

const SpeedDialComp = () => {
  const { state, dispatch } = useContext(MyContext);
  const { url } = useContext(ThemeContext);

  const [open, handleOpen, setOpen] = useHandleOpen(false, () => {
    setOpen(!open);
  });

  const speedDialActions = useMemo(() => {
    return [
      {
        icon: <NoteAddIcon />,
        name: "단어장 추가",
        dialog: () =>
          dispatch({
            type: "setPostDialog",
            payload: {
              isOpen: true,
              title: "단어장 추가",
              label: "단어장명을 입력해 주세요",
              link: `${url}/create/create_file`,
              content: "basic",
            },
          }),
      },
      {
        icon: <CreateNewFolderIcon />,
        name: "폴더 추가",
        dialog: () =>
          dispatch({
            type: "setPostDialog",
            payload: {
              isOpen: true,
              title: "폴더 추가",
              label: "폴더명을 입력해 주세요",
              link: `${url}/create/create_folder`,
              content: "basic",
            },
          }),
      },
      {
        icon: <DeleteIcon />,
        name: "폴더 삭제",
        dialog: () =>
          dispatch({
            type: "setCheckDialog",
            payload: {
              isOpen: true,
              title: "폴더 삭제",
              text: "정말 폴더를 삭제하시겠습니까?",
              link: `${url}/delete/delete_folder`,
            },
          }),
      },
      {
        icon: <ChangeCircleIcon />,
        name: "폴더명 변경",
        dialog: () =>
          dispatch({
            type: "setPostDialog",
            payload: {
              isOpen: true,
              title: "폴더명 변경",
              label: "폴더명을 입력해 주세요",
              link: `${url}/modify/rename_folder`,
              content: "basic",
            },
          }),
      },
      {
        icon: <DriveFileMoveIcon />,
        name: "폴더 이동",
        dialog: () =>
          dispatch({
            type: "setMoveDialog",
            payload: {
              isOpen: true,
              link: `${url}/modify/move_folder`,
            },
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
