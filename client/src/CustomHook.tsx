import { useState } from "react";

export const useHandleOpen = (
  state: boolean,
  handle: (isOpen: boolean) => void
) => {
  const [open, setOpen] = useState(state);

  const handleOpen = () => {
    handle(open);
  };

  return [open, handleOpen, setOpen];
};
