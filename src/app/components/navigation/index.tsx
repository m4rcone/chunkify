"use client";

import { useEffect, useState } from "react";
import { MobileNavigation } from "./mobileNavigation";
import { DesktopNavigation } from "./desktopNavigation";
import { useBoards } from "app/hooks/boards/useBoards";
import { useMediaQuery } from "app/hooks/useMediaQuery";

export function Navigation() {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { boards, isLoading } = useBoards();

  useEffect(() => {
    const root = document.documentElement;
    const isDark = localStorage.getItem("theme") === "dark";
    root.classList.toggle("dark", isDark);
  }, []);

  return (
    <div className={`${!isSidebarVisible ? "h-[100px]" : ""} `}>
      {isMobile ? (
        <MobileNavigation boards={boards} />
      ) : (
        <DesktopNavigation
          boards={boards}
          isLoading={isLoading}
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
      )}
    </div>
  );
}
