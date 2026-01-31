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

-- RELLENO BASE DE DATOS DE SERVICIOS
INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'SEGUIMIENTO CARDIACO Y RESPIRATORIO',
  'Seguimiento de los cambios respiratorios y cardiacos del animal',
  '5.50'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'ALERTA LADRIDO',
  'Monitorización y alerta de ladridos excesivos',
  '3.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'NIVEL ACTIVIDAD',
  'Medición del nivel de actividad física diaria',
  '4.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'MEDICIONES ACTIVIDAD Y SUEÑO',
  'Análisis de patrones de actividad y calidad del sueño',
  '4.50'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'LOCALIZACION Y ALERTA ANTIFUGA',
  'Rastreo GPS y alertas si el animal sale de zona segura',
  '6.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'CLIMATIZACION',
  'Control y monitoreo de la temperatura ambiental',
  '5.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'IDENTIFICACION RFID',
  'Identificación electrónica mediante tecnología RFID',
  '2.50'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'LOCALIZACION GPS',
  'Ubicación en tiempo real mediante GPS',
  '5.50'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'CONTROL TEMPERATURA',
  'Medición constante de la temperatura corporal o ambiental',
  '3.50'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'CONTROL CALIDAD AGUA',
  'Análisis de parámetros de calidad del agua',
  '7.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'PATRONES RUMIA',
  'Monitorización de los ciclos de rumia en ganado',
  '6.50'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'INGESTA ALIMENTOS',
  'Control de la cantidad y frecuencia de alimentación',
  '4.50'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'ALERTA MASTITIS BOVINA',
  'Detección temprana de signos de mastitis',
  '8.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'ALERTA PARTO',
  'Monitorización y aviso ante inicio de parto',
  '9.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'ESPECIALIZADO',
  'Servicios personalizados según necesidades específicas',
  '10.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'TODOS',
  'Paquete completo con todos los servicios disponibles',
  '25.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;

INSERT INTO Servicios (tipo, descripcion, precio)
VALUES (
  'OTRO',
  'Otros servicios no categorizados',
  '5.00'
)
ON CONFLICT (tipo) DO UPDATE
SET tipo = EXCLUDED.tipo,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio;
    