import { Route, Routes } from "react-router-dom";
import { IndexPage } from "./pages/IndexPage";
import { LoginPage } from "./pages/LoginPage";
import { Layout } from "./Layout";
import { Register } from "./pages/Register";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import { Accounts } from "./pages/Accounts";
import { Places } from "./pages/Places";
import { PlacesForm } from "./components/PlacesForm";
import { Place } from "./pages/Place";
import { Booking } from "./pages/Booking";
import { Bookings } from "./pages/Bookings";
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />}></Route>
          <Route path="/account" element={<Accounts />} />
          <Route path="/account/places" element={<Places />} />
          <Route path="/account/places/new" element={<PlacesForm />} />
          <Route path="/account/places/:id" element={<PlacesForm />} />
          <Route path="/place/:id" element={<Place />} />
          <Route path="account/bookings" element={<Bookings />} />
          <Route path="account/bookings/:id" element={<Booking />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
