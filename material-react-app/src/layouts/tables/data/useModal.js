// useModal.js
import { useState } from "react";

export const useModal = (props) => {
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState("");

  const handleOpen = (data) => {
    setModalData(data);
    setShow(true);
   props.useModalShow()
    console.log(show);
  };
  const handleClose = () => setShow(false);

  return {
    show,
    modalData,
    handleOpen,
    handleClose,
  };
};
