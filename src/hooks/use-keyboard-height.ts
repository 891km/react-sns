import { useState, useEffect } from "react";

export const useKeyboardHeight = () => {
  const [keyboardHeight, setResultHeight] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleUpdate = () => {
      const height = window.innerHeight - viewport.height - viewport.offsetTop;
      setResultHeight(height > 0 ? height : 0);
    };

    viewport.addEventListener("resize", handleUpdate);
    viewport.addEventListener("scroll", handleUpdate);
    window.addEventListener("focusout", handleUpdate);
    return () => {
      viewport.removeEventListener("resize", handleUpdate);
      viewport.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("focusout", handleUpdate);
    };
  }, []);

  return keyboardHeight;
};
