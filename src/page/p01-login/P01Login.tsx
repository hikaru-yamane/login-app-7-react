import "./P01Login.css";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../hook/useHttp";
import { UserContext } from "../../provider/UserProvider";

type Form = {
  email: string;
  password: string;
}

export const P01Login = () => {
  const [ authError, setAuthError ] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ mode: "onChange" });
  const { post } = usePost();
  const navigate = useNavigate();
  const { userLogin } = useContext(UserContext);

  const login = (form: Form) => {
    const url: string = "/authenticate";
    post(url, form)
      .then(res => {
        userLogin(res.data);
        navigate("/home");
      })
      .catch(err => {
        setAuthError(prev => true);
        alert(err.message);
        console.log(err);
      });
  };

  const loginAsGuest = () => {
    const form: Form = {
      email: "guest@domain",
      password: "74937484",
    };
    login(form);
  };

  const loginAsAdmin = () => {
    const form: Form = {
      email: "admin@domain",
      password: "74937484",
    };
    login(form);
  };
  
  return (
    <form onSubmit={handleSubmit(login)}>
      <div><label>メールアドレス<input type="text" {...register("email", {
        required: "メールアドレスを入力してください。",
        pattern: {
          value: /[^@]+?@[^@]+/,
          message: "メールアドレスの形式で入力してください。",
        },
      })} /></label></div>
      <div><label>パスワード<input type="password" {...register("password", {
        required: "パスワードを入力してください。",
        minLength: {
          value: 8,
          message: "パスワードは8文字以上で入力してください。",
        },
      })} autoComplete="off" /></label></div>
      {errors.email && <ul className="error-message"><li>{errors.email.message}</li></ul>}
      {errors.password && <ul className="error-message"><li>{errors.password.message}</li></ul>}
      {authError && <ul className="error-message"><li>メールアドレスまたはパスワードに誤りがあります。</li></ul>}
      <div>
        <button type="submit">ログイン</button>
        <button type="button" onClick={loginAsGuest}>ログイン（ゲスト）</button>
        <button type="button" onClick={loginAsAdmin}>ログイン（管理者）</button>
      </div>
    </form>
  );
};