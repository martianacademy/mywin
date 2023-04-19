import React from "react";

export const ScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  return null;
};
