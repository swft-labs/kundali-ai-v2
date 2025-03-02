import { Toaster } from "@/components/sonner";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import type React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NativewindThemeProvider from "./ThemeProvider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Toaster />
      <NativewindThemeProvider>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      </NativewindThemeProvider>
    </GestureHandlerRootView>
  );
}

export default Providers;
