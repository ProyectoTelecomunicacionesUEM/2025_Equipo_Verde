-- user demo: email usuario_admin@mypetplan.es / password: Demo123!
INSERT INTO Usuarios (email, password_hash, nombre, apellidos, rol, metodo_pago, estado)
VALUES (
  'usuario_admin@mypetplan.es',
  '$2y$10$KuLzZ3DJ4oO50z2bToFU6u5rGskxJUOl6wGvyIr5L7EnMYLTZp0sG', -- bcrypt de "Demo123!"
  'Admin User', 'Admin', 'ADMINISTRADOR', 'TARJETA', 'ACTIVO'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    nombre = EXCLUDED.nombre,
    apellidos = EXCLUDED.apellidos,
    rol = EXCLUDED.rol,
    metodo_pago = EXCLUDED.metodo_pago,
    estado = EXCLUDED.estado;

    -- user demo: email usuario_normal@mypetplan.es / password: usuario_normal345
INSERT INTO Usuarios (email, password_hash, nombre, apellidos, rol, metodo_pago, estado)
VALUES (
  'usuario_normal@mypetplan.es',
  '$2a$12$I0WpXEoypzTOLtgWm1gc9uJQiC3Syr8hzY5y83ThMnTl8cLql6sVy', -- bcrypt de "usuario_normal345"
  'normal User', 'Normal', 'USUARIO', 'TARJETA', 'ACTIVO'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    nombre = EXCLUDED.nombre,
    apellidos = EXCLUDED.apellidos,
    rol = EXCLUDED.rol,
    metodo_pago = EXCLUDED.metodo_pago,
    estado = EXCLUDED.estado;

-- Opcional: categorías demo para el usuario demo (reemplaza USER_ID en tiempo de seed si quieres)
