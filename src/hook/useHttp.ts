import axios from "axios";

export const usePost = () => {
  const post = (url: string, data?: any) => {
    url = (() => {
      const isDev = window.location.host === "localhost:3000";
      const host = isDev ? "http://localhost:8080" : "";
      return host + url;
    })();
    data = (() => {
      if (!data) {
        return null;
      }
      const paramArray = Object.keys(data).map(key => {
        const val = encodeURIComponent(data[key]);
        const param = `${key}=${val}`;
        return param;
      });
      const params = paramArray.join("&");
      return params;
    })();
    const config = (() => {
      const headers = { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" };
      const config = { headers };
      return config;
    })();
    return axios.post(url, data, config);
  };

  return { post };
};

export const usePostJson = () => {
  const postJson = (url: string, data?: any) => {
    url = (() => {
      const isDev = window.location.host === "localhost:3000";
      const host = isDev ? "http://localhost:8080" : "";
      return host + url;
    })();
    return axios.post(url, data);
  };

  return { postJson };
};

// export const useHttp = () => {
//   // const [res, setRes] = useState({ data: null, error: null });
//   const [res, setRes] = useState(null);
//   const [err, setErr] = useState(null);

//   const postJson = (url: string, body?: any) => {
//     url = (() => {
//       const isDev = window.location.host === "localhost:3000";
//       const host = isDev ? "http://localhost:8080" : "";
//       return host + url;
//     })();
//     axios
//       .post(url, body)
//       .then(res => {
//         setRes(res.data);
//       })
//       .catch(err => {
//         setErr(err);
//       });
//   };

//   return { postJson, res, err };
// };