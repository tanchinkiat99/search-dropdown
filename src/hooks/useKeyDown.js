import { useEffect } from "react";

function useKeyDown(keyCode, callback) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.keyCode === keyCode) {
        callback(event);
      }
    }

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyCode, callback]); // Re-run the effect if keyCode or callback changes
}

export default useKeyDown;
