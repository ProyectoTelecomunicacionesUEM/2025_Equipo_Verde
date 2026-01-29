import Link from "next/link";
import { FaPaw, FaChartLine } from "react-icons/fa6";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { pool } from "@/lib/db";

export default async function WelcomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  // Consulta a la base de datos para obtener todos los datos del usuario usando el ID de la sesión
  let dbUser = null;
  if (user.id) {
    const { rows } = await pool.query("SELECT * FROM Usuarios WHERE id = $1", [user.id]);
    dbUser = rows[0];
  }

  const userId = user.id ?? "No disponible";
  const displayName = dbUser ? `${dbUser.nombre} ${dbUser.apellidos}` : user.email;

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-8 mt-20 md:mt-24">
      <section className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Inicio de sesión correcto
        </p>
        <h1 className="text-4xl font-semibold">Bienvenido, {displayName}</h1>
        <p className="text-gray-600">
          Bienestar animal inteligente: ¡Tú eliges los servicios, tú controlas el coste!
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm">
        <h2 className="text-base font-medium mb-2">Tus datos de sesión:</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>
            <span className="font-semibold">Nombre:</span> {dbUser?.nombre ?? "No registrado"}
          </li>
          <li>
            <span className="font-semibold">Apellidos:</span> {dbUser?.apellidos ?? "No registrados"}
          </li>
          <li>
            <span className="font-semibold">Email:</span> {dbUser?.email ?? user.email}
          </li>
          <li>
            <span className="font-semibold">Rol:</span> {dbUser?.rol ?? "No registrado"}
          </li>
          <li>
            <span className="font-semibold">Identificador:</span> {userId}
          </li>
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white/60 p-3 shadow-sm flex items-center justify-center">
          <Link
            href="/dashboard"
            className="bg-primary text-black px-4 py-3 rounded-full font-semibold hover:bg-primary-accent transition-colors w-full flex items-center justify-center text-sm"
          >
            <FaChartLine className="mr-2" /> Ir al Dashboard
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white/60 p-3 shadow-sm flex items-center justify-center">
          <Link
            href="/dashboard?section=dispositivos"
            className="bg-primary text-black px-4 py-3 rounded-full font-semibold hover:bg-primary-accent transition-colors w-full flex items-center justify-center text-sm"
          >
            <FaPaw className="mr-2" /> Activar Dispositivo
          </Link>
        </div>
        <article className="rounded-xl border border-gray-200 bg-white/60 p-3 shadow-sm">
          <h3 className="text-sm font-semibold mb-1">Próximos pasos</h3>
          <ul className="list-disc pl-4 text-xs text-gray-600 space-y-0.5">
            <li>Elige tu dispositivo adaptado a tu animal.</li>
            <li>Selecciona los servicios según necesidades.</li>
            <li>Activa tu dispositivo.</li>
            <li>Consulta el dashboard para ver tus métricas clave.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
