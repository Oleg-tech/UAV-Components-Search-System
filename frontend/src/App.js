import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoPage from './pages/NoPage';
import { Navbar } from './components/navbar';
import { Home } from "./pages/home/home";
import { Search } from "./pages/search/search";
import { Cart } from "./pages/cart/cart";
import { Admin } from "./pages/admin/admin";
import { CheckMessages } from "./pages/admin/admin-check-messages";
import { LoginForm } from "./pages/login/login";
import { Categories } from "./pages/categories/categories";
import { Kits } from "./pages/kits/kits";
import { KitsCompare } from "./pages/kits/kit_compare";
import { Feedback } from "./pages/feedback/feedback";

function App() {
  return (
    <div 
      // style={{backgroundColor: "#eee"}}
    >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Search />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/check_messages" element={<CheckMessages />} />
          <Route path="/search" element={<Search />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/kits" element={<Kits />} />
          <Route path="/kits/compare" element={<KitsCompare />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
