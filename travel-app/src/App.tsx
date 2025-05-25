import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
          <Outlet />
      </div>
    </>
  );
}

export default App;
