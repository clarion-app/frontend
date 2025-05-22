import React from "react";

export const NavButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => {
  return (
    <button
      className="block w-[203px] bg-transparent text-left text-base text-white/80 transition-colors hover:text-white hover:bg-[#3c6fb3] rounded border-0 p-2 my-2"
      onClick={onClick}
      >
      {children}
    </button>
  );
};
