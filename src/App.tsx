import ModalProvider from "@/provider/modal-provider";
import SessionProvider from "@/provider/session-provider";
import RootRouter from "@/root-router";

function App() {
  return (
    <SessionProvider>
      <ModalProvider>
        <RootRouter />
      </ModalProvider>
    </SessionProvider>
  );
}

export default App;
