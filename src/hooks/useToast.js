import { useState, useCallback } from "react";
let _id = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = "default", duration = 3e3) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);
  return { toasts, toast };
}
export {
  useToast
};
