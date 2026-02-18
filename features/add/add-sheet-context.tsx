"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AddSheet } from "./add-sheet";

type AddMode = "choice" | "order" | "expense";

interface AddSheetContextValue {
  open: boolean;
  openAdd: (mode?: Extract<AddMode, "order" | "expense">) => void;
  closeAdd: () => void;
}

const AddSheetContext = createContext<AddSheetContextValue | null>(null);

export function AddSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<AddMode>("choice");
  // TODO: lorsque mode="choice", prévoir "dernière action utilisée en premier"
  // (localStorage ou pref pour order/expense selon historique)

  const openAdd = useCallback((mode?: "order" | "expense") => {
    setInitialMode(mode ?? "choice");
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setInitialMode("choice");
  }, []);

  const closeAdd = useCallback(() => setOpen(false), []);

  return (
    <AddSheetContext.Provider value={{ open, openAdd, closeAdd }}>
      {children}
      <AddSheet open={open} onOpenChange={handleOpenChange} initialMode={initialMode} />
    </AddSheetContext.Provider>
  );
}

export function useAddSheet() {
  const ctx = useContext(AddSheetContext);
  if (!ctx) {
    return {
      openAdd: () => {},
      closeAdd: () => {},
    };
  }
  return ctx;
}
