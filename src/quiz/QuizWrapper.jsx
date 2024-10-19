import { useEffect, useRef } from "react";

const QuizWrapper = ({ onOutsideClick, children }) => {
    const wrapperRef = useRef(null);
  
    useEffect(() => {
      function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          onOutsideClick();
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onOutsideClick]);
  
    return (
      <div ref={wrapperRef} className=" w-full min-h-[100vh] flex items-center justify-center">
        {children}
      </div>
    );
  };


export default QuizWrapper;