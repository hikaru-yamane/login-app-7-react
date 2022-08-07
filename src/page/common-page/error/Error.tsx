import { useNavigate } from "react-router-dom";

export const Error = () => {
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };
  
  return (
    <>
      <div>404 not found</div>
      <div><button type="button" onClick={goLogin}>ログイン画面へ戻る</button></div>
    </>
  );
};