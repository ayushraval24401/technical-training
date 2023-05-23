import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

const PrivateRoutes = ({ component: Component }: any) => {
  const hasAccessToken = localStorage.getItem("userAccessToken");
  if (hasAccessToken) {
    return <Component />;
  } else {
    return <Navigate to="/login" />;
  }
};

const routes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<PrivateRoutes component={Home} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default routes;
