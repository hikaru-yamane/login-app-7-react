import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./provider/UserProvider";
import { CompleteContext } from "./provider/CompleteProvider";
import { P01Login } from "./page/p01-login/P01Login";
import { P02Logout } from "./page/p02-logout/P02Logout";
import { P03Home } from "./page/p03-home/P03Home";
import { P04Time } from "./page/p04-time/P04Time";
import { P05Forum } from "./page/p05-forum/P05Forum";
import { P06Image } from "./page/p06-image/P06Image";
import { P07Movie } from "./page/p07-movie/P07Movie";
import { P08User } from "./page/p08-user/P08User";
import { Complete } from "./page/common-page/complete/Complete";
import { Error } from "./page/common-page/error/Error";

export const App = () => {
  const { userRefresh } = useContext(UserContext);
  const { completeRefresh } = useContext(CompleteContext);
  
  useEffect(() => {
    userRefresh();
    completeRefresh();
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<P01Login />} />
        <Route path="/logout" element={<P02Logout />} />
        <Route path="/home" element={<P03Home />} />
        <Route path="/time" element={<P04Time />} />
        <Route path="/forum" element={<P05Forum />} />
        <Route path="/image" element={<P06Image />} />
        <Route path="/movie" element={<P07Movie/>} />
        <Route path="/user" element={<P08User />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};
