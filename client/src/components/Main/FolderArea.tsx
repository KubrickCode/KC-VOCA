import { Suspense, useEffect } from "react";
import { usePersistStore } from "../../Store/GlobalStore";
import { useMainStore } from "../../Store/MainStore";
import LoadingOverlay from "../Loading";
import { StyledTreeItemRoot } from "../../Style/MUIStyle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import StarIcon from "@mui/icons-material/Star";
import FolderIcon from "@mui/icons-material/Folder";
import TreeView from "@mui/lab/TreeView";
import { Box, Typography } from "@mui/material";
import { FolderTreeProps, StyledTreeItemProps } from "../ComponentsType";
import { useQueryGet } from "../../ReactQuery/UseQuery";

const StyledTreeItem = (props: StyledTreeItemProps) => {
  const theme = usePersistStore((state) => !state.theme);
  const toggleInputStyle = {
    color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
  };

  const {
    bgColor,
    color = "inherit",
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
            ...toggleInputStyle,
          }}
        >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: "inherit",
              flexGrow: 1,
              paddingRight: "1px",
            }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
};

const FolderArea = () => {
  const state = useMainStore((state) => state);
  const { data } = useQueryGet(`/folders`, "getFolder");
  const theme = usePersistStore((state) => !state.theme);

  const toggleStyle = {
    backgroundColor: theme ? "hsl(0, 0%, 30%)" : "white",
    color: theme ? "lightgray" : "hsl(0, 0%, 20%)",
  };

  const folderDisplay = {
    display: !state.moveDialog.isOpen ? "block" : "none",
  };

  return (
    <Suspense fallback={<LoadingOverlay />}>
      <TreeView
        defaultExpanded={["1"]}
        defaultSelected={["0"]}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          ...toggleStyle,
        }}
      >
        <StyledTreeItem
          nodeId="0"
          labelText="최근 본 단어장"
          labelIcon={WatchLaterIcon}
          onClick={() => {
            state.setSelectedFolder("get_recent_file");
          }}
          sx={folderDisplay}
        />
        <StyledTreeItem
          nodeId="0-1"
          labelText="즐겨찾기 단어장"
          labelIcon={StarIcon}
          onClick={() => {
            state.setSelectedFolder("get_fav_file");
          }}
          sx={folderDisplay}
        />
        <FolderTree data={data?.folders} parent_id={0} />
      </TreeView>
    </Suspense>
  );
};

const FolderTree: React.FC<FolderTreeProps> = ({ data, parent_id }) => {
  const state = useMainStore((state) => state);

  const clickFolder = (id: number) => {
    if (!state.moveDialog.isOpen) {
      state.setSelectedFolder(String(id));
    } else {
      state.setMoveSelectedFolder(String(id));
    }
  };
  const tree = data
    ?.filter(
      (folder) =>
        folder.parent_id === parent_id || (parent_id === 0 && !folder.parent_id)
    )
    .map((folder) => {
      const children = (
        <FolderTree key={folder.id} data={data} parent_id={folder.id} />
      );

      return (
        <StyledTreeItem
          key={folder.id}
          nodeId={folder.id.toString()}
          labelText={folder.name}
          labelIcon={FolderIcon}
          onClick={() => {
            clickFolder(folder.id);
          }}
          children={children}
        />
      );
    });

  return <>{tree}</>;
};

export default FolderArea;
