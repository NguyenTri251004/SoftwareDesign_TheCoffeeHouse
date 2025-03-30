import React, { createContext, useState, useContext } from "react";

// Tạo Context
const PopupContext = createContext();

// Tạo Provider để bọc ứng dụng
export const PopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <PopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

// Hook để dùng context trong các component
export const usePopup = () => useContext(PopupContext);
