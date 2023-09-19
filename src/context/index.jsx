import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ABI, ADDRESS } from "../contract";
import { useAccount, useNetwork } from "wagmi";
import { formatEther } from "viem";
import { useInterval } from "ahooks";
const GlobalContext = createContext();
const search = window.location.search;
const params = new URLSearchParams(search);
export const GlobalContextProvider = ({ children }) => {
  const [readContract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);
  const [shareAddress, setShareAddress] = useState("");
  const [alreadyClaim, setAlreadyClaim] = useState(false);
  const [balance, setBalance] = useState(0);
  // const location = useLocation();
  const { address } = useAccount();
  const { chain } = useNetwork();
  // console.log(address, chain);
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });

  const [showLoading, setLoading] = useState({
    status: false,
    message: "",
  });
  // * Set the smart contract and provider to the state
  useEffect(() => {
    const setReadContractAndProvider = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/bsc"
      );
      const ReadContract = new ethers.Contract(ADDRESS, ABI, provider);
      setReadContract(ReadContract);
    };

    setReadContractAndProvider();
  }, []);
  // useEffect(() => {
  //   const setReadContractAndProvider = async () => {
  //     const provider = new ethers.providers.JsonRpcProvider(
  //       "https://eth-goerli.g.alchemy.com/v2/Q1svh7bjqwrEd5tgBKY5fl5QFxeq3KsG"
  //     );
  //     const ReadContract = new ethers.Contract(ADDRESS, ABI, provider);
  //     setReadContract(ReadContract);
  //   };

  //   setReadContractAndProvider();
  // }, []);

  //* Set the smart contract and provider to the state
  useEffect(() => {
    const setWriteContractAndProvider = async () => {
      if (window.ethereum === undefined) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const writeContract = new ethers.Contract(ADDRESS, ABI, signer);
      setWriteContract(writeContract);
    };
    setWriteContractAndProvider();
  }, [address, chain]);

  useInterval(() => {
    const getBalance = async () => {
      if (address === undefined) {
        setBalance(0);
        return;
      }
      try {
        const balance = await readContract?.balanceOf(address);
        setBalance(formatEther(balance));
      } catch (error) {
        console.log("getBalance", error);
      }
    };
    getBalance();
  }, 1000);
  useEffect(() => {
    if (params.get("address") == undefined) {
      return;
    } else {
      setShareAddress(params.get("address"));
    }
  });

  //* Handle alerts
  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: "info", message: "" });
      }, [3000]);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <GlobalContext.Provider
      value={{
        showAlert,
        setShowAlert,
        address,
        readContract,
        writeContract,
        balance,
        alreadyClaim,
        showLoading,
        setLoading,
        shareAddress,
        setShareAddress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
