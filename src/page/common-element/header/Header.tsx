import { memo, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../../hook/useHttp";
import { UserContext } from "../../../provider/UserProvider";

export const Header = memo(() => {
  const { user, userLogout } = useContext(UserContext);
  const { post } = usePost();
  const navigate = useNavigate();
  console.log(1);
  
  useEffect(() => {
    if (user.id === -1) {
      navigate("/login");
    }
  }, []);

  const goHome = () => {
    navigate("/home");
  };

  const logout = () => {
    const url: string = "/logout";
    post(url)
      .then(res => {
        userLogout();
        navigate("/logout");
      })
      .catch(err => {
        alert(err.message);
        console.log(err);
      });
  };

  return (
    <header>
      <div>ヘッダー</div>
      <div>{ user.name }さん</div>
      <button type="button" onClick={goHome}>ホーム画面へ戻る</button>
      <button type="button" onClick={logout}>ログアウト</button>
    </header>
  );
});