import React, { useEffect, useState } from "react";
import { Fade } from "react-reveal";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../context";
import { formatEther, isAddress } from "viem";
import { useInterval } from "ahooks";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Earn = () => {
  const { t } = useTranslation();
  const [shareAddress, setShareAddress] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [isCopy, setIsCopy] = useState(false);
  const [promoted, setPromoted] = useState(0);
  const [promotedRewardAmount, setPromotedRewardAmount] = useState(0);

  const { setShowAlert, address, readContract } = useGlobalContext();
  //* Handle alerts
  useEffect(() => {
    if (isCopy) {
      const timer = setTimeout(() => {
        setIsCopy(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isCopy]);
  const handleShareLink = (shareAddress) => {
    const valid = isAddress(shareAddress);
    if (!valid) {
      setShowAlert({
        status: true,
        type: "failure",
        message: `${t("earn.invalidAddress")}`,
      });
      return;
    }
    setShareLink(`https://legendfi.xyz?address=${shareAddress}`);
  };
  const handleCopy = () => {
    if (shareLink === "") {
      setShowAlert({
        status: true,
        type: "info",
        message: `${t("earn.gennerateFirst")}`,
      });
      return;
    }
    setIsCopy(true);
  };

  useInterval(async () => {
    if (address == undefined) {
      return;
    }
    try {
      const promoted = await readContract?.getPromotedAmout(address);
      if (promoted) {
        setPromoted(promoted.toString());
      }
    } catch (error) {
      console.log("getRewardsAmount error", error);
    }
  }, 1000);
  useInterval(async () => {
    if (address == undefined) {
      return;
    }
    try {
      const promotedRewardAmount = await readContract?.promotedRewardAmount(
        address
      );
      if (promotedRewardAmount) {
        setPromotedRewardAmount(formatEther(promotedRewardAmount));
      }
    } catch (error) {
      console.log("promotedRewardAmount error", error);
    }
  }, 1000);

  return (
    <Fade left>
      {" "}
      <div className="pl-[40px] pt-[100px] flex flex-col justify-between">
        <div>
          <h1 className="text-6xl font-bold border-l-4 border-[#7f46f0] pl-[10px]">
            {t("earn.earnMore")}
          </h1>
          <p className="text-[24px] text-[#9eacc7] pt-[30px] w-[90%]">
            {t("earn.in")}
          </p>
          <div className="flex justify-between border-2 p-2 w-[300px] my-[10px]">
            <p>{t("earn.inviteAmount")}</p>
            <p>{promoted}</p>
          </div>
          <div className="flex justify-between border-2 p-2 w-[300px] ">
            <p>{t("earn.inviteReward")}</p>
            <p>{promotedRewardAmount}CQBI</p>
          </div>
          <div className="flex flex-col pt-[30px] font-bold">
            <h1 className="text-3xl  "> {t("earn.generateLink")}</h1>
            <input
              placeholder={t("stake.yourAddress")}
              value={shareAddress}
              onChange={(e) => {
                setShareAddress(e.target.value);
              }}
              className="md:w-[400px] w-[95%] py-[10px] pl-[6px] mt-[20px] bg-[#7f46f0] border-white border-2 rounded-xl text-xl text-white mb-[10px]"
            />
            <button
              onClick={() => {
                handleShareLink(shareAddress);
              }}
              className="font-bold text-xl  text-black bg-[#E2B53E] w-[240px] border-2 border-[#AEF4E4] rounded-md py-[10px] px-[10px] hover:rounded-2xl hover:scale-110 ease-in-out duration-500"
            >
              {t("earn.clickGenerate")}
            </button>
            <p className="text-md mt-[20px] w-full">
              {shareLink === ""
                ? `${t("earn.linkGenerateFirst")}`
                : `${t("earn.shareLink")}`}
              <span id="copy">{shareLink}</span>
            </p>
            <CopyToClipboard text={shareLink}>
              {isCopy ? (
                <button
                  disabled
                  // onClick={() => {
                  //   handleCopy();
                  // }}
                  className="mt-[20px] mb-[20px] w-[300px] bg-[#4E5A9B] p-2 rounded-lg hover:scale-110 ease-in-out duration-500"
                >
                  {t("earn.copySuccess")}
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleCopy();
                  }}
                  className="mt-[20px] mb-[20px] w-[300px] bg-[#4E5A9B] p-2 rounded-lg hover:scale-110 ease-in-out duration-500"
                >
                  {t("earn.clickCopy")}
                </button>
              )}
            </CopyToClipboard>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Earn;
