import { useContext, useEffect, useState } from "react";
import { usePostJson } from "../../hook/useHttp";
import { UserContext } from "../../provider/UserProvider";
import { Footer } from "../common-element/footer/Footer";
import { Header } from "../common-element/header/Header";

type TimeList = {
  workType: string,
  dateTime: string,
}[];
type GetRequestBody = {
  userId: number,
};
type RegisterRequestBody = {
  userId: number,
  workType: string,
  dateTime: string,
};

export const P04Time = () => {
  const [ timeList, setTimeList ] = useState<TimeList>([]);
  const { postJson } = usePostJson();
  const { user } = useContext(UserContext);

  useEffect(() => {
    getTime();
  }, []);

  const getTime = () => {
    const url: string = "/time/get";
    const body: GetRequestBody = (() => {
      const userId: number = user.id;
      return { userId };
    })();
    postJson(url, body)
      .then(res => {
        setTimeList(prev => res.data);
      })
      .catch(err => {
        alert(err.message);
        console.log(err);
      });
  };

  const registerTime = (workType: string) => () => {
    const url: string = "/time/register";
    const body: RegisterRequestBody = (() => {
      const userId: number = user.id;
      const dateTime: string = (() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const MM = (d.getMonth() + 1).toString().padStart(2, '0');
        const dd = d.getDate().toString().padStart(2, '0');
        const HH = d.getHours().toString().padStart(2, '0');
        const mm = d.getMinutes().toString().padStart(2, '0');
        const ss = d.getSeconds().toString().padStart(2, '0');
        return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
      })();
      return { userId, workType, dateTime };
    })();
    postJson(url, body)
      .then(res => {
        setTimeList(prev => {
          const timeList = [...prev];
          const time = { workType: body.workType, dateTime: body.dateTime};
          timeList.push(time);
          return timeList;
        });
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
        <button type="button" onClick={registerTime("出勤")}>出勤</button>
        <button type="button" onClick={registerTime("退勤")}>退勤</button>
      </div>
      {timeList.length > 0 && 
        <div>
          <ul>
            {timeList.map((time, idx) => 
              <li key={idx}>{time.workType} {time.dateTime}</li>
            )}
          </ul>
        </div>
      }
      <hr />
      <Footer />
    </>
  );
};