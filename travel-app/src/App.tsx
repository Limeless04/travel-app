import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto min-h-screen px-4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
