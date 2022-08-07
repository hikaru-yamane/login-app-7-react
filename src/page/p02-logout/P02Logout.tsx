import { useNavigate } from "react-router-dom";

export const P02Logout = () => {
  const navigate = useNavigate();
  
  const goLogin = () => {
    navigate("/login");
  };

  return (
      <>
        <div>ログアウトしました。</div>
        <div><button type="button" onClick={goLogin}>ログイン画面へ戻る</button></div>
      </>
    );
};