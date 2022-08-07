import { useEffect, useState } from "react";
import { Footer } from "../common-element/footer/Footer";
import { Header } from "../common-element/header/Header";

type MessageList = string[];
let socket: WebSocket;

export const P05Forum = () => {
  const [ messageList, setMessageList ] = useState<MessageList>([]);
  
  useEffect(() => {
    return onDestroy;
  }, []);

  const onDestroy = () => {
    if (socket) {
      socket.close();
    }
  };

  const connect = () => {
    const room = (() => {
      const roomElem = document.getElementById("room") as HTMLInputElement;
      const room = roomElem.value;
      return room;
    })();
    if (!room) {
      alert("接続先を入力してください。");
      return;
    }
    if (socket) {
      socket.close();
    }
    const url = (() => {
      const isLocal = window.location.hostname === "localhost";
      const ws = isLocal ? "ws" : "wss";
      const isDev = window.location.host === "localhost:3000";
      const host = isDev ? "localhost:8080" : window.location.host;
      return `${ws}://${host}/forum/${room}`;
    })();
    socket = new WebSocket(url);
    socket.onopen = () => {
      setMessageList(prev => {
        const messageList = [...prev];
        const message = `${room}に接続しました。`;
        messageList.push(message);
        return messageList;
      });
    };
    socket.onmessage = (event) => {
      setMessageList(prev => {
        const messageList = [...prev];
        const message = event.data;
        messageList.push(message);
        return messageList;
      });
    };
    socket.onerror = () => {
      setMessageList(prev => {
        const messageList = [...prev];
        const message = `${room}に接続できませんでした。`;
        messageList.push(message);
        return messageList;
      });
    };
  };

  const send = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert("先に接続して下さい。");
      return;
    }
    const messageElem = document.getElementById("message") as HTMLInputElement;
    const message = messageElem.value;
    if (!message) {
      alert("送信するメッセージを入力してください。");
      return;
    }
    socket.send(message);
    messageElem.value = "";
  };

  return (
    <>
      <Header />
      <hr />
      <div>
        <input type="text" id="room" />
        <button type="button" onClick={connect}>接続</button>
      </div>
      <div>
        <input type="text" id="message" />
        <button type="button" onClick={send}>送信</button>
      </div>
      <div>
        <ul></ul>
      </div>
      {messageList.length > 0 && 
        <div>
          <ul>
            {messageList.map((message, idx) => 
              <li key={idx}>{message}</li>
            )}
          </ul>
        </div>
      }
      <hr />
      <Footer />
    </>
  );
  };