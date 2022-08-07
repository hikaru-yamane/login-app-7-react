import "./P07Movie.css";
import { useEffect, useState } from "react";
import { Footer } from "../common-element/footer/Footer";
import { Header } from "../common-element/header/Header";

type MessageList = string[];
let socket: WebSocket;
let myVideo: HTMLVideoElement;
let otherVideo: HTMLVideoElement;
let peer: RTCPeerConnection;
let iceCandidates: RTCIceCandidate[];
let stream: MediaStream;

export const P07Movie = () => {
  const [ messageList, setMessageList ] = useState<MessageList>([]);
  
  useEffect(() => {
    onInit();
    return onDestroy;
  }, []);

  const onInit = () => {
    myVideo = document.getElementById("myVideo") as HTMLVideoElement;
    otherVideo = document.getElementById("otherVideo") as HTMLVideoElement;
    connectRTC();
  };

  const onDestroy = () => {
    if (socket) {
      socket.close();
    }
    if (peer) {
      peer.close();
    }
    if (stream) {
      stream.getTracks()[0].stop();
    }
  };

  const connectRTC = async () => {
    peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    iceCandidates = [];
    
    peer.addEventListener("icecandidate", (event) => {
      if (!event.candidate) {
        return;
      }
      iceCandidates.push(event.candidate);
    });
    peer.addEventListener("track", (event) => {
      otherVideo.srcObject = event.streams[0];
    });
    
    const facingMode = (() => {
      const elems = document.getElementsByName("cameraMode") as NodeListOf<HTMLInputElement>;
      const elem = Array.from(elems).find(elem => elem.checked);
      const cameraMode = elem!.value;
      const facingMode = cameraMode === "front" ? "use" : { exact: "environment" };
      return facingMode;
    })();
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: facingMode
      }
    });
    myVideo.srcObject = stream;
    stream.getTracks().forEach((track: any) => {
      peer.addTrack(track, stream);
    });
  };

  const connectSocket = () => {
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
      peer.close();
      connectRTC();
    }
    const url = (() => {
      const isLocal = window.location.hostname === "localhost";
      const ws = isLocal ? "ws" : "wss";
      const isDev = window.location.host === "localhost:3000";
      const host = isDev ? "localhost:8080" : window.location.host;
      return `${ws}://${host}/movie/${room}`;
    })();
    socket = new WebSocket(url);
    socket.onopen = async () => {
      setMessageList(prev => {
        const messageList = [...prev];
        const message = `${room}に接続しました。`;
        messageList.push(message);
        return messageList;
      });
      sendSdpOffer();
    };
    socket.onmessage = async (event) => {
      const json = event.data;
      const obj = JSON.parse(json);
      if (obj.type === "offer") {
        const description = obj;
        receiveSdpOffer(description);
        sendSdpAnswer();
        sendIceCandidates();
      } else if (obj.type === "answer") {
        const description = obj;
        receiveSdpAnswer(description);
        sendIceCandidates();
      } else {
        const iceCandidates = obj;
        receiveIceCandidates(iceCandidates);
      }
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

  const sendSdpOffer = async () => {
    const description = await peer.createOffer();
    await peer.setLocalDescription(description);
    socket.send(JSON.stringify(description));
  };

  const receiveSdpOffer = async (description: any) => {
    await peer.setRemoteDescription(description);
  };

  const sendSdpAnswer = async () => {
    const description = await peer.createAnswer();
    await peer.setLocalDescription(description);
    socket.send(JSON.stringify(description));
  };

  const receiveSdpAnswer = async (description: any) => {
    await peer.setRemoteDescription(description);
  };

  const sendIceCandidates = async () => {
    await wait(200);
    socket.send(JSON.stringify(iceCandidates));
  };

  const receiveIceCandidates = async (iceCandidates: any) => {
    for (const iceCandidate of iceCandidates) {
      await peer.addIceCandidate(iceCandidate);
    }
  };

  const wait = (millisecond: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, millisecond);
    });
  };

  return (
    <>
      <Header />
      <hr />
      <div className="video-area">
        <div>
          <p>自分の映像</p>
          <video id="myVideo" autoPlay></video>
        </div>
        <div>
          <p>相手の映像</p>
          <video id="otherVideo" autoPlay></video>
        </div>
      </div>
      <div>
        <label><input type="radio" name="media" value="camera" disabled checked />カメラ</label>
        <label><input type="radio" name="media" value="window" disabled />ウィンドウ</label><br />
        <label><input type="radio" name="cameraMode" value="front" disabled checked />フロントカメラ</label>
        <label><input type="radio" name="cameraMode" value="rear" disabled />リアカメラ</label><br />
        <input type="text" id="room" /><button type="button" onClick={connectSocket}>接続</button><br />
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