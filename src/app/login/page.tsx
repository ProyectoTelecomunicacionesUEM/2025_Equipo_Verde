"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { registerUser } from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para el formulario de registro
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);


  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const csrfToken = await getCsrfToken();
      const res = await signIn("credentials", {
        email,
        password,
        csrfToken: csrfToken ?? undefined,
        redirect: false,
        callbackUrl: "/welcome",
      });

      if (res?.error) {
        setError("Email o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.");
      } else if (res?.url) {
        window.location.href = res.url;
      } else {
        setError("No se pudo completar el inicio de sesión.");
      }
    } catch {
      setError("Error inesperado, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRegisterError(null);
    setRegisterLoading(true);
    try {
      const result = await registerUser(nombre, apellidos, registerEmail, registerPassword);
      if (result.success) {
        alert("¡Registro completado! Ahora puedes iniciar sesión con tus datos.");
        // Opcional: Limpiar formulario o redirigir
      } else {
        setRegisterError(result.error || "No se pudo completar el registro.");
      }
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 mt-24 md:mt-32">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl font-semibold mb-4">Iniciar sesión</h1>
          <p className="text-gray-600 mb-6">
            Inserte su usuario de MyPetPlan.
          </p>
          <form onSubmit={submit} className="grid gap-4">
            <input
              className="border rounded px-3 py-2"
              placeholder="Email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Password"
              aria-label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              className="bg-primary text-black rounded px-3 py-2 disabled:opacity-60 hover:bg-primary-accent transition-colors"
              disabled={loading}
              type="submit"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-12">
          <h2 className="text-3xl font-semibold mb-4">¿No tienes cuenta?</h2>
          <p className="text-gray-600 mb-6">
            ¡Regístrate con nosotros!
          </p>
          <form className="grid gap-4" onSubmit={handleRegister}>
            <input
              className="border rounded px-3 py-2"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Email"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Password"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            {registerError && <p className="text-red-600 text-sm">{registerError}</p>}
            <button
              className="bg-primary text-black rounded px-3 py-2 disabled:opacity-60 hover:bg-primary-accent transition-colors"
              type="submit"
              disabled={registerLoading}
            >
              {registerLoading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
