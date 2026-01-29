'use server';

import { pool } from "@/lib/db";
import { hash } from "@node-rs/bcrypt";

export async function registerUser(
    nombre: string,
    apellidos: string,
    email: string,
    password: string,
) {
    // Validación básica
    if (!nombre || !apellidos || !email || !password) {
        return { success: false, error: "Todos los campos son obligatorios." };
    }

    try {
        // 1. Encriptar la contraseña (costo 10 es el estándar recomendado)
        const hashedPassword = await hash(password, 10);

        // 2. Insertar en la base de datos
        // Los campos id, estado, rol y created_at se llenarán con sus DEFAULTs
        await pool.query(
            "INSERT INTO Usuarios (nombre, apellidos, email, password_hash) VALUES ($1, $2, $3, $4)",
            [nombre, apellidos, email, hashedPassword]
        );

        return { success: true };
    } catch (e: any) {
        // Manejo de error si el email ya existe (código 23505 en PostgreSQL)
        if (e.code === '23505') {
            return { success: false, error: "Este email ya está registrado." };
        }
        console.error("Error en registro:", e);
        return { success: false, error: "Ocurrió un error al registrar el usuario." };
    }
}
