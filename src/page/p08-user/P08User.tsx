import "./P08User.css";
import { ChangeEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Footer } from "../common-element/footer/Footer";
import { Header } from "../common-element/header/Header";
import { usePostJson } from "../../hook/useHttp";
import { useNavigate } from "react-router-dom";
import { CompleteContext } from "../../provider/CompleteProvider";

type Form = {
  name: string,
  email: string;
  password: string;
}

export const P08User = () => {
  const [ customCrossError, setCustomCrossError ] = useState(false);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<Form>({ mode: "onChange" });
  const { postJson } = usePostJson();
  const navigate = useNavigate();
  const { completeDisplay } = useContext(CompleteContext);

  const customCrossValidate = (event: ChangeEvent<HTMLInputElement>) => {
    const name: string = getValues("name");
    const email: string = getValues("email");
    const totalLength: number = name.length + email.length;
    const isValid: boolean = totalLength >= 5 && totalLength <= 20;
    if (isValid) {
      setCustomCrossError(prev => false);
    } else {
      setCustomCrossError(prev => true);
    }
  };

  const registerUser = (form: Form) => {
    const url: string = "/user/register";
    postJson(url, form)
      .then(res => {
        completeDisplay({ message: "ユーザを登録しました。" });
        navigate("/complete");
      })
      .catch(err => {
        alert(err.message);
        console.log(err);
      });
  };
  
  return (
    <>
      <Header />
      <hr />
      <form onSubmit={handleSubmit(registerUser)}>
        <div>ユーザ登録</div>
        <div><label>名前<input type="text" {...register("name", {
          required: "名前を入力してください。",
          onChange: (event) => {
            customCrossValidate(event);
          },
        })} /></label></div>
        <div><label>メールアドレス<input type="text" {...register("email", {
          required: "メールアドレスを入力してください。",
          pattern: {
            value: /[^@]+?@[^@]+/,
            message: "メールアドレスの形式で入力してください。",
          },
          onChange: (event) => {
            customCrossValidate(event);
          },
        })} /></label></div>
        <div><label>パスワード<input type="password" {...register("password", {
          required: "パスワードを入力してください。",
          minLength: {
            value: 8,
            message: "パスワードは8文字以上で入力してください。",
          },
        })} autoComplete="off" /></label></div>
        {errors.name && <ul className="error-message"><li>{errors.name.message}</li></ul>}
        {errors.email && <ul className="error-message"><li>{errors.email.message}</li></ul>}
        {errors.password && <ul className="error-message"><li>{errors.password.message}</li></ul>}
        {customCrossError && <ul className="error-message"><li>名前とメールアドレスは合計2-20文字で入力してください。（相関チェックのお試し実装）</li></ul>}
        <div>
          <button type="submit">登録</button>
        </div>
      </form>
      <hr />
      <Footer />
    </>
  );
};