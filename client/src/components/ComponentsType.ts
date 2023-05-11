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
  id: number;
  name: string;
  nickname: string;
  is_favorite: number;
  is_shared: number;
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
  id: number;
  name: string;
  parent_id: number;
}

export interface FolderTreeProps {
  data: Folder[];
  parent_id: number;
}

export interface SearchDataItem {
  id: number | null;
  word: string;
  meaning: string;
  example_sentence: string;
  example_sentence_meaning: string;
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
