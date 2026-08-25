// client/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PostProvider } from "./context/PostContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import DocumentList from "./components/DocumentList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ImpactMap from "./pages/ImpactMap";
import About from "./pages/About";
import Header from "./components/Header";
import DashboardNav from "./components/DashboardNav";
import { ThemeProvider } from "./context/ThemeContext";
import "./pdf-worker.js";

function RequireAuth({ children }) {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
  const location = useLocation();
  const hideHeader = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}

      <div className={`page-wrapper${hideHeader ? " no-header" : ""}`}>
        <div className="page-inner">
          {children}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PostProvider>
          <ThemeProvider>

            <Routes>

              {/* PUBLIC ROUTES */}
              <Route
                path="/"
                element={<Navigate to="/register" replace />}
              />

              <Route
                path="/register"
                element={
                  <Layout>
                    <Register />
                  </Layout>
                }
              />

              <Route
                path="/login"
                element={
                  <Layout>
                    <Login />
                  </Layout>
                }
              />

              {/* PROTECTED */}
              <Route
                path="/home"
                element={
                  <RequireAuth>
                    <Layout>
                      <>
                        <DashboardNav />
                        <DocumentList />
                      </>
                    </Layout>
                  </RequireAuth>
                }
              />

              <Route
                path="/impact-map"
                element={
                  <RequireAuth>
                    <Layout>
                      <ImpactMap />
                    </Layout>
                  </RequireAuth>
                }
              />

              <Route
                path="/about"
                element={
                  <RequireAuth>
                    <Layout>
                      <About />
                    </Layout>
                  </RequireAuth>
                }
              />

              {/* CATCH-ALL */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>

          </ThemeProvider>
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
