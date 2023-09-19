import React from "react";
import { useNavigate } from "react-router-dom";
import { BiWallet, BiNotification, BiShapePolygon } from "react-icons/bi";
import { Fade } from "react-reveal";
import { BiShield } from "react-icons/bi";
import { RiFlashlightLine } from "react-icons/ri";
import { BsCoin } from "react-icons/bs";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import android from "../assets/images/android.png";
import apple from "../assets/images/apple.png";

const Home = ({ setIsActive }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const getOption = () => {
    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: `${t("in.proportion")}`,
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 14, name: `${t("home.community")}` },
            { value: 26, name: `${t("home.gameStudy")}` },
            { value: 24, name: `${t("home.airDrop")}` },
            { value: 16, name: `${t("home.share")}` },
            { value: 20, name: `${t("home.mining")}` },
          ],
        },
      ],
    };
    return option;
  };

  return (
    <Fade left>
      <div className="pl-[40px] pt-[100px] flex flex-col justify-between">
        <div>
          <h1 className="text-6xl font-bold border-l-4 border-[#7f46f0] pl-[10px]">
            {t("home.title1")} <br /> {t("home.title2")}
          </h1>
          <p className="text-[24px] text-[#9eacc7] pt-[30px] w-[90%]">
            {t("home.in")}
          </p>
          <p className="text-[24px] text-[#9eacc7] pt-[30px] w-[90%]">
            {t("home.downloadLink")}
          </p>
          <div className="flex">
            <a
              className="flex items-center"
              href="https://www.y7wan.com/spread/downfile/download_app?promote_id=4465"
              target="_blank"
            >
              <img src={android} alt="android" className="w-[80px]" />
              <span> {t("home.enterGame")}</span>
            </a>
            <a
              className="flex items-center"
              href="https://www.y7wan.com/spread/downfile/download_app?promote_id=4465"
              target="_blank"
            >
              <img src={apple} alt="apple" className="w-[80px]" />
              <span>{t("home.enterGame")}</span>
            </a>
          </div>

          <p className="text-[24px] text-[#9eacc7] pt-[30px] w-[90%]">
            {t("home.note")}
          </p>
          <p className="text-[12px] text-[#9eacc7] w-[90%]">
            {t("home.contractAddress")}
            0x9D0C5e18dB1C28FB46D3C79c47336220b6bdf161
          </p>
          <ReactECharts option={getOption()} />
          <div className="flex md:flex-row flex-col gap-10">
            <div className="flex flex-col pt-[30px] font-bold">
              <h1 className="text-3xl  "> {t("home.stakeRule")}</h1>
              <div>
                <Fade right>
                  <li className="border-2 p-2 mt-[10px] w-[300px]  flex  cursor-pointer hover:bg-[#7f46f0] hover:text-teal-600 ease-in-out duration-500">
                    {t("home.cw")}
                    <BiShield className="mt-1 ml-auto text- xl" />
                  </li>
                </Fade>
                <Fade left>
                  <li className="border-2 p-2 mt-[10px] w-[300px]  flex  cursor-pointer hover:bg-[#7f46f0] hover:text-teal-600 ease-in-out duration-500">
                    {t("home.getToken")}
                    <RiFlashlightLine className="mt-1 ml-auto text- xl" />
                  </li>
                </Fade>
                <Fade right>
                  <li className="border-2 p-2 mt-[10px] w-[300px]  flex  cursor-pointer hover:bg-[#7f46f0] hover:text-teal-600 ease-in-out duration-500">
                    {t("home.startStake")}
                    <BsCoin className="mt-1 ml-auto text- xl" />
                  </li>
                </Fade>
              </div>
              <button
                onClick={() => {
                  setIsActive("/stake");
                  navigate("/stake");
                }}
                className="mt-[20px] mb-[20px] w-[300px] bg-[#4E5A9B] p-2 rounded-lg hover:scale-110 ease-in-out duration-500"
              >
                🚀🚀🚀{t("home.goStake")}
              </button>
            </div>
            <div>
              <div className="flex flex-col pt-[30px] font-bold">
                <h1 className="text-3xl"> {t("home.earnRule")}</h1>
                <div>
                  <Fade right>
                    <li className="border-2 p-2 mt-[10px] w-[300px]  flex  cursor-pointer hover:bg-[#7f46f0] hover:text-teal-600 ease-in-out duration-500">
                      {t("home.cw")}
                      <BiWallet className="mt-1 ml-auto text- xl" />
                    </li>
                  </Fade>
                  <Fade left>
                    <li className="border-2 p-2 mt-[10px] w-[300px]  flex  cursor-pointer hover:bg-[#7f46f0] hover:text-teal-600 ease-in-out duration-500">
                      {t("home.generateLink")}
                      <BiNotification className="mt-1 ml-auto text- xl" />
                    </li>
                  </Fade>
                  <Fade right>
                    <li className="border-2 p-2 mt-[10px] w-[300px]  flex  cursor-pointer hover:bg-[#7f46f0] hover:text-teal-600 ease-in-out duration-500">
                      {t("home.receiveReward")}
                      <BiShapePolygon className="mt-1 ml-auto text- xl" />
                    </li>
                  </Fade>
                </div>
                <button
                  onClick={() => {
                    setIsActive("/earn");
                    navigate("/earn");
                  }}
                  className="mt-[20px] mb-[20px] w-[300px] bg-[#D6C45F] p-2 rounded-lg hover:scale-110 ease-in-out duration-500"
                >
                  🚀🚀🚀{t("home.goShare")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Home;
