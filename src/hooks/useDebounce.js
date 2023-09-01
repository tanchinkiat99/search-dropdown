import { useEffect, useState } from "react";

function useDebounce(value, delay) {
  const [updatedValue, setUpdatedValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let debounceTimer;
    let loadTimer;

    const startLoading = () => {
      setIsLoading(true);
      loadTimer = setTimeout(() => {
        setIsLoading(false);
        setUpdatedValue(value);
      }, 500);
    };

    debounceTimer = setTimeout(startLoading, delay);

    return () => {
      clearTimeout(debounceTimer);
      clearTimeout(loadTimer);
    };
  }, [value, delay]);

  return { updatedValue, isLoading };
}

export default useDebounce;
