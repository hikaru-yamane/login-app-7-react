import { createContext, useState } from "react";

type Complete = {
  message: string,
  imageSrc?: string,
};

export const CompleteContext = createContext({} as {
  complete: Complete,
  completeDisplay: (complete: Complete) => void,
  completeRefresh: () => void,
});
  
export const CompleteProvider = (props: { children: any; }) => {
  const { children } = props;
  const [ complete, setComplete ] = useState<Complete>({ message: "" });

  const completeDisplay = (complete: Complete) => {
    setComplete(prev => complete);
    sessionStorage.setItem("complete", JSON.stringify(complete));
  };

  const completeRefresh = () => {
    const completeJson: string | null = sessionStorage.getItem("complete");
    if (completeJson) {
      const complete: Complete = JSON.parse(completeJson);
      setComplete(prev => complete);
    }
  };

  return (
    <CompleteContext.Provider value={{ complete, completeDisplay, completeRefresh }}>
      {children}
    </CompleteContext.Provider>
  );
};