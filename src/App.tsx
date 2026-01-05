import ModalProvider from "@/provider/modal-provider";
import { PostEditorProvider } from "@/provider/post-editor/post-editor-provider";
import SessionProvider from "@/provider/session-provider";
import RootRouter from "@/root-router";
import { useSetTheme, useTheme } from "@/store/theme";
import { useEffect } from "react";

function App() {
  const theme = useTheme();
  const setTheme = useSetTheme();

  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <SessionProvider>
      <PostEditorProvider>
        <ModalProvider>
          <RootRouter />
        </ModalProvider>
      </PostEditorProvider>
    </SessionProvider>
  );
}

export default App;
