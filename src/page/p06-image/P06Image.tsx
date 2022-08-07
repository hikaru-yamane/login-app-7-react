import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostJson } from "../../hook/useHttp";
import { CompleteContext } from "../../provider/CompleteProvider";
import { Footer } from "../common-element/footer/Footer";
import { Header } from "../common-element/header/Header";

type Body = {
  imageSrc: string,
};

export const P06Image = () => {
  const [ imageSrc, setImageSrc ] = useState("");
  const { postJson } = usePostJson();
  const navigate = useNavigate();
  const { completeDisplay } = useContext(CompleteContext);
  
  const displayImage = (event: any) => {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const imageSrc = reader.result!.toString();
      setImageSrc(prev => imageSrc);
    };
  };

  const registerImage = () => {
    if (!imageSrc) {
      alert('画像を選択してください。');
      return;
    }
    const url: string = "/image/register";
    const body: Body = { imageSrc };
    postJson(url, body)
      .then(res => {
        completeDisplay({
          message: "画像を登録しました。",
          imageSrc: res.data.imageSrc,
        });
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
      <div>
        画像:<input type="file" accept="image/*" onChange={displayImage} />
        <button type="button" onClick={registerImage}>登録</button>
      </div>
      {imageSrc && 
        <div><img src={imageSrc} alt="画像" /></div>
      }
      <hr />
      <Footer />
    </>
  );
};