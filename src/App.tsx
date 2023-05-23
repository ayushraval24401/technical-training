import React from "react";
import { ToastContainer, Zoom } from "react-toastify";
import "./App.css";
import { Provider as ReduxProvider } from "react-redux";
import Routes from "./routes";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import AuthContextProvider from "./context/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Routes />{" "}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          transition={Zoom}
          className="toast-container-custom"
        />
      </AuthContextProvider>
    </div>
  );
}

export default App;
