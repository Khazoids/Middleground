import { Outlet } from "react-router-dom";
import TopNavigationBar from "./components/Navigation/TopNavigationBar";

function App() {
  return (
    <div className="h-screen w-full bg-gray-50">
      <TopNavigationBar />
      <div className="h-full pt-28 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
