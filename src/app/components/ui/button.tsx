import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: "primary" | "secundary" | "destructive";
  size: "sm" | "lg";
}

export function Button({ children, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={`${variant === "primary" && "bg-main-purple hover:bg-main-purple-hover disabled:bg-main-purple-hover text-white disabled:cursor-not-allowed"} ${variant === "secundary" && "bg-main-purple/10 hover:bg-main-purple/25 text-main-purple disabled:bg-main-purple/10 disabled:cursor-not-allowed dark:bg-white dark:hover:bg-white dark:disabled:bg-white"} ${variant === "destructive" && "bg-red hover:bg-red-hover disabled:bg-red-hover text-white"} ${size === "sm" && "rounded-[20px] py-2 text-[0.8125rem]"} ${size === "lg" && "rounded-[24px] py-3.5 text-[0.9375rem]"} flex w-full cursor-pointer justify-center px-4 font-bold`}
      {...props}
    >
      {children}
    </button>
  );
}
