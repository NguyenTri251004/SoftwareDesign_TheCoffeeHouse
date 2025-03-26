import React, { createContext, useState, useContext } from "react";

// Tạo Context
const VoucherContext = createContext();

// Tạo Provider để bọc ứng dụng
export const VoucherProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <VoucherContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
    </VoucherContext.Provider>
  );
};

// Hook để dùng context trong các component
export const useVoucher = () => useContext(VoucherContext);
