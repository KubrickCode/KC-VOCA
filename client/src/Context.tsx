import { createContext } from "react";
import { StateType, initialState } from "./Reducer";
import { Dispatch } from "react";
import { ActionType } from "./Reducer";

interface IGlobalContext {
  theme: string;
  setTheme: (theme: string) => void;
  url: string;
  setLoad: (isLoading: boolean) => void;
}

interface IMainContext {
  state: StateType;
  dispatch: Dispatch<ActionType>;
}

export const MainContext = createContext<IMainContext>({
  state: initialState,
  dispatch: () => {},
});
export const GlobalContext = createContext<IGlobalContext>({
  theme: "",
  setTheme: () => {},
  url: "",
  setLoad: () => {},
});
