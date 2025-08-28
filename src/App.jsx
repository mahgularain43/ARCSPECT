import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { About, Contact, Hero, StarsCanvas, LoginPage, SignUp } from "./components";
import ForgotPassword from "./components/ForgotPassword";
import Footer from "./components/Footer";
import NavbarWrapper from "./components/NavbarWrapper";

const GetStarted = lazy(() => import("./components/GetStarted"));
const ModelViewer = lazy(() => import("./components/ModelViewer"));
const Explore = lazy(() => import("./components/Explore"));
const MyDesigns = lazy(() => import("./components/MyDesigns"));
const ScenePage = lazy(() => import("./components/ScenePage"));

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => (
  <BrowserRouter>
    <div className="relative z-0 bg-primary min-h-screen">
      <StarsCanvas className="absolute inset-0 z-10 pointer-events-none" />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="relative">
                <NavbarWrapper />
                <Hero />
              </div>
              <About />
              <Contact />
              <Footer />
            </>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/explore"
          element={
            <Suspense fallback={<div>Loading Explore Page...</div>}>
              <Explore />
            </Suspense>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/get-started"
            element={
              <Suspense fallback={<div>Loading Get Started...</div>}>
                <GetStarted />
              </Suspense>
            }
          />
          <Route
            path="/models/:modelId"
            element={
              <Suspense fallback={<div>Loading Model Viewer...</div>}>
                <ModelViewer />
              </Suspense>
            }
          />
          <Route
            path="/my-designs"
            element={
              <Suspense fallback={<div>Loading My Designs...</div>}>
                <MyDesigns />
              </Suspense>
            }
          />
          <Route
            path="/scene/:sceneId"
            element={
              <Suspense fallback={<div>Loading 3D Floorplan...</div>}>
                <ScenePage />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
