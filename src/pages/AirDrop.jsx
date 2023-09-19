import React, { useState } from "react";
import { Fade } from "react-reveal";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../context";
import { useInterval } from "ahooks";
import { formatEther, parseEther } from "viem";

const AirDrop = () => {
  const { t } = useTranslation();
  const [forkBalance, setForkBalance] = useState(0);
  const [calFork, setCalFork] = useState(0);
  const [alreadyClaimfork, setAlreadyClaimfork] = useState(0);
  const [totalAirDropAmount, setTotalAirDropAmount] = useState(0);
  const [totalAirDropTimes, setTotalAirDropTimes] = useState(0);
  const [alreadyAirDrop, setAlreadyAirDrop] = useState(false);

  const {
    setShowAlert,
    balance,
    address,
    readContract,
    writeContract,
    setLoading,
  } = useGlobalContext();
  useInterval(async () => {
    if (address == undefined) {
      return;
    }
    try {
      const forkBalance = await readContract?.forkBalance(address);
      if (forkBalance) {
        setForkBalance(formatEther(forkBalance));
      }
    } catch (error) {
      console.log("forkBalance error", error);
    }
  }, 1000);
  useInterval(async () => {
    if (address == undefined) {
      return;
    }
    try {
      const calFork = await readContract?.calFork(address);
      if (calFork) {
        setCalFork(formatEther(calFork));
      }
    } catch (error) {
      console.log("calFork error", error);
    }
  }, 1000);
  useInterval(async () => {
    if (address == undefined) {
      return;
    }
    try {
      const alreadyClaimfork = await readContract?.alreadyClaimfork(address);
      if (alreadyClaimfork) {
        setAlreadyClaimfork(formatEther(alreadyClaimfork));
      }
    } catch (error) {
      console.log("alreadyClaimfork error", error);
    }
  }, 1000);
  useInterval(async () => {
    try {
      const totalAirDropAmount = await readContract?.totalAirDropAmount();
      if (totalAirDropAmount) {
        setTotalAirDropAmount(formatEther(totalAirDropAmount));
      }
    } catch (error) {
      console.log("totalAirDropAmount error", error);
    }
  }, 1000);
  useInterval(async () => {
    try {
      const totalAirDropTimes = await readContract?.totalAirDropTimes();
      if (totalAirDropTimes) {
        setTotalAirDropTimes(totalAirDropTimes.toString());
      }
    } catch (error) {
      console.log("totalAirDropTimes error", error);
    }
  }, 1000);
  useInterval(async () => {
    if (address == undefined) {
      return;
    }
    try {
      const alreadyAirDrop = await readContract?.alreadyAirDrop(address);
      if (alreadyAirDrop) {
        setAlreadyAirDrop(totalAirDropTimes);
      }
    } catch (error) {
      console.log("alreadyAirDrop error", error);
    }
  }, 1000);

  const handleAirDrop = async () => {
    if (alreadyAirDrop) {
      setShowAlert({
        status: true,
        type: "info",
        message: `${t("airdrop.alreadyClaim")}`,
      });
      return;
    }

    setLoading({
      status: true,
      message: `${t("airdrop.claiming")}`,
    });
    try {
      const tx = await writeContract.airDrop({
        value: parseEther("0.00400"),
      });
      await tx.wait();
      setLoading({
        status: false,
        message: "",
      });
      setShowAlert({
        status: true,
        type: "success",
        message: `${t("airdrop.claimSuccess")}`,
      });
      return;
    } catch (error) {
      console.log("error", error);
      setLoading({
        status: false,
        message: "",
      });
      setShowAlert({
        status: true,
        type: "failure",
        message: `${t("airdrop.claimCanncel")}`,
      });
    }
  };
  const handleForkAirDrop = async () => {
    setLoading({
      status: true,
      message: `${t("airdrop.claiming")}`,
    });
    try {
      const tx = await writeContract.fork();
      await tx.wait();
      setLoading({
        status: false,
        message: "",
      });
      setShowAlert({
        status: true,
        type: "success",
        message: `${t("airdrop.claimSuccess")}`,
      });
      return;
    } catch (error) {
      console.log(error)
      setLoading({
        status: false,
        message: "",
      });
      console.log(error.reason.indexOf("No Access"));
      if (error.reason.indexOf("No Access") != -1) {
        setShowAlert({
          status: true,
          type: "failure",
          message: `${t("airdrop.noAccess")}`,
        });
        return;
      }
      if (error.reason.indexOf("No More forkBalance") != -1) {
        setShowAlert({
          status: true,
          type: "failure",
          message: `${t("airdrop.noCQBIClaim")}`,
        });
        return;
      }

      setShowAlert({
        status: true,
        type: "failure",
        message: `${t("airdrop.claimCanncel")}`,
      });
    }
  };

  return (
    <Fade left>
      <div className="pl-[40px] pt-[100px] flex flex-col justify-between">
        <div>
          <h1 className="text-6xl font-bold border-l-4 border-[#7f46f0] pl-[10px]">
            {t("airdrop.airDrop")}
          </h1>
          <p className="text-[24px] text-[#9eacc7] pt-[30px] w-[90%]">
            {t("airdrop.airDrop1")}
          </p>
          <p className="text-[24px] text-[#9eacc7]  w-[90%]">
            {t("airdrop.airDrop2")}
          </p>
          <div className="flex md:flex-row flex-col gap-4 md:pr-[20px] ">
            <div className="flex flex-col pt-[30px] font-bold gap-2 w-[90%]">
              <h1 className="text-3xl  ">{t("airdrop.airDropFirst")}</h1>
              <div>
                <div className="flex flex-col gap-2">
                  {/* <div className="flex justify-between border-2 p-2  ">
                    <p>{t("airdrop.CQBBlance")}</p>
                    <p>10000CQBI</p>
                  </div> */}
                  <div className="flex justify-between border-2 p-2  ">
                    <p>{t("airdrop.forkClaimTotal")}</p>
                    <p>{forkBalance}CQBI</p>
                  </div>
                  <div className="flex justify-between border-2 p-2 ">
                    <p>{t("airdrop.forkClaimv")}</p>
                    <p>{calFork}CQBI</p>
                  </div>
                  <div className="flex justify-between border-2 p-2 ">
                    <p>{t("airdrop.forkAlready")}</p>
                    <p>{alreadyClaimfork}CQBI</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleForkAirDrop}
                className="mt-[20px] mb-[20px] w-[300px] bg-[#4E5A9B] p-2 rounded-lg hover:scale-110 ease-in-out duration-500"
              >
                {t("airdrop.forkClaim")}
              </button>
            </div>
            <div className="flex flex-col md:pt-[30px] pt-0 font-bold gap-2 w-[90%]">
              <h1 className="text-3xl  ">{t("airdrop.airDropNormal")}</h1>
              <div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between border-2 p-2  ">
                    <p>{t("airdrop.airDropNormalTotal")}</p>
                    <p>{totalAirDropAmount}CQBI</p>
                  </div>
                  <div className="flex justify-between border-2 p-2  ">
                    <p>{t("airdrop.airDropNormalAmount")}</p>
                    <p>{totalAirDropTimes}</p>
                  </div>
                  <div className="flex justify-between border-2 p-2 ">
                    <p> {t("airdrop.airDropNormalClaimV")}</p>
                    <p>{alreadyAirDrop ? "0" : "500"}CQBI</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleAirDrop}
                className="mt-[20px] mb-[20px] w-[300px] bg-[#E2B53E] p-2 rounded-lg hover:scale-110 ease-in-out duration-500"
              >
                {t("airdrop.forkClaim")}
              </button>
            </div>
          </div>
          <div className="flex justify-between border-2 p-2 w-[90%] items-center">
            <p>{t("airdrop.CQBIBalance")}</p>
            <p>{balance}CQBI</p>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default AirDrop;
