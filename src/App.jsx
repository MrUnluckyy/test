import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CityProvider } from "./contexts/CityContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

// import Product from "./pages/Product";
// import Homepage from "./pages/Homepage";
// import Pricing from "./pages/Pricing";
// import PageNotFound from "./pages/PageNotFound";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";

import Form from "./components/Form";
import City from "./components/City";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import SpinnerFullPage from "./components/SpinnerFullPage";
import { Suspense } from "react";

const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Login = lazy(() => import("./pages/Login"));

// dist/index.html                   0.48 kB │ gzip:   0.32 kB
// dist/assets/index-5ad3f0fe.css   30.37 kB │ gzip:   5.13 kB
// dist/assets/index-bf4868e0.js   524.96 kB │ gzip: 148.77 kB

export default function App() {
  return (
    <CityProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />

              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </CityProvider>
  );
}
