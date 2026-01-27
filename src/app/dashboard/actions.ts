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
    } catch (e: any) {
        console.error("Error al dar de baja al usuario:", e);
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
    } catch (e: any) {
        if (e.code === '23505') {
            return { success: false, error: "El email ya está registrado por otro usuario." };
        }
        console.error("Error al actualizar perfil:", e);
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
    } catch (e: any) {
        console.error("Error al añadir animal:", e);
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
        if (checkOwner.rowCount === 0) {
            return { success: false, error: "No se encontró el animal o no tienes permiso." };
        }

        await pool.query(
            "UPDATE Animales SET nombre = $1, tipo = $2, especie = $3, tamaño = $4, peso = $5, estado = $6 WHERE id = $7",
            [nombre, tipo, especie, parseFloat(tamano) || 0, parseFloat(peso) || 0, estado, animalId]
        );

        return { success: true };
    } catch (e: any) {
        console.error("Error al actualizar animal:", e);
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
    } catch (e: any) {
        console.error("Error al eliminar animal:", e);
        return { success: false, error: "Error al eliminar el animal." };
    }
}
