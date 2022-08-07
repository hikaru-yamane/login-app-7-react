import { useContext } from "react";
import { CompleteContext } from "../../../provider/CompleteProvider";
import { Footer } from "../../common-element/footer/Footer";
import { Header } from "../../common-element/header/Header";

export const Complete = () => {
  const { complete } = useContext(CompleteContext);
  
  return (
    <>
      <Header />
      <hr />
      {complete.imageSrc && 
        <div><img src={complete.imageSrc} alt="画像" /></div>
      }
      <div>{ complete.message }</div>
      <hr />
      <Footer />
    </>
  );
};