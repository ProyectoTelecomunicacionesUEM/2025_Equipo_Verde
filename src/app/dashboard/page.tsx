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
    SELECT DISTINCT a.*,
    CASE WHEN da.Usuario_id IS NOT NULL THEN true ELSE false END as is_owner
    FROM Animales a
    LEFT JOIN DueñoAnimal da ON a.id = da.Animal_id AND da.Usuario_id = $1
    LEFT JOIN DispositivoAnimal dev_a ON a.id = dev_a.Animal_id
    LEFT JOIN Dispositivos d ON dev_a.Dispositivo_id = d.id
    WHERE da.Usuario_id IS NOT NULL OR d.usuario_asociado_id = $1
  `, [session.user.id]);

  // Obtener usuarios invitados
  const { rows: invitedUsers } = await pool.query(`
    SELECT 
      u.id, 
      u.nombre, 
      u.apellidos, 
      u.email, 
      u.estado,
      COALESCE((
        SELECT array_agg(d.alias)
        FROM Dispositivos d
        JOIN DueñoDispositivo dd ON d.id = dd.Dispositivo_id
        WHERE d.usuario_asociado_id = u.id AND dd.Usuario_id = $1
      ), '{}') as dispositivos_asociados
    FROM Usuarios u
    JOIN UsuariosInvitados ui ON u.id = ui.Usuario_Invitado_id
    WHERE ui.Usuario_id = $1
  `, [session.user.id]);

  // Obtener dispositivos del usuario
  const { rows: dispositivos } = await pool.query(`
    SELECT DISTINCT
      d.*, 
      da.Animal_id as animal_id, 
      a.nombre as animal_nombre,
      ua.nombre as usuario_asociado_nombre,
      COALESCE((
        SELECT array_agg(s.tipo)
        FROM ServicioContratado sc
        JOIN Servicios s ON sc.servicio_id = s.id
        WHERE sc.dispositivo_id = d.id AND sc.estadoContratacion = 'ACTIVO'
      ), '{}') as servicios_contratados,
      CASE WHEN dd.Usuario_id IS NOT NULL THEN true ELSE false END as is_owner
    FROM Dispositivos d
    LEFT JOIN DueñoDispositivo dd ON d.id = dd.Dispositivo_id AND dd.Usuario_id = $1
    LEFT JOIN DispositivoAnimal da ON d.id = da.Dispositivo_id
    LEFT JOIN Animales a ON da.Animal_id = a.id
    LEFT JOIN Usuarios ua ON d.usuario_asociado_id = ua.id
    WHERE dd.Usuario_id IS NOT NULL OR d.usuario_asociado_id = $1
  `, [session.user.id]);

  return <DashboardUI user={dbUser} animales={animales} invitedUsers={invitedUsers} dispositivos={dispositivos} />;
}
