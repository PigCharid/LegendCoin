import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import zh from "./zh.json";
import en from "./en.json";
import ko from "./ko.json";
import ja from "./ja.json";
const resources = {
  zh: {
    translation: zh,
  },
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
  ja: {
    translation: ja,
  },
};
i18n
  // .use(LanguageDetector)
  .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
  .init({
    //初始化
    resources, //本地多语言数据
    fallbackLng: "en", //默认当前环境的语言
    detection: {
      caches: ["localStorage", "sessionStorage", "cookie"],
    },
  });

export default i18n;
