"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "app/hooks/use-theme";
import {
  Plus,
  MoreVertical,
  ChevronDown,
  SquareKanban,
  Sun,
  Moon,
  ChevronUp,
  EyeOff,
  Eye,
} from "lucide-react";
import { useBoards } from "app/contexts/boards";

export function Navigation() {
  useEffect(() => {
    const root = document.documentElement;
    const isDark = localStorage.getItem("theme") === "dark";
    root.classList.toggle("dark", isDark);
  }, []);

  return (
    <>
      <MobileNavigation />
      <DesktopNavigation />
    </>
  );
}

function MobileNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { boards } = useBoards();
  const qtdBoards = boards ? boards.length : 0;

  const toggleDropdown = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <header className="dark:bg-dark-gray w-full bg-white md:hidden">
      <div className="flex items-center justify-between p-4">
        {/* Logo and title */}
        <div className="flex items-center gap-4">
          <Image src="logo.svg" alt="" width={24} height={25} />
          <span className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-black dark:text-white">
              Chunkify
            </h1>
            <button
              onClick={toggleDropdown}
              className="text-main-purple cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <ChevronUp width={18} height={18} />
              ) : (
                <ChevronDown width={18} height={18} />
              )}
            </button>
          </span>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="bg-main-purple hover:bg-main-purple-hover cursor-pointer rounded-3xl px-3 py-1 text-white">
            <Plus />
          </button>
          <button className="text-medium-gray cursor-pointer">
            <MoreVertical />
          </button>
        </div>
      </div>

      {/* Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="dark:bg-dark-gray absolute z-10 mt-4 ml-14 min-w-[264px] rounded-lg bg-white shadow-lg">
          <div className="p-4">
            <div className="mb-[19px] pl-2">
              <h2 className="text-medium-gray text-xs font-bold tracking-[2.4px]">
                ALL BOARDS ({qtdBoards})
              </h2>
            </div>
            <nav className="mb-4">
              <BoardList />
              <div className="text-main-purple hover:text-main-purple-hover ml-[-1rem] max-w-[240px] cursor-pointer px-6 py-4 text-sm font-bold">
                <button className="flex cursor-pointer items-center gap-3">
                  <SquareKanban width={20} height={20} className="shrink-0" />
                  <span className="truncate">+ Create New Board</span>
                </button>
              </div>
            </nav>
            <DarkLightToggle />
          </div>
        </div>
      )}
    </header>
  );
}

function DesktopNavigation() {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const { boards } = useBoards();
  const qtdBoards = boards ? boards.length : 0;

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  return (
    <>
      {/* Header */}
      <header className="dark:bg-dark-gray hidden w-[260px] items-center gap-4 bg-white px-6 py-9 md:flex">
        <Image src="logo.svg" alt="" width={24} height={25} />
        <h1 className="text-lg font-bold text-black dark:text-white">
          Chunkify
        </h1>
      </header>

      {/* Sidebar */}
      {isSidebarVisible && (
        <aside className="dark:bg-dark-gray hidden h-[calc(100%-100px)] w-[260px] flex-col justify-between bg-white pt-3.5 pr-6 pb-9 md:flex">
          {/* List of boards */}
          <div>
            <div className="mb-[19px] pl-6">
              <h2 className="text-medium-gray text-xs font-bold tracking-[2.4px]">
                ALL BOARDS ({qtdBoards})
              </h2>
            </div>
            <nav className="">
              <BoardList />
              <div className="text-main-purple hover:text-main-purple-hover max-w-[240px] cursor-pointer px-6 py-4 text-sm font-bold">
                <button className="flex cursor-pointer items-center gap-3">
                  <SquareKanban width={20} height={20} className="shrink-0" />
                  <span className="truncate">+ Create New Board</span>
                </button>
              </div>
            </nav>
          </div>
          {/* Actions */}
          <div className="flex flex-col gap-4 pl-5">
            <DarkLightToggle />
            <button
              onClick={toggleSidebar}
              className="text-medium-gray hover:text-main-purple-hover flex cursor-pointer items-center gap-2.5 py-3 pl-1"
            >
              <EyeOff width={20} height={20} />
              <span className="text-sm font-bold">Hide Sidebar</span>
            </button>
          </div>
        </aside>
      )}

      {/* Open Sidebar Button */}
      {!isSidebarVisible && (
        <div className="absolute bottom-8 hidden md:block">
          <button
            onClick={toggleSidebar}
            className="bg-main-purple hover:bg-main-purple-hover cursor-pointer rounded-r-full py-[15px] pr-[20px] pl-[18px] text-white"
          >
            <Eye width={18} height={18} />
          </button>
        </div>
      )}
    </>
  );
}

function DarkLightToggle() {
  const { isDarkTheme, toggleDarkMode } = useTheme();

  return (
    <div className="bg-light-gray dark:bg-very-dark-gray flex justify-center rounded-md py-3.5">
      <button
        onClick={toggleDarkMode}
        className="text-medium-gray flex items-center gap-6"
      >
        <span>
          <Sun width={20} height={20} />
        </span>
        <div className="bg-main-purple hover:bg-main-purple-hover w-10 cursor-pointer rounded-full p-1">
          <div
            className={`h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isDarkTheme ? "translate-x-5" : ""}`}
          />
        </div>
        <span>
          <Moon width={20} height={20} />
        </span>
      </button>
    </div>
  );
}

function BoardList() {
  const { boards } = useBoards();
  const hasBoards = boards.length !== 0;

  return (
    <ul className="ml-[-1rem] flex flex-col md:ml-0">
      {hasBoards &&
        boards.map((board) => (
          <li
            key={board.id}
            className="text-medium-gray hover:bg-main-purple-hover/10 hover:text-main-purple dark:hover:text-main-purple max-w-[240px] cursor-pointer rounded-r-full px-6 py-4 text-sm font-bold dark:hover:bg-white"
          >
            <Link href={"/"} className="flex items-center gap-3">
              <SquareKanban width={20} height={20} className="shrink-0" />
              <span className="truncate">{board.name}</span>
            </Link>
          </li>
        ))}
      {/* Select item style */}
      {/* <li className="bg-main-purple max-w-[240px] cursor-pointer rounded-r-full px-6 py-4 text-sm font-bold text-white">
        <Link href={"/"} className="flex items-center gap-3">
          <SquareKanban width={20} height={20} className="shrink-0" />
          <span className="truncate">Board Name</span>
        </Link>
      </li> */}
    </ul>
  );
}
