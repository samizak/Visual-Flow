"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#1e1e1e] group-[.toaster]:text-white group-[.toaster]:border-gray-800 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-gray-300",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:hover:bg-blue-700 font-medium",
          cancelButton:
            "group-[.toast]:bg-gray-700 group-[.toast]:text-white group-[.toast]:hover:bg-gray-600 font-medium",
          closeButton:
            "group-[.toast]:text-gray-400 group-[.toast]:hover:text-white group-[.toast]:bg-gray-800/50 group-[.toast]:hover:bg-gray-700/50",
        },
        duration: 3000,
      }}
      {...props}
    />
  );
};

export { Toaster };
