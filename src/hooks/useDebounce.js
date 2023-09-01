import { useEffect, useState } from "react";

function useDebounce(value, delay) {
  const [updatedValue, setUpdatedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUpdatedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return updatedValue;
}

export default useDebounce;
