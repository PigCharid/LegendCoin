import React from "react";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";

const Loading = ({ state, message }) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={state}
      className={`absolute inset-0 flex items-center justify-center  bg-white backdrop-filter backdrop-blur-lg bg-opacity-[0] z-[99999999]`}
      //   overlayClassName="Overlay"
    >
      <div className=" flex flex-col  font-bold text-3xl text-white">
        <div className="flex flex-row justify-center items-center">
          <div className="lds-dual-ring scale-50"></div>
          <p className="text-xl">Legend {t("loading.speed")}</p>
        </div>
        <p className=" mb-6 text-center">{message}</p>
      </div>
    </Modal>
  );
};

export default Loading;
