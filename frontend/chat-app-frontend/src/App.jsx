import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import "./App.css";
import Login from "./components/login";
import Register from "./components/register";
import HomePage from "./components/homePage";
import Account from "./components/account";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Register" element={<Register />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/Account" element={<Account />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
