'use server';

import { pool } from "@/lib/db";
import { auth } from "@/auth";

export async function deleteUserAccount(userId: string) {
    const session = await auth();

    // Comprobación de seguridad: nos aseguramos de que el usuario que solicita el borrado es el que está logueado.
    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        await pool.query(
            "DELETE FROM Usuarios WHERE id = $1",
            [userId]
        );

        return { success: true };
    } catch (error: unknown) {
        console.error("Error al dar de baja al usuario:", error);
        return { success: false, error: "Ocurrió un error al intentar eliminar la cuenta." };
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

export async function addDevice(userId: string, alias: string, tipo: string, modelo: string, numeroSerie: string, estado: string, animalId: string) {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        // 1. Insertar el dispositivo
        const insertResult = await pool.query(
            "INSERT INTO Dispositivos (alias, tipo, modelo, Numero_Serie, estado) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [alias, tipo, modelo, numeroSerie, estado]
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

        return { success: true };
    } catch (error: unknown) {
        console.error("Error al añadir dispositivo:", error);
        return { success: false, error: "Error al guardar el dispositivo." };
    }
}

export async function updateDevice(userId: string, deviceId: string, alias: string, tipo: string, modelo: string, numeroSerie: string, estado: string, animalId: string) {
    const session = await auth();

    if (!session?.user || session.user.id !== userId) {
        return { success: false, error: "No autorizado." };
    }

    try {
        await pool.query(
            "UPDATE Dispositivos SET alias = $1, tipo = $2, modelo = $3, Numero_Serie = $4, estado = $5 WHERE id = $6",
            [alias, tipo, modelo, numeroSerie, estado, deviceId]
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

    try {
        await pool.query("DELETE FROM Dispositivos WHERE id = $1", [deviceId]);
        return { success: true };
    } catch (error: unknown) {
        console.error("Error al eliminar dispositivo:", error);
        return { success: false, error: "Error al eliminar dispositivo." };
    }
}
