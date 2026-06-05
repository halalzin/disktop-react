import React from "react";
function ToastContainer({ toasts }) {
  return  React.createElement("div", { className: "toast-container", "aria-live": "polite" }, toasts.map((t) =>  React.createElement("div", { key: t.id, className: `toast${t.type === "error" ? " toast-error" : ""}` }, t.msg)));
}
export {
  ToastContainer as default
};
