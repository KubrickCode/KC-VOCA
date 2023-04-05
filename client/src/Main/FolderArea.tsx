import { useEffect, useState, useCallback } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import TreeView from "@mui/lab/TreeView";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import StarIcon from "@mui/icons-material/Star";
import { StyledTreeItemRoot } from "../Style/MUIStyle";
import { TreeItemProps } from "@mui/lab/TreeItem";
import { usePersistStore } from "../State/GlobalStore";
import { useMainStore } from "../State/MainStore";
import { useGetAxios } from "../UseQuery";

interface StyledTreeItemProps extends Omit<TreeItemProps, "onClick"> {
  bgColor?: string;
  color?: string;
  key?: number;
  nodeId: string;
  labelInfo?: string;
  labelText: string;
  labelIcon: React.ElementType;
  onClick: React.MouseEventHandler<HTMLLIElement> &
    ((folder_id: number) => void);
  children?: React.ReactNode;
  sx?: object;
}

const StyledTreeItem = (props: StyledTreeItemProps) => {
  const theme = usePersistStore((state) => !state.theme);
  const moveDialog = useMainStore((state) => state.moveDialog);

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
            color:
              theme && moveDialog.isOpen === false
                ? "lightgray"
                : "hsl(0, 0%, 20%)",
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

type Folder = {
  folder_id: number;
  folder_name: string;
  parent_id: number;
};

type FolderTreeProps = {
  data: Folder[];
  parentId: number;
};

const FolderArea = () => {
  const state = useMainStore((state) => state);
  const url = import.meta.env.VITE_SERVER_HOST;
  const { data, refetch } = useGetAxios(`${url}/getdata/get_folder`);

  useEffect(() => {
    refetch();
  }, [state.folderState]);

  const folderDisplay = {
    display: !state.moveDialog.isOpen ? "block" : "none",
  };

  return (
    <TreeView
      defaultExpanded={["1"]}
      defaultSelected={["0"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{
        flexGrow: 1,
        overflow: "hidden",
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
      <FolderTree data={data} parentId={0} />
    </TreeView>
  );
};

const FolderTree: React.FC<FolderTreeProps> = ({ data, parentId }) => {
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
        folder.parent_id === parentId || (parentId === 0 && !folder.parent_id)
    )
    .map((folder) => {
      const children = (
        <FolderTree
          key={folder.folder_id}
          data={data}
          parentId={folder.folder_id}
        />
      );

      return (
        <StyledTreeItem
          key={folder.folder_id}
          nodeId={folder.folder_id.toString()}
          labelText={folder.folder_name}
          labelIcon={FolderIcon}
          onClick={() => {
            clickFolder(folder.folder_id);
          }}
          children={children}
        />
      );
    });

  return <>{tree}</>;
};

export default FolderArea;
