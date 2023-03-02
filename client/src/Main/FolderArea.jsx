import { useEffect, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import FolderIcon from "@mui/icons-material/Folder";
import TreeView from "@mui/lab/TreeView";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { MyContext } from "../Context";
import { StyledTreeItemRoot } from "../Style/MUIStyle";

const StyledTreeItem = (props) => {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
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

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const FolderArea = () => {
  const [folderData, setFolderData] = useState([]);

  const { state, dispatch } = useContext(MyContext);

  useEffect(() => {
    axios
      .get("http://localhost:3000/getdata/get_folder", {
        withCredentials: true,
      })
      .then((res) => {
        setFolderData(res.data);
      });
  }, [state.snackBar.folderState]);

  const buildTree = useCallback(
    (folderData, parent_id) => {
      let tree = [];
      const clickFolder = (id) => {
        if (!state.moveDialog.isOpen) {
          dispatch({
            type: "setSelectedFolder",
            payload: String(id),
          });
        } else {
          dispatch({
            type: "setMoveSelectedFolder",
            payload: String(id),
          });
        }
      };
      folderData.forEach((folder) => {
        if (
          folder.parent_id === parent_id ||
          (parent_id === "0" && !folder.parent_id)
        ) {
          const children = buildTree(folderData, folder.folder_id);
          const node = (
            <StyledTreeItem
              key={folder.folder_id}
              nodeId={folder.folder_id.toString()}
              labelText={folder.folder_name}
              labelIcon={FolderIcon}
              onClick={() => {
                clickFolder(folder.folder_id);
              }}
            >
              {children}
            </StyledTreeItem>
          );
          tree.push(node);
        }
      });
      return tree;
    },
    [folderData]
  );

  return (
    <TreeView
      defaultExpanded={["1"]}
      defaultSelected={["0"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      <StyledTreeItem
        nodeId="0"
        labelText="최근 본 단어장"
        labelIcon={WatchLaterIcon}
        onClick={() => {
          dispatch({ type: "setSelectedFolder", payload: "get_recent_file" });
        }}
        sx={{ display: !state.moveDialog.isOpen ? "block" : "none" }}
      />
      <StyledTreeItem
        nodeId="0-1"
        labelText="즐겨찾기 단어장"
        labelIcon={StarIcon}
        onClick={() => {
          dispatch({ type: "setSelectedFolder", payload: "get_fav_file" });
        }}
        sx={{ display: !state.moveDialog.isOpen ? "block" : "none" }}
      />
      {buildTree(folderData, "0")}
    </TreeView>
  );
};

export default FolderArea;
