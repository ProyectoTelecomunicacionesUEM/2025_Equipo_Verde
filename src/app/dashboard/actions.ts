'use server';

import { pool } from "@/lib/db";
import { auth } from "@/auth";

export async function deleteUserAccount(userId: string) {
    const session = await auth();

    // Comprobación de seguridad: nos aseguramos de que el usuario que solicita el borrado es el que está logueado.
    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Obtener y eliminar dispositivos del usuario
        const devicesRes = await client.query("SELECT Dispositivo_id FROM DueñoDispositivo WHERE Usuario_id = $1", [userId]);
        const deviceIds = devicesRes.rows.map(r => r.dispositivo_id);
        if (deviceIds.length > 0) {
            await client.query("DELETE FROM Dispositivos WHERE id = ANY($1)", [deviceIds]);
        }

        // 2. Obtener y eliminar animales del usuario
        const animalsRes = await client.query("SELECT Animal_id FROM DueñoAnimal WHERE Usuario_id = $1", [userId]);
        const animalIds = animalsRes.rows.map(r => r.animal_id);
        if (animalIds.length > 0) {
            await client.query("DELETE FROM Animales WHERE id = ANY($1)", [animalIds]);
        }

        // 3. Eliminar el usuario (las relaciones restantes se borran por CASCADE)
        await client.query("DELETE FROM Usuarios WHERE id = $1", [userId]);

        await client.query('COMMIT');
        return { success: true };
    } catch (error: unknown) {
        await client.query('ROLLBACK');
        console.error("Error al dar de baja al usuario:", error);
        return { success: false, error: "Ocurrió un error al intentar eliminar la cuenta." };
    } finally {
        client.release();
    }
}

export async function updateUserProfile(userId: string, nombre: string, apellidos: string, email: string, metodoPago: string) {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        await pool.query(
            "UPDATE Usuarios SET nombre = $1, apellidos = $2, email = $3, metodo_pago = $4 WHERE id = $5",
            [nombre, apellidos, email, metodoPago, userId]
        );
        return { success: true };
    } catch (error: unknown) {
        const e = error as { code?: string };
        if (e.code === '23505') {
            return { success: false, error: "El email ya está registrado por otro usuario." };
        }
        console.error("Error al actualizar perfil:", e);
        console.error("Error al actualizar perfil:", error);
        return { success: false, error: "Error al actualizar el perfil." };
    }
}

export async function addAnimal(userId: string, nombre: string, tipo: string, especie: string, tamano: string, peso: string, estado: string) {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        // 1. Insertar el animal
        const insertResult = await pool.query(
            "INSERT INTO Animales (nombre, tipo, especie, tamaño, peso, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [nombre, tipo, especie, parseFloat(tamano) || 0, parseFloat(peso) || 0, estado]
        );
        const animalId = insertResult.rows[0].id;

        // 2. Asociar al dueño
        await pool.query(
            "INSERT INTO DueñoAnimal (Usuario_id, Animal_id) VALUES ($1, $2)",
            [userId, animalId]
        );

        return { success: true };
    } catch (error: unknown) {
        console.error("Error al añadir animal:", error);
        return { success: false, error: "Error al guardar el animal." };
    }
}

export async function updateAnimal(userId: string, animalId: string, nombre: string, tipo: string, especie: string, tamano: string, peso: string, estado: string) {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        // Verificar que el animal pertenece al usuario
        const checkOwner = await pool.query("SELECT 1 FROM DueñoAnimal WHERE Usuario_id = $1 AND Animal_id = $2", [userId, animalId]);
        if ((checkOwner.rowCount ?? 0) === 0) {
            return { success: false, error: "No se encontró el animal o no tienes permiso." };
        }

        await pool.query(
            "UPDATE Animales SET nombre = $1, tipo = $2, especie = $3, tamaño = $4, peso = $5, estado = $6 WHERE id = $7",
            [nombre, tipo, especie, parseFloat(tamano) || 0, parseFloat(peso) || 0, estado, animalId]
        );

        return { success: true };
    } catch (error: unknown) {
        console.error("Error al actualizar animal:", error);
        return { success: false, error: "Error al actualizar el animal." };
    }
}

export async function deleteAnimal(userId: string, animalId: string) {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        // Verificar que el animal pertenece al usuario antes de borrar
        const checkOwner = await pool.query("SELECT 1 FROM DueñoAnimal WHERE Usuario_id = $1 AND Animal_id = $2", [userId, animalId]);
        if ((checkOwner.rowCount ?? 0) === 0) {
            return { success: false, error: "No se encontró el animal o no tienes permiso." };
        }

        // Al borrar el animal, la restricción ON DELETE CASCADE de la base de datos
        // se encargará de borrar también la relación en DueñoAnimal.
        await pool.query("DELETE FROM Animales WHERE id = $1", [animalId]);
        return { success: true };
    } catch (error: unknown) {
        console.error("Error al eliminar animal:", error);
        return { success: false, error: "Error al eliminar el animal." };
    }
}

export async function inviteUser(currentUserId: string, emailToInvite: string) {
    const session = await auth();
    if (!session?.user || session.user.id !== currentUserId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        // 1. Buscar al usuario por email
        const userRes = await pool.query("SELECT id FROM Usuarios WHERE email = $1", [emailToInvite]);
        if ((userRes.rowCount ?? 0) === 0) {
            return { success: false, error: "El usuario con ese email no existe." };
        }
        const invitedUserId = userRes.rows[0].id;

        if (invitedUserId === currentUserId) {
             return { success: false, error: "No puedes invitarte a ti mismo." };
        }

        // 2. Verificar si ya está invitado
        const checkRes = await pool.query(
            "SELECT 1 FROM UsuariosInvitados WHERE Usuario_id = $1 AND Usuario_Invitado_id = $2",
            [currentUserId, invitedUserId]
        );
        if ((checkRes.rowCount ?? 0) > 0) {
            return { success: false, error: "Este usuario ya está invitado." };
        }

        // 3. Crear la invitación
        await pool.query(
            "INSERT INTO UsuariosInvitados (Usuario_id, Usuario_Invitado_id) VALUES ($1, $2)",
            [currentUserId, invitedUserId]
        );

        return { success: true };
    } catch (error: unknown) {
        console.error("Error al invitar usuario:", error);
        return { success: false, error: "Error al procesar la invitación." };
    }
}

export async function removeInvitation(currentUserId: string, invitedUserId: string) {
    const session = await auth();
    if (!session?.user || session.user.id !== currentUserId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        await pool.query(
            "DELETE FROM UsuariosInvitados WHERE Usuario_id = $1 AND Usuario_Invitado_id = $2",
            [currentUserId, invitedUserId]
        );
        return { success: true };
    } catch (error: unknown) {
        console.error("Error al eliminar invitación:", error);
        return { success: false, error: "Error al eliminar la invitación." };
    }
}

export async function addDevice(userId: string, alias: string, tipo: string, modelo: string, numeroSerie: string, estado: string, animalId: string, usuarioAsociadoId: string) {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        // 1. Insertar el dispositivo
        const insertResult = await pool.query(
            "INSERT INTO Dispositivos (alias, tipo, modelo, Numero_Serie, estado, usuario_asociado_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [alias, tipo, modelo, numeroSerie, estado, usuarioAsociadoId || null]
        );
        const dispositivoId = insertResult.rows[0].id;

        // 2. Asociar al dueño
        await pool.query(
            "INSERT INTO DueñoDispositivo (Usuario_id, Dispositivo_id) VALUES ($1, $2)",
            [userId, dispositivoId]
        );

        // 3. Asociar al animal si se seleccionó uno
        if (animalId) {
            await pool.query(
                "INSERT INTO DispositivoAnimal (Animal_id, Dispositivo_id) VALUES ($1, $2)",
                [animalId, dispositivoId]
            );
        }

        // 4. Actualizar rol de usuario a ADMINISTRADOR si no lo es
        await pool.query(
            "UPDATE Usuarios SET rol = 'ADMINISTRADOR' WHERE id = $1 AND rol != 'ADMINISTRADOR'",
            [userId]
        );

        return { success: true };
    } catch (error: unknown) {
        console.error("Error al añadir dispositivo:", error);
        return { success: false, error: "Error al guardar el dispositivo." };
    }
}

export async function updateDevice(userId: string, deviceId: string, alias: string, tipo: string, modelo: string, numeroSerie: string, estado: string, animalId: string, usuarioAsociadoId: string) {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        await pool.query(
            "UPDATE Dispositivos SET alias = $1, tipo = $2, modelo = $3, Numero_Serie = $4, estado = $5, usuario_asociado_id = $6 WHERE id = $7",
            [alias, tipo, modelo, numeroSerie, estado, usuarioAsociadoId || null, deviceId]
        );

        // Actualizar relación con animal (borrar anterior y crear nueva si aplica)
        await pool.query("DELETE FROM DispositivoAnimal WHERE Dispositivo_id = $1", [deviceId]);
        if (animalId) {
            await pool.query(
                "INSERT INTO DispositivoAnimal (Animal_id, Dispositivo_id) VALUES ($1, $2)",
                [animalId, deviceId]
            );
        }

        return { success: true };
    } catch (error: unknown) {
        console.error("Error al actualizar dispositivo:", error);
        return { success: false, error: "Error al actualizar el dispositivo." };
    }
}

export async function deleteDevice(userId: string, deviceId: string) {
    const session = await auth();
    if (!session?.user || session.user.id !== userId) return { success: false, error: "No autorizado." };

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Verificar que el usuario es el dueño del dispositivo antes de eliminar
        const checkOwner = await client.query("SELECT 1 FROM DueñoDispositivo WHERE Usuario_id = $1 AND Dispositivo_id = $2", [userId, deviceId]);
        if ((checkOwner.rowCount ?? 0) === 0) {
            await client.query('ROLLBACK');
            return { success: false, error: "No autorizado. Solo el dueño puede eliminar el dispositivo." };
        }

        // Contar dispositivos propios ANTES de borrar para determinar si es el último
        const countResult = await client.query("SELECT COUNT(*) FROM DueñoDispositivo WHERE Usuario_id = $1", [userId]);
        const deviceCount = parseInt(countResult.rows[0].count, 10);

        await client.query("DELETE FROM Dispositivos WHERE id = $1", [deviceId]);

        // Si el usuario tenía 1 o menos dispositivos propios (el que se está borrando), cambiar rol a USUARIO
        if (deviceCount <= 1) {
            await client.query("UPDATE Usuarios SET rol = 'USUARIO' WHERE id = $1", [userId]);
        }

        await client.query('COMMIT');
        return { success: true };
    } catch (error: unknown) {
        await client.query('ROLLBACK');
        console.error("Error al eliminar dispositivo:", error);
        return { success: false, error: "Error al eliminar dispositivo." };
    } finally {
        client.release();
    }
}

export async function saveDeviceServices(userId: string, deviceId: string, services: string[]) {
    const session = await auth();
    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        const checkOwner = await pool.query("SELECT 1 FROM DueñoDispositivo WHERE Usuario_id = $1 AND Dispositivo_id = $2", [userId, deviceId]);
        if ((checkOwner.rowCount ?? 0) === 0) {
             return { success: false, error: "No autorizado o dispositivo no encontrado." };
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query("DELETE FROM ServicioContratado WHERE dispositivo_id = $1", [deviceId]);

            if (services.length > 0) {
                const servicesRes = await client.query("SELECT id FROM Servicios WHERE tipo = ANY($1)", [services]);
                for (const row of servicesRes.rows) {
                    await client.query(
                        "INSERT INTO ServicioContratado (dispositivo_id, servicio_id, estadoContratacion) VALUES ($1, $2, 'ACTIVO')",
                        [deviceId, row.id]
                    );
                }
            }
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
        return { success: true };
    } catch (error: unknown) {
        console.error("Error al guardar servicios:", error);
        return { success: false, error: "Error al guardar los servicios." };
    }
}

export async function saveIoTData(deviceId: string, services: string[], values: number[]) {
    const session = await auth();
    if (!session?.user) return { success: false, error: "No autorizado" };

    let tipoDato = "GENERICO";
    const s = new Set(services || []);

    if (s.has("SEGUIMIENTO CARDIACO Y RESPIRATORIO")) tipoDato = "RITMO_CARDIACO";
    else if (s.has("CONTROL TEMPERATURA") || s.has("CLIMATIZACION")) tipoDato = "TEMPERATURA";
    else if (s.has("NIVEL ACTIVIDAD") || s.has("MEDICIONES ACTIVIDAD Y SUEÑO")) tipoDato = "ACTIVIDAD";
    else if (s.has("ALERTA LADRIDO")) tipoDato = "NIVEL_RUIDO";
    else if (s.has("CONTROL CALIDAD AGUA")) tipoDato = "CALIDAD_AGUA";
    else if (s.has("PATRONES RUMIA")) tipoDato = "RUMIA";
    else if (s.has("INGESTA ALIMENTOS")) tipoDato = "INGESTA";
    else if (s.has("LOCALIZACION GPS") || s.has("LOCALIZACION Y ALERTA ANTIFUGA")) tipoDato = "DISTANCIA";
    else if (services && services.length > 0) {
        tipoDato = services[0].replace(/\s+/g, '_').toUpperCase(); // Fallback al nombre del servicio
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Insertar datos en lote y asociarlos
        await client.query(`
            WITH inserted_data AS (
                INSERT INTO DatosIoT (tipodato, valor)
                SELECT $1, unnest($2::numeric[])
                RETURNING id
            )
            INSERT INTO DatosIotDispositivo (Dispositivo_id, DatosIot_id)
            SELECT $3, id FROM inserted_data
        `, [tipoDato, values, deviceId]);

        await client.query('COMMIT');
        return { success: true };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error saving IoT data:", error);
        return { success: false, error: "Error al guardar datos IoT" };
    } finally {
        client.release();
    }
}
