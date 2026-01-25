-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Usuarios de la app (auth local con email/password hash)
CREATE TABLE IF NOT EXISTS Usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO','INACTIVO')),
  rol TEXT NOT NULL DEFAULT 'USUARIO' CHECK (rol IN ('USUARIO','ADMINISTRADOR')),
  metodo_pago TEXT NOT NULL DEFAULT 'TARJETA' CHECK (metodo_pago IN ('TARJETA', 'TRANSFERENCIA')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Animales de la app
CREATE TABLE IF NOT EXISTS Animales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'MASCOTA' CHECK (tipo IN ('MASCOTA','GRANJA','EXOTICO','SALVAJE')),
  especie TEXT NOT NULL DEFAULT 'PERRO' CHECK (especie IN ('PERRO','GATO','PEZ','REPTIL','PAJARO','PEQUEÑOMAMIFERO','VACA','OVEJA','CERDO')),
  tamaño NUMERIC(4,2)  NOT NULL DEFAULT 0.00,
  peso NUMERIC(4,2)  NOT NULL DEFAULT 00.00,
  estado TEXT NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO','INACTIVO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dispositivos de la app
CREATE TABLE IF NOT EXISTS Dispositivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL DEFAULT 'COLLAR' CHECK (tipo IN ('COLLAR','TERMOMETRO','ANILLO','BOTON','SENSOR','OTRO')),
  modelo TEXT NOT NULL DEFAULT '1.0',
  estado TEXT NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO','INACTIVO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Servicios del dispositivo
CREATE TABLE IF NOT EXISTS Servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL DEFAULT 'SEGUIMIENTO CARDIACO Y RESPIRATORIO' CHECK (tipo IN ('SEGUIMIENTO CARDIACO Y RESPIRATORIO','ALERTA LADRIDO','NIVEL ACTIVIDAD','MEDICIONES ACTIVIDAD Y SUEÑO','LOCALIZACION Y ALERTA ANTIFUGA','CLIMATIZACION','IDENTIFICACION RFID','LOCALIZACION GPS','CONTROL TEMPERATURA','CONTROL CALIDAD AGUA','PATRONES RUMIA','INGESTA ALIMENTOS','ALERTA MASTITIS BOVINA','ALERTA PARTO','ESPECIALIZADO','TODOS','OTRO')),
  descripcion TEXT NOT NULL DEFAULT '1.0',
  precio NUMERIC(8,2)  NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- DatosIoT del dispositivo
CREATE TABLE IF NOT EXISTS DatosIoT (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipodato TEXT NOT NULL,
  valor NUMERIC(10,2)  NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Servicio Contratado
CREATE TABLE IF NOT EXISTS ServicioContratado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispositivo_id UUID NOT NULL REFERENCES Dispositivos(id) ON DELETE CASCADE,
  servicio_id UUID NOT NULL REFERENCES Servicios(id) ON DELETE CASCADE,
  estadoContratacion TEXT NOT NULL DEFAULT 'CANCELADO' CHECK (estadoContratacion IN ('CANCELADO','ACTIVO')),
  fechaAlta TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dueño de Animales
CREATE TABLE IF NOT EXISTS DueñoAnimal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  Usuario_id UUID NOT NULL REFERENCES Usuarios(id) ON DELETE CASCADE,
  Animal_id UUID NOT NULL REFERENCES Animales(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dispositivo de animales 
CREATE TABLE IF NOT EXISTS DispositivoAnimal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  Animal_id UUID NOT NULL REFERENCES Animales(id) ON DELETE CASCADE,
  Dispositivo_id UUID NOT NULL REFERENCES Dispositivos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Datos IOT de Dispositivo 
CREATE TABLE IF NOT EXISTS DatosIotDispositivo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  Dispositivo_id UUID NOT NULL REFERENCES Dispositivos(id) ON DELETE CASCADE,
  DatosIot_id UUID NOT NULL REFERENCES DatosIoT(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_dueno_animal_usuario ON DueñoAnimal(Usuario_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dispositivo_animal_relacion ON DispositivoAnimal(Animal_id, Dispositivo_id);

-- Índices para optimización de Animales
CREATE INDEX IF NOT EXISTS idx_animales_tipo ON Animales(tipo);
CREATE INDEX IF NOT EXISTS idx_animales_especie ON Animales(especie);
CREATE INDEX IF NOT EXISTS idx_animales_estado ON Animales(estado);
CREATE INDEX IF NOT EXISTS idx_animales_tipo_estado ON Animales(tipo, estado);
