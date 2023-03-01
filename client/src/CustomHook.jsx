import { useState } from "react";

export const useHandleOpen = (state, handle) => {
  const [open, setOpen] = useState(state);

  const handleOpen = () => {
    handle();
  };

  return [open, handleOpen, setOpen];
};
