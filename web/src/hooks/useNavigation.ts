import { useState, useCallback } from "react";
import type { ViewType } from "@/lib/types";

export function useNavigation(initialView: ViewType = "boot") {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [viewStack, setViewStack] = useState<ViewType[]>([initialView]);

  const navigateTo = useCallback((view: ViewType) => {
    setCurrentView(view);
    setViewStack((prev) => [...prev, view]);
  }, []);

  const goBack = useCallback(() => {
    setViewStack((prev) => {
      if (prev.length <= 1) return prev;
      const newStack = prev.slice(0, -1);
      setCurrentView(newStack[newStack.length - 1]);
      return newStack;
    });
  }, []);

  return { currentView, navigateTo, goBack, viewStack };
}
