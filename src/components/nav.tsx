import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";
import logo from "../assets/images/logo.png";
import i18n from "../local/i18n";
import { useAccount, useBalance, useNetwork } from "wagmi";

const Nav = ({ isActive, setIsActive }) => {
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data } = useBalance({
    address: address,
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [language, setLanguage] = useState("en");
  const changeLanguage = (e) => {
    setLanguage(e.target.value);
    i18n.changeLanguage(e.target.value);
  };
  const navlinks = [
    {
      name: `${t("nav.home")}`,
      link: "/",
    },
    {
      name: `${t("nav.stake")}`,
      link: "/stake",
    },
    {
      name: `${t("nav.earn")}`,
      link: "/earn",
    },
    {
      name: `${t("nav.airDrop")}`,
      link: "/airdrop",
    },
  ];
  // useEffect(() => {
  //   let type = localStorage.getItem("i18nextLng");
  //   console.log(type);
  //   if (type) {
  //     setLanguage(type);
  //   } else {
  //   }
  // }, []);
  return (
    <div className="p-2">
      <div className="flex md:flex-row flex-col  md:justify-between md:items-center">
        {/* Logo的位置  */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => {
            setIsActive("/");
            navigate("/");
          }}
        >
          <div className="flex items-center">
            <img className="w-[60px] rounded-xl" src={logo} alt="Logo" />
            <div className="text-4xl font-bold text-rajdhani cursor-pointer">
              LEGENDCOIN
            </div>
          </div>

          <div className="text-xl block md:hidden font-bold">
            <select
              className="bg-[#131517] border-[2px] rounded-lg"
              value={language}
              onChange={(e) => changeLanguage(e)}
            >
              <option value="en">EN</option>
              <option value="zh">中文</option>
              <option value="ko">한국인</option>
              <option value="ja">日本</option>
            </select>
          </div>
        </div>

        <div className="flex  md:items-center gap-4 mt-[20px] md:mt-0">
          <div className="text-xl hidden md:block font-bold">
            <select
              className="bg-[#131517] border-[2px] rounded-lg"
              value={language}
              onChange={(e) => changeLanguage(e)}
            >
              <option value="en">EN</option>
              <option value="zh">中文</option>
              <option value="ko">한국인</option>
              <option value="ja">日本</option>
            </select>
          </div>
          <div className="flex gap-1">
            {address && (
              <div className=" bg-[#7f46f0] font-bold rounded-md hover:rounded-xl ease-in-out duration-300 p-2  text-xl cursor-pointer">
                {chain?.id !== 56 ? (
                  <p
                    className="text-red-600 whitespace-nowrap "
                    onClick={openChainModal}
                  >
                    Network Error
                  </p>
                ) : (
                  <p>BSC</p>
                )}
              </div>
            )}

            {address && (
              <div className=" bg-[#7f46f0] font-bold rounded-md hover:rounded-xl ease-in-out duration-300 p-2  text-xl cursor-pointer">
                <p className="whitespace-nowrap">
                  {data?.formatted.slice(0, data?.formatted.indexOf(".") + 5)}
                  &nbsp;{data?.symbol}
                </p>
              </div>
            )}
            {/* 地址 */}
            {address && (
              <div className=" bg-[#7f46f0] font-bold rounded-md hover:rounded-xl ease-in-out duration-300 p-2  text-xl cursor-pointer">
                <p>
                  {address.slice(0, 6)}..{address.slice(38, 42)}
                </p>
              </div>
            )}
            {!address && (
              <p
                className=" hover:bg-slate-700 font-bold  bg-[#7f46f0] dark:border-cyan-500 rounded-md hover:rounded-xl ease-in-out duration-300 p-2  text-xl cursor-pointer whitespace-nowrap "
                onClick={openConnectModal}
              >
                Connect Wallet
              </p>
            )}
            {/* <ConnectButton /> */}
          </div>
        </div>
      </div>
      <div className="flex gap-6 mt-3">
        {navlinks.map((item) => (
          <div
            className={`${
              isActive === item.link && "bg-[#7f46f0]"
            } cursor-pointer md:text-2xl text-lg font-bold  rounded-lg  px-1`}
            key={item.name}
            onClick={() => {
              setIsActive(item.link);
              navigate(item.link);
            }}
          >
            {item?.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nav;
