import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import DashboardUI from "./DashboardUI";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Obtener datos frescos del usuario desde la base de datos
  const { rows: userRows } = await pool.query("SELECT * FROM Usuarios WHERE id = $1", [session.user.id]);
  const dbUser = userRows[0] || session.user;

  // Obtener animales del usuario
  const { rows: animales } = await pool.query(`
    SELECT a.* 
    FROM Animales a
    JOIN DueñoAnimal da ON a.id = da.Animal_id
    WHERE da.Usuario_id = $1
  `, [session.user.id]);

  return <DashboardUI user={dbUser} animales={animales} />;
}
