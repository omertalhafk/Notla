// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // profil datası
  const [loading, setLoading] = useState(true);

  // Sayfa ilk açıldığında token var mı diye bak
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Profil çekme
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/auth/profile/");
      setUser(res.data);
    } catch (error) {
      console.error("Profil alınamadı", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/api/auth/login/", { email, password });

    // SimpleJWT varsayılan response: { refresh: "...", access: "..." }
    const { access, refresh } = res.data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    await fetchProfile();
  };

  // REGISTER
 const register = async (email, username, password, password2) => {
   // backend password_confirm beklediği için ismi ona göre ayarladık
   const res = await api.post("/api/auth/register/", {
     email,
     username,
     password,
     password_confirm: password2,
   });
   return res.data;
 };


  // LOGOUT
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* loading bitmeden çocukları göstermiyoruz */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
