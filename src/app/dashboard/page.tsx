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

  // Obtener usuarios invitados
  const { rows: invitedUsers } = await pool.query(`
    SELECT u.id, u.nombre, u.apellidos, u.email, u.estado
    FROM Usuarios u
    JOIN UsuariosInvitados ui ON u.id = ui.Usuario_Invitado_id
    WHERE ui.Usuario_id = $1
  `, [session.user.id]);

  // Obtener dispositivos del usuario
  const { rows: dispositivos } = await pool.query(`
    SELECT d.*, da.Animal_id as animal_id, a.nombre as animal_nombre
    FROM Dispositivos d
    JOIN DueñoDispositivo dd ON d.id = dd.Dispositivo_id
    LEFT JOIN DispositivoAnimal da ON d.id = da.Dispositivo_id
    LEFT JOIN Animales a ON da.Animal_id = a.id
    WHERE dd.Usuario_id = $1
  `, [session.user.id]);

  return <DashboardUI user={dbUser} animales={animales} invitedUsers={invitedUsers} dispositivos={dispositivos} />;
}
