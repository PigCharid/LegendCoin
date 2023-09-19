import React, { useEffect, useState } from "react";
import { Fade } from "react-reveal";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../context";
import { isAddress, parseEther } from "ethers/lib/utils";
import { formatEther } from "viem";
import { useInterval } from "ahooks";

const countDown = (diffTime) => {
  let day = Math.floor(diffTime / (60 * 60 * 24));
  let hours = Math.floor((diffTime / (60 * 60)) % 24);
  let minutes = Math.floor((diffTime / 60) % 60);
  let seconds = Math.floor(diffTime % 60);
  return day + " D " + hours + " H " + minutes + " M " + seconds + " S ";
};
const Stake = () => {
  const { t } = useTranslation();
  const [buyValue, setBuyValue] = useState(2000000);
  const [totalStake, setTotalStake] = useState(0);
  const [reload, setReload] = useState(false);
  const [canClaimReward, setCanClaimReward] = useState(0);
  const [diffTime, setDiffTime] = useState(0);
  const {
    setShowAlert,
    balance,
    address,
    readContract,
    writeContract,
    setLoading,
    shareAddress,
    setShareAddress,
  } = useGlobalContext();

  const handleStake = async () => {
    let _shareaddress;

    if (shareAddress === "") {
      _shareaddress = "0x0000000000000000000000000000000000000000";
    } else {
      _shareaddress = shareAddress;
    }
    if (!isAddress(_shareaddress)) {
      setShowAlert({
        status: true,
        type: "failure",
        message: `${t("stake.addressValidNote")}`,
      });
      setLoading({
        status: false,
        message: "",
      });
      return;
    }
    if (address == _shareaddress) {
      setShowAlert({
        status: true,
        type: "failure",
        message: `${t("stake.addressNotself")}`,
      });
      setLoading({
        status: false,
        message: "",
      });
      return;
    }
    if (buyValue < 2000000) {
      setLoading({
        status: false,
        message: "",
      });
      setShowAlert({
        status: true,
        type: "failure",
        message: `${t("stake.stakMin")}`,
      });
      return;
    }
    if (Number(balance) < buyValue) {
      setLoading({
        status: false,
        message: "",
      });
      setShowAlert({
        status: true,
        type: "failure",
        message: `${t("stake.noEnoughCQBI")}`,
      });
      return;
    }
    try {
      setLoading({
        status: true,
        message: `${t("stake.staking")}`,
      });
      const tx = await writeContract.stake(
        parseEther(String(buyValue)),
        _shareaddress
      );
      await tx.wait();
      setReload(!reload);
      setLoading({
        status: false,
        message: "",
      });
      setShowAlert({
        status: true,
        type: "success",
        message: `${t("stake.stakeSuccess")}`,
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
        message: `${t("stake.stakecanncel")}`,
      });
    }
  };

  const handleClaimRewards = async () => {
    setLoading({
      status: true,
      message: `${t("stake.claimStakeRewarding")}`,
    });
    try {
      const tx = await writeContract.claimRewards();
      await tx.wait();
      setReload(!reload);
      setLoading({
        status: false,
        message: "",
      });
      setShowAlert({
        status: true,
        type: "success",
        message: `${t("stake.claimStakeRewardSuccess")}`,
      });
      return;
    } catch (error) {
      console.log(error);
      setLoading({
        status: false,
        message: "",
      });
      if (error.reason.indexOf("You have no rewards") != -1) {
        setShowAlert({
          status: true,
          type: "failure",
          message: `${t("stake.noClaimRewardV")}`,
        });
        return;
      }
      setShowAlert({
        status: true,
        type: "failure",
        message: `${t("stake.claimCanncel")}`,
      });
    }
  };

  const handleClaimAll = async () => {
    setLoading({
      status: true,
      message: `${t("stake.claimStakeRewarding")}`,
    });
    setShowAlert({
      status: true,
      type: "failure",
      message: `${t("stake.note1")}`,
    });
    try {
      const tx = await writeContract.withdrawAll();
      await tx.wait();
      setReload(!reload);
      setLoading({
        status: false,
        message: "",
      });
      setShowAlert({
        status: true,
        type: "success",
        message: `${t("stake.claimStakeRewardSuccess")}`,
      });
      return;
    } catch (error) {
      console.log(error);
      setLoading({
        status: false,
        message: "",
      });
      if (error.reason.indexOf("You have no deposit") != -1) {
        setShowAlert({
          status: true,
          type: "failure",
          message: `${t("stake.notStake")}`,
        });
        return;
      }
      setShowAlert({
        status: true,
        type: "failure",
        message: `${t("stake.claimCanncel")}`,
      });
    }
  };
  useEffect(() => {
    const fn = async () => {
      if (address == undefined) {
        return;
      }
      try {
        const totalStake = await readContract?.deposited(address);
        if (totalStake) {
          setTotalStake(formatEther(totalStake));
        }
      } catch (error) {
        console.log("Deposit error", error);
      }
    };
    fn();
  }, [reload, readContract, address]);

  useInterval(async () => {
    if (address == undefined) {
      return;
    }
    try {
      const canClaimReward = await readContract?.getRewardsAmount(address);
      if (totalStake) {
        setCanClaimReward(formatEther(canClaimReward));
      }
    } catch (error) {
      console.log("getRewardsAmount error", error);
    }
  }, 1000);
  useEffect(() => {
    const fn = async () => {
      if (address == undefined) {
        return;
      }
      try {
        const lastUpdateTime = await readContract?.lastStakeTime(address);
        if (lastUpdateTime) {
          if (parseInt(lastUpdateTime) == 0) {
            setDiffTime(0);
            return;
          }
          if (
            parseInt(lastUpdateTime) + 24 * 60 * 60 * 365 >=
            parseInt(Date.parse(new Date()) / 1000)
          ) {
            setDiffTime(
              parseInt(lastUpdateTime) +
                24 * 60 * 60 * 365 -
                parseInt(Date.parse(new Date()) / 1000)
            );
          } else {
            setDiffTime(-1);
          }
        }
      } catch (error) {
        console.log("LastUpdateTime error", error);
      }
    };
    fn();
  }, [reload, readContract, address]);

  useInterval(() => {
    if (diffTime <= 0) {
      return;
    }
    setDiffTime(diffTime - 1);
  }, 1000);

  return (
    <Fade left>
      <div className="pl-[40px] pt-[100px] flex flex-col justify-between">
        <div>
          <h1 className="text-6xl font-bold border-l-4 border-[#7f46f0] pl-[10px]">
            {t("stake.stakeEarn")}
          </h1>
          <div className="text-[20px] text-[#9eacc7] pt-[30px] w-[90%]">
            <p>{t("stake.stakeRule")}</p>
            <p>{t("stake.stakeRule1")}</p>
            <p>{t("stake.stakeRule2")}</p>
            <p className="pl-4">{t("stake.stakeRule21")}</p>
            <p className="pl-4">{t("stake.stakeRule22")}</p>
            <p className="pl-4">{t("stake.stakeRule23")}</p>
            <p>{t("stake.stakeRule3")}</p>
            <p>{t("stake.stakeRule4")}</p>
          </div>
          <div className="flex md:flex-row flex-col">
            <div className="flex flex-col pt-[30px] font-bold md:w-[30%] w-[90%]">
              <h1 className="text-3xl mb-[10px]">{t("stake.stakeStart")}</h1>
              <div className="flex flex-col gap-3 mb-[20px]">
                <input
                  type="number"
                  value={buyValue}
                  onChange={(e) => {
                    setBuyValue(e.target.value);
                  }}
                  step={100000}
                  min={2000000}
                  className="h-[50px] text-xl bg-[#7f46f0] rounded-xl pl-3"
                />
                <input
                  value={shareAddress}
                  placeholder={t("stake.invitorAddress")}
                  onChange={(e) => {
                    setShareAddress(e.target.value);
                  }}
                  className="h-[50px]  text-xl bg-[#7f46f0] rounded-xl pl-3"
                />
                <button
                  onClick={handleStake}
                  className="border-2 p-2 rounded-lg bg-[#E2B53E] text-black text-2xl"
                >
                  {t("stake.stake")}
                </button>
              </div>
            </div>
            <div className="md:ml-[40px] flex flex-col pt-[30px] font-bold md:w-[60%] w-[90%]">
              <h1 className="text-3xl mb-[10px] ">{t("stake.stakeInfo")}</h1>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between border-2 p-2 ">
                  <p>{t("stake.stakeTotal")}</p>
                  <p>{!address ? `${t("stake.cw")}` : `${totalStake}CQBI`}</p>
                </div>
                <div className="flex justify-between border-2 p-2 ">
                  <p>{t("stake.stakeRewardClaimV")}</p>
                  <p>
                    {!address ? `${t("stake.cw")}` : `${canClaimReward}CQBI`}
                  </p>
                </div>
                <div className="flex justify-between border-2 p-2 ">
                  <p>{t("stake.claimCountDown")}</p>
                  <p>
                    {!address
                      ? `${t("stake.cw")}`
                      : diffTime == 0
                      ? `${t("stake.stakeFirst")}`
                      : diffTime == -1
                      ? `${t("stake.unlock")}`
                      : countDown(diffTime)}
                  </p>
                </div>
                <div className="flex justify-between border-2 p-2 ">
                  <p>{t("stake.CQBIBlance")}</p>
                  <p>{!address ? `${t("stake.cw")}` : `${balance}CQBI`}</p>
                </div>
              </div>
              <div className="flex gap-3 text-black mt-[20px] ">
                <button
                  onClick={handleClaimRewards}
                  className="border-2 p-2 rounded-lg bg-[#E2B53E]"
                >
                  🌈{t("stake.cliamReward")}
                </button>
                <button
                  onClick={handleClaimAll}
                  className="border-2 p-2 rounded-lg bg-[#E2B53E]"
                >
                  🌈{t("stake.allClaim")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Stake;
