import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";
import { useState, useEffect } from "react";
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: "10px",
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props) {
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
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

function Content() {
  const [folderData, setFolderData] = useState([]);
  const [folderId, setFolderId] = useState("");

  const buildTree = (folderData, parent_id) => {
    let tree = [];
    folderData.forEach((folder) => {
      if (
        folder.parent_id === parent_id ||
        (parent_id === "1" && !folder.parent_id)
      ) {
        const children = buildTree(folderData, folder.folder_id);
        const node = (
          <StyledTreeItem
            key={folder.folder_id}
            nodeId={folder.folder_id.toString()}
            labelText={folder.folder_name}
            labelIcon={FolderIcon}
            onClick={() => {
              setFolderId(String(folder.folder_id));
            }}
          >
            {children}
          </StyledTreeItem>
        );
        tree.push(node);
      }
    });
    return tree;
  };

  useEffect(() => {
    axios
      .post("http://localhost:3000/getdata/get_folder", { parent_id: "1" })
      .then((res) => {
        setFolderData(res.data);
      });
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={3}>
          <Item>
            <TreeView
              defaultExpanded={["3"]}
              defaultCollapseIcon={<ArrowDropDownIcon />}
              defaultExpandIcon={<ArrowRightIcon />}
              defaultEndIcon={<div style={{ width: 24 }} />}
              sx={{
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              {buildTree(folderData, "1")}
            </TreeView>
          </Item>
        </Grid>
        <Grid xs={9}>
          <Item>
            <FileArea folderId={folderId} />
          </Item>
        </Grid>
      </Grid>
    </>
  );
}

export default Content;
