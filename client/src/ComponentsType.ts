import { AlertColor } from "@mui/material";
import { TreeItemProps } from "@mui/lab/TreeItem";
import { NavigateFunction } from "react-router-dom";

export interface CenteredTabsProps {
  value: number;
  handleChange: (e: React.SyntheticEvent, newvalue: number) => void;
} //sign

export interface FormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  url?: string;
}

export interface EmailAlertProps {
  type: AlertColor;
  text: string;
} //signin

export interface DialBodyProps {
  name: string;
  icon: JSX.Element;
  click: () => void;
}

export interface File {
  file_id: number;
  file_name: string;
  nickname: string;
  favorites: number;
  shared: number;
} // filearea

export interface StyledTreeItemProps extends Omit<TreeItemProps, "onClick"> {
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

export interface Folder {
  folder_id: number;
  folder_name: string;
  parent_id: number;
}

export interface FolderTreeProps {
  data: Folder[];
  parentId: number;
} //folderarea

export interface SearchDataItem {
  data_id: number | null;
  voca: string;
  voca_mean: string;
  exam: string;
  exam_mean: string;
}

export interface SearchMyTableRowProps {
  title: string;
  label: string;
} //searchpage

export interface DataEnv {
  textColor: { color: string };
  bgColor: { backgroundColor: string };
  theme?: boolean;
  view: ViewObject;
  setView?: (viewObj: ViewObject) => void;
  share?: boolean;
  url?: string;
}

export interface ViewObject {
  state: boolean;
  toggleBtn: JSX.Element;
  text: string;
}

export interface DataItem extends SearchDataItem, DataEnv {
  index: number;
  handleData: ({}: handleDataProps) => void;
  view: ViewObject;
}

export interface handleDataProps extends SearchDataItem {
  type: string;
}

export interface MyHeaderProps extends DataEnv {
  matches: boolean;
  navigate: NavigateFunction;
  fileName: string;
  handleData: ({}: handleDataProps) => void;
}

export interface MyTableRowProps extends DataEnv, SearchMyTableRowProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CheckedState {
  [key: string]: boolean;
}

export interface CountState {
  [key: string]: number;
} //vocaload
