import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiAdmin from "../Api/Admin";
const Login = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const dataResponse = await fetch(ApiAdmin.login.url, {
      method: ApiAdmin.login.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: email, motDePasse: motDePasse }),
    });
    const response = await dataResponse.json();
    if (response.success) {
      toast.success(response.message);
      localStorage.setItem("user", JSON.stringify(response?.Admin));
      navigate("/admin/dashboard/classes");
    } else {
      console.log(response.message);
      toast.error(response.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <ToastContainer position="top-center" />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Se connecter
        </h2>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Adresse email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              value={motDePasse}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Mot de passe"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              Se souvenir de moi
            </label>
            <a href="/" className="text-sm text-blue-500 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
