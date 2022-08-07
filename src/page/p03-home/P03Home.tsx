import "./P03Home.css";
import { Footer } from "../common-element/footer/Footer";
import { Header } from "../common-element/header/Header";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../provider/UserProvider";
import { useContext } from "react";

export const P03Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const goUser = () => { navigate("/user") };
  const goTime = () => { navigate("/time") };
  const goForum = () => { navigate("/forum") };
  const goImage = () => { navigate("/image") };
  const goMovie = () => { navigate("/movie") };
  
  return (
      <>
        <Header />
        <hr />
        {user.roleName === "ADMIN" && 
          <div><button type="button" className="link-style-btn" onClick={goUser}>ユーザ登録</button></div>
        }
        <div><button type="button" className="link-style-btn" onClick={goTime}>勤怠管理</button></div>
        <div><button type="button" className="link-style-btn" onClick={goForum}>社員交流掲示板</button></div>
        <div><button type="button" className="link-style-btn" onClick={goImage}>年末調整</button></div>
        <div><button type="button" className="link-style-btn" onClick={goMovie}>リモート会議</button></div>
        <div><button type="button" className="disabled-link-style-btn">勤務表</button></div>
        <div><button type="button" className="disabled-link-style-btn">セキュリティ研修</button></div>
        <hr />
        <Footer />
      </>
    );
};