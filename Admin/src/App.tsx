import "@ant-design/v5-patch-for-react-19";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Defaultlayout from "./layouts/Defaultlayout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import NoPage from "./pages/NoPage";
import Emptylayout from "./layouts/Emptylayout";
import UserPage from "./pages/UserPage/UserPage";
import BookingPage from "./pages/BookingPage/BookingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout mặc định */}
        <Route path="/" element={<Defaultlayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserPage />} />
          <Route path="bookings" element={<BookingPage />} />
        </Route>

        {/* Layout rỗng cho login */}
        <Route path="/login" element={<Emptylayout />}>
          <Route index element={<LoginPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
