"use client";

import { useEffect, useState } from "react";
import { MobileNavigation } from "./mobile-navigation";
import { DesktopNavigation } from "./desktop-navigation";
import { useBoards } from "app/hooks/boards/useBoards";
import { useMediaQuery } from "app/hooks/use-media-query";

export function Navigation() {
  const { boards } = useBoards();
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const root = document.documentElement;
    const isDark = localStorage.getItem("theme") === "dark";
    root.classList.toggle("dark", isDark);
  }, []);

  return (
    <div className={`${!isSidebarVisible ? "h-[100px]" : ""} `}>
      {isMobile && <MobileNavigation boards={boards} />}
      <DesktopNavigation
        boards={boards}
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
      />
    </div>
  );
}
