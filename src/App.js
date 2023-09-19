import { useGlobalContext } from "./context";
import { Routes, Route, useLocation } from "react-router-dom";
import bg from "./assets/images/bg.png";
import swiper1 from "./assets/images/swiper1.jpg";
import swiper2 from "./assets/images/swiper2.jpg";
import swiper3 from "./assets/images/swiper3.jpg";
import Nav from "./components/nav.tsx";
import Home from "./pages/Home";
import { useRef, useState } from "react";
import Alert from "./components/Alert";
import Loading from "./components/Loading";
import Earn from "./pages/Earn";
import Stake from "./pages/Stake";
import AirDrop from "./pages/AirDrop";
import { useTranslation } from "react-i18next";
import { SiDiscord } from "react-icons/si";
import { TbBrandTwitter, TbBrandTelegram } from "react-icons/tb";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";

function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isActive, setIsActive] = useState(location.pathname);
  const { showAlert, showLoading } = useGlobalContext();
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <div className="flex flex-col lg:flex-row  font-rajdhani">
      {showAlert?.status && (
        <Alert
          state={showAlert.status}
          type={showAlert.type}
          message={showAlert.message}
        />
      )}
      {showLoading?.status && (
        <Loading state={showLoading.status} message={showLoading.message} />
      )}
      <div className=" w-full  lg:w-[50%] text-white">
        <Nav isActive={isActive} setIsActive={setIsActive} />
        <Routes>
          <Route element={<Home setIsActive={setIsActive} />} path="/"></Route>
          <Route element={<Earn />} path="/earn"></Route>
          <Route element={<Stake />} path="/stake"></Route>
          <Route element={<AirDrop />} path="/airdrop"></Route>
        </Routes>
        <div className="flex md:flex-row flex-col-reverse w-full justify-center items-center mt-[60px] mb-[20px] gap-4">
          <div>
            <p className="">{t("footer.footer")}</p>
            <p className="">{t("home.contactUs")}</p>
          </div>

          <div className="flex gap-8">
            <a
              href="https://twitter.com/intent/follow?screen_name=legendcoinfi"
              target="_blank"
            >
              <TbBrandTwitter className="text-4xl ml-2 cursor-pointer hover:bg-slate-800  rounded-md ease-in-out duration-500 hover:p-1" />
            </a>
            <a href="https://discord.gg/NyR4rqPT" target="_blank">
              <SiDiscord className="text-4xl ml-2 cursor-pointer hover:bg-slate-800 dark:hover:bg-slate-600 rounded-md ease-in-out duration-500 hover:p-1" />
            </a>
            <a href="https://t.me/+B6X2-6LS1z5jZGE1" target="_blank">
              <TbBrandTelegram className="text-4xl ml-2 cursor-pointer hover:bg-slate-800  rounded-md ease-in-out duration-500 hover:p-1" />
            </a>
          </div>
        </div>
      </div>
      <div className="w-full  lg:w-[50%] md:fixed left-[50vw]">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          // pagination={{
          //   clickable: true,
          // }}
          // navigation={true}
          modules={[Autoplay]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              src={swiper1}
              alt="swiper1"
              className=" w-full border-2  border-white rounded-xl"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={swiper2}
              alt="swiper2"
              className=" w-full border-2  border-white rounded-xl"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={swiper3}
              alt="swiper3"
              className=" w-full border-2  border-white rounded-xl"
            />
          </SwiperSlide>

          <div className="autoplay-progress z-10" slot="container-end">
            <svg viewBox="0 0 48 48" ref={progressCircle}>
              <circle cx="24" cy="24" r="20"></circle>
            </svg>
            <span ref={progressContent}></span>
          </div>
        </Swiper>
      </div>
    </div>
  );
}

export default App;
