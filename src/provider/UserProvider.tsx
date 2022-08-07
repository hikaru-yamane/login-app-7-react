import { createContext, useState } from "react";

type User = {
  id: number,
  name: string,
  email: string,
  roleName: string,
};
const defaultUser: User = {
  id: -1,
  name: "",
  email: "",
  roleName: "",
};

export const UserContext = createContext({} as {
  user: User,
  userLogin: (user: User) => void,
  userLogout: () => void,
  userRefresh: () => void,
});

export const UserProvider = (props: { children: any; }) => {
  const { children } = props;
  const [ user, setUser ] = useState<User>(defaultUser);
  
  const userLogin = (user: User) => {
    setUser(prev => user);
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  const userLogout = () => {
    setUser(prev => defaultUser);
    sessionStorage.removeItem("user");
  };

  const userRefresh = () => {
    const userJson: string | null = sessionStorage.getItem("user");
    if (userJson) {
      const user: User = JSON.parse(userJson);
      setUser(prev => user);
    }
  };

  return (
    <UserContext.Provider value={{ user, userLogin, userLogout, userRefresh }}>
      {children}
    </UserContext.Provider>
  );
};