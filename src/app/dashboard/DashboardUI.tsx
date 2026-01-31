"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChartLine, FaPaw, FaUser, FaRightFromBracket, FaTrash, FaPen, FaMicrochip, FaCow, FaUsers, FaCheck, FaFileInvoiceDollar } from "react-icons/fa6";
import { GiTigerHead, GiSnake } from "react-icons/gi";
import { signOut } from "next-auth/react";
import { deleteUserAccount, updateUserProfile, addAnimal, updateAnimal, deleteAnimal, inviteUser, removeInvitation, addDevice, updateDevice, deleteDevice, saveDeviceServices, saveIoTData } from "./actions";

interface User {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  metodo_pago: string;
  rol: string;
  estado: string;
}

interface Animal {
  id: string;
  nombre: string;
  tipo: string;
  especie: string;
  tamaño: string;
  peso: string;
  estado: string;
  is_owner?: boolean;
}

interface Device {
  id: string;
  alias: string;
  tipo: string;
  modelo: string;
  numero_serie: string;
  estado: string;
  animal_id?: string;
  animal_nombre?: string;
  usuario_asociado_id?: string;
  usuario_asociado_nombre?: string;
  servicios_contratados?: string[];
  is_owner?: boolean;
}

interface InvitedUser {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  estado: string;
  dispositivos_asociados?: string[];
}

export default function DashboardUI({ user, animales, invitedUsers = [], dispositivos = [] }: { user: User, animales: Animal[], invitedUsers?: InvitedUser[], dispositivos?: Device[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState(searchParams.get("section") || "resumen");
  
  // Estados para los campos editables
  const [nombre, setNombre] = useState(user.nombre);
  const [apellidos, setApellidos] = useState(user.apellidos);
  const [email, setEmail] = useState(user.email);
  const [metodoPago, setMetodoPago] = useState(user.metodo_pago);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para añadir animal
  const [showAddAnimalForm, setShowAddAnimalForm] = useState(false);
  const [editingAnimalId, setEditingAnimalId] = useState<string | null>(null);
  const [newAnimal, setNewAnimal] = useState({
    nombre: "",
    tipo: "MASCOTA",
    especie: "PERRO",
    tamano: "",
    peso: "",
    estado: "ACTIVO"
  });

  // Estados para invitar usuario
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Estados para añadir dispositivo
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [activeServiceMenu, setActiveServiceMenu] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    dispositivos.forEach(d => {
        if (d.servicios_contratados) {
            initial[d.id] = d.servicios_contratados;
        }
    });
    return initial;
  });
  const [newDevice, setNewDevice] = useState({
    alias: "Dispositivo1",
    tipo: "COLLAR",
    modelo: "1.0",
    numeroSerie: "ESXXXXXXXXXX",
    animalId: "",
    usuarioAsociadoId: "",
    estado: "ACTIVO"
  });

  // Estados para gráficas de resumen
  // Estructura: deviceId -> serviceName -> data[]
  const [deviceMeasurements, setDeviceMeasurements] = useState<Record<string, Record<string, { value: number, date: string }[]>>>({});
  const [selectedServiceMap, setSelectedServiceMap] = useState<Record<string, string>>({});

  const getServiceLabel = (service: string) => {
    switch (service) {
        case "SEGUIMIENTO CARDIACO Y RESPIRATORIO": return "Ritmo (bpm)";
        case "CONTROL TEMPERATURA":
        case "CLIMATIZACION": return "Temp (°C)";
        case "NIVEL ACTIVIDAD":
        case "MEDICIONES ACTIVIDAD Y SUEÑO": return "Actividad";
        case "ALERTA LADRIDO": return "Ruido (dB)";
        case "CONTROL CALIDAD AGUA": return "Calidad";
        case "PATRONES RUMIA": return "Rumia";
        case "INGESTA ALIMENTOS": return "Ingesta";
        case "LOCALIZACION GPS":
        case "LOCALIZACION Y ALERTA ANTIFUGA": return "Distancia (m)";
        case "IDENTIFICACION RFID": return "Proximidad";
        default: return "Valor";
    }
  };

  useEffect(() => {
    if (activeSection === "resumen") {
        const measurements: Record<string, Record<string, { value: number, date: string }[]>> = {};
        const now = new Date();

        dispositivos.forEach(d => {
            if (!d.animal_id) return;

            measurements[d.id] = {};
            
            // Determinar qué servicios graficar
            let servicesToGraph = d.servicios_contratados?.filter(s => getServiceLabel(s) !== "Valor") || [];
            if (servicesToGraph.length === 0) servicesToGraph = ["GENERICO"];

            servicesToGraph.forEach(service => {
                // Generación de datos suavizada (Random Walk) para evitar picos bruscos
                const data: { value: number, date: string }[] = [];
                let currentValue = Math.floor(Math.random() * 60) + 20; // Valor inicial centrado (20-80)
                
                for (let i = 0; i < 100; i++) {
                    const change = Math.floor(Math.random() * 11) - 5; // Variación pequeña (-5 a +5)
                    currentValue = Math.max(0, Math.min(100, currentValue + change));
                    
                    // Simular fechas: 100 puntos, uno cada 4 horas hacia atrás
                    const timeOffset = (99 - i) * 4 * 60 * 60 * 1000;
                    const date = new Date(now.getTime() - timeOffset);
                    const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
                    
                    data.push({ value: currentValue, date: dateStr });
                }
                measurements[d.id][service] = data;
                
                // Guardar datos simulados (usamos un array con el servicio actual para que saveIoTData detecte el tipo correcto)
                saveIoTData(d.id, [service], data.map(d => d.value));
            });
        });
        setDeviceMeasurements(measurements);
    }
  }, [activeSection, dispositivos]);

  // Colores pastel distintos y visibles
  const chartColors = ["#FF6961", "#77DD77", "#54A0FF", "#FFB347", "#B19CD9", "#FF9688", "#00D2D3", "#FDCB6E"];

  const SERVICE_PRICES: Record<string, number> = {
    'SEGUIMIENTO CARDIACO Y RESPIRATORIO': 5.50,
    'ALERTA LADRIDO': 3.00,
    'NIVEL ACTIVIDAD': 4.00,
    'MEDICIONES ACTIVIDAD Y SUEÑO': 4.50,
    'LOCALIZACION Y ALERTA ANTIFUGA': 6.00,
    'CLIMATIZACION': 5.00,
    'IDENTIFICACION RFID': 2.50,
    'LOCALIZACION GPS': 5.50,
    'CONTROL TEMPERATURA': 3.50,
    'CONTROL CALIDAD AGUA': 7.00,
    'PATRONES RUMIA': 6.50,
    'INGESTA ALIMENTOS': 4.50,
    'ALERTA MASTITIS BOVINA': 8.00,
    'ALERTA PARTO': 9.00,
    'ESPECIALIZADO': 10.00,
    'TODOS': 25.00,
    'OTRO': 5.00
  };

  const speciesOptions: Record<string, { value: string; label: string }[]> = {
    MASCOTA: [
        { value: "PERRO", label: "Perro" },
        { value: "GATO", label: "Gato" }
    ],
    GRANJA: [
        { value: "VACA", label: "Vaca" },
        { value: "OVEJA", label: "Oveja" },
        { value: "CERDO", label: "Cerdo" }
    ],
    EXOTICO: [
        { value: "PEZ", label: "Pez" },
        { value: "REPTIL", label: "Reptil" }
    ],
    SALVAJE: [
        { value: "PEQUEÑOMAMIFERO", label: "Pequeño Mamífero" }
    ]
  };

  const menuItems = [
    { id: "resumen", label: "Resumen", icon: FaChartLine },
    { id: "animales", label: "Mis Animales", icon: FaPaw },
    { id: "dispositivos", label: "Mis Dispositivos", icon: FaMicrochip },
    { id: "servicios", label: "Mis Servicios", icon: FaFileInvoiceDollar },
    { id: "usuarios", label: "Usuarios Asociados", icon: FaUsers },
    { id: "perfil", label: "Mi Perfil", icon: FaUser },
  ];

  async function handleDeleteAccount() {
    if (window.confirm("¿Estás seguro de que quieres dar de baja tu cuenta? Esta acción es irreversible y eliminará todos tus datos.")) {
      const result = await deleteUserAccount(user.id);
      if (result.success) {
        alert("Tu cuenta ha sido eliminada.");
        await signOut({ callbackUrl: "/" });
      } else {
        alert(`Error al eliminar la cuenta: ${result.error}`);
      }
    }
  }

  async function handleSaveProfile() {
    setIsSaving(true);
    const result = await updateUserProfile(user.id, nombre, apellidos, email, metodoPago);
    setIsSaving(false);
    
    if (result.success) {
        alert("Perfil actualizado correctamente.");
        router.refresh(); // Actualiza los datos en pantalla (ej. el saludo "Hola, Nombre")
    } else {
        alert(result.error);
    }
  }

  async function handleSaveAnimal(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    let result;
    if (editingAnimalId) {
        result = await updateAnimal(
            user.id,
            editingAnimalId,
            newAnimal.nombre,
            newAnimal.tipo,
            newAnimal.especie,
            newAnimal.tamano,
            newAnimal.peso,
            newAnimal.estado
        );
    } else {
        result = await addAnimal(
            user.id, 
            newAnimal.nombre, 
            newAnimal.tipo, 
            newAnimal.especie, 
            newAnimal.tamano, 
            newAnimal.peso, 
            newAnimal.estado
        );
    }

    setIsSaving(false);

    if (result.success) {
        alert("Animal añadido correctamente.");
        setShowAddAnimalForm(false);
        setNewAnimal({
            nombre: "",
            tipo: "MASCOTA",
            especie: "PERRO",
            tamano: "",
            peso: "",
            estado: "ACTIVO"
        });
        setEditingAnimalId(null);
        router.refresh();
    } else {
        alert(result.error);
    }
  }

  async function handleDeleteAnimal() {
    if (!editingAnimalId) return;
    
    if (window.confirm("¿Estás seguro de que quieres eliminar este animal de la base de datos?")) {
        setIsSaving(true);
        const result = await deleteAnimal(user.id, editingAnimalId);
        setIsSaving(false);

        if (result.success) {
            setShowAddAnimalForm(false);
            setEditingAnimalId(null);
            setNewAnimal({ nombre: "", tipo: "MASCOTA", especie: "PERRO", tamano: "", peso: "", estado: "ACTIVO" });
            router.refresh();
        } else {
            alert(result.error);
        }
    }
  }

  async function handleDeleteAnimalById(animalId: string) {
    if (window.confirm("¿Estás seguro de que quieres eliminar este animal de la base de datos?")) {
        setIsSaving(true);
        const result = await deleteAnimal(user.id, animalId);
        setIsSaving(false);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.error);
        }
    }
  }

  function startEditing(animal: Animal) {
    setNewAnimal({
        nombre: animal.nombre,
        tipo: animal.tipo,
        especie: animal.especie,
        tamano: animal.tamaño,
        peso: animal.peso,
        estado: animal.estado
    });
    setEditingAnimalId(animal.id);
    setShowAddAnimalForm(true);
  }

  function startAdding() {
    setEditingAnimalId(null);
    setNewAnimal({ nombre: "", tipo: "MASCOTA", especie: "PERRO", tamano: "", peso: "", estado: "ACTIVO" });
    setShowAddAnimalForm(true);
  }

  async function handleInviteUser(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    const result = await inviteUser(user.id, inviteEmail);
    setIsSaving(false);

    if (result.success) {
        alert("Usuario invitado correctamente.");
        setShowInviteForm(false);
        setInviteEmail("");
        router.refresh();
    } else {
        alert(result.error);
    }
  }

  async function handleRemoveInvitation(invitedUserId: string) {
      if (window.confirm("¿Estás seguro de que quieres eliminar esta invitación?")) {
          setIsSaving(true);
          const result = await removeInvitation(user.id, invitedUserId);
          setIsSaving(false);

          if (result.success) {
              router.refresh();
          } else {
              alert(result.error);
          }
      }
  }

  async function handleSaveDevice(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    let result;
    if (editingDeviceId) {
        result = await updateDevice(
            user.id,
            editingDeviceId,
            newDevice.alias,
            newDevice.tipo,
            newDevice.modelo,
            newDevice.numeroSerie,
            newDevice.estado,
            newDevice.animalId,
            newDevice.usuarioAsociadoId
        );
    } else {
        result = await addDevice(
            user.id,
            newDevice.alias,
            newDevice.tipo,
            newDevice.modelo,
            newDevice.numeroSerie,
            newDevice.estado,
            newDevice.animalId,
            newDevice.usuarioAsociadoId
        );
    }
    setIsSaving(false);

    if (result.success) {
        setShowAddDeviceForm(false);
        setEditingDeviceId(null);
        setNewDevice({
            alias: "Dispositivo1",
            tipo: "COLLAR",
            modelo: "1.0",
            numeroSerie: "ESXXXXXXXXXX",
            animalId: "",
            usuarioAsociadoId: "",
            estado: "ACTIVO"
        });
        router.refresh();
    } else {
        alert(result.error);
    }
  }

  async function handleDeleteDevice() {
    if (!editingDeviceId) return;
    if (window.confirm("¿Estás seguro de que quieres eliminar este dispositivo?")) {
        setIsSaving(true);
        const result = await deleteDevice(user.id, editingDeviceId);
        setIsSaving(false);
        if (result.success) {
            setShowAddDeviceForm(false);
            setEditingDeviceId(null);
            setNewDevice({ alias: "Dispositivo1", tipo: "COLLAR", modelo: "1.0", numeroSerie: "ESXXXXXXXXXX", animalId: "", usuarioAsociadoId: "", estado: "ACTIVO" });
            router.refresh();
        } else {
            alert(result.error);
        }
    }
  }

  async function handleDeleteDeviceById(deviceId: string) {
    if (window.confirm("¿Estás seguro de que quieres eliminar este dispositivo?")) {
        setIsSaving(true);
        const result = await deleteDevice(user.id, deviceId);
        setIsSaving(false);
        if (result.success) {
            router.refresh();
        } else {
            alert(result.error);
        }
    }
  }

  function startEditingDevice(device: Device) {
    setNewDevice({
        alias: device.alias,
        tipo: device.tipo,
        modelo: device.modelo,
        numeroSerie: device.numero_serie,
        estado: device.estado,
        animalId: device.animal_id || "",
        usuarioAsociadoId: device.usuario_asociado_id || ""
    });
    setEditingDeviceId(device.id);
    setShowAddDeviceForm(true);
  }

  function startAddingDevice() {
    setEditingDeviceId(null);
    setNewDevice({
        alias: "Dispositivo1", tipo: "COLLAR", modelo: "1.0", numeroSerie: "ESXXXXXXXXXX", animalId: "", usuarioAsociadoId: "", estado: "ACTIVO"
    });
    setShowAddDeviceForm(true);
  }

  const getServicesForDevice = (deviceType: string) => {
    const common = ["TODOS"];
    switch (deviceType) {
        case "COLLAR":
            return ["SEGUIMIENTO CARDIACO Y RESPIRATORIO", "ALERTA LADRIDO", "MEDICIONES ACTIVIDAD Y SUEÑO", "LOCALIZACION Y ALERTA ANTIFUGA", ...common];
        case "TERMOMETRO":
            return ["CLIMATIZACION", ...common];
        case "ANILLO":
        case "BOTON":
            return ["IDENTIFICACION RFID", "LOCALIZACION GPS", "NIVEL ACTIVIDAD", ...common];
        case "SENSOR":
            return ["CONTROL TEMPERATURA", "CONTROL CALIDAD AGUA", "MEDICIONES ACTIVIDAD Y SUEÑO", "SEGUIMIENTO CARDIACO Y RESPIRATORIO", "LOCALIZACION Y ALERTA ANTIFUGA", ...common];
        case "OTRO":
            return ["LOCALIZACION Y ALERTA ANTIFUGA", "SEGUIMIENTO CARDIACO Y RESPIRATORIO", "MEDICIONES ACTIVIDAD Y SUEÑO", "PATRONES RUMIA", "INGESTA ALIMENTOS", "ALERTA MASTITIS BOVINA", "ALERTA PARTO", "ESPECIALIZADO", "OTRO", ...common];
        default:
            return common;
    }
  };

  const handleToggleService = (deviceId: string, service: string) => {
    setSelectedServices(prev => {
        const current = prev[deviceId] || [];
        
        if (service === "TODOS") {
            // Si se selecciona TODOS, se limpia el resto. Si ya estaba, se quita.
            return { ...prev, [deviceId]: current.includes("TODOS") ? [] : ["TODOS"] };
        } else {
            // Si se selecciona un servicio específico
            let newSelection = [...current];
            // Si TODOS estaba seleccionado, se quita para permitir la selección específica
            if (newSelection.includes("TODOS")) {
                newSelection = [];
            }
            if (newSelection.includes(service)) {
                newSelection = newSelection.filter(s => s !== service);
            } else {
                newSelection.push(service);
            }
            return { ...prev, [deviceId]: newSelection };
        }
    });
  };

  const handleHireServices = async (deviceId: string) => {
    const currentServices = selectedServices[deviceId] || [];
    const device = dispositivos.find(d => d.id === deviceId);
    const originalServices = device?.servicios_contratados || [];
    
    const result = await saveDeviceServices(user.id, deviceId, currentServices);
    
    if (result.success) {
        const added = currentServices.filter(s => !originalServices.includes(s));
        const removed = originalServices.filter(s => !currentServices.includes(s));

        if (removed.length > 0 && added.length === 0) {
            alert("El servicio se ha dado de baja.");
        } else if (added.length > 0 && removed.length === 0) {
            alert("Los servicios marcados han sido contratados correctamente.");
        } else {
            alert("Los cambios de servicios se han guardado correctamente.");
        }
        router.refresh();
        setActiveServiceMenu(null);
    } else {
        alert("Hubo un error al contratar los servicios.");
    }
  };

  const handleServiceMenuClick = (deviceId: string) => {
    if (activeServiceMenu === deviceId) {
        setActiveServiceMenu(null);
    } else {
        setActiveServiceMenu(deviceId);
    }
  };

  const totalServices = dispositivos.reduce((acc, device) => {
    if (device.is_owner) {
      return acc + (device.servicios_contratados?.length || 0);
    }
    return acc;
  }, 0);

  const totalCost = dispositivos.reduce((acc, device) => {
    if (device.is_owner && device.servicios_contratados) {
        return acc + device.servicios_contratados.reduce((sum, s) => sum + (SERVICE_PRICES[s] || 0), 0);
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen pt-28 md:pt-40 bg-gray-50 pb-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar (Menú izquierdo) */}
        <aside className="w-full md:w-64 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hidden md:flex flex-col justify-between min-h-[600px]">
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6 px-2 text-gray-800">Panel de Control</h2>
            <nav className="space-y-3">
              {menuItems.map((item) => {
                const isDisabled = (item.id === "usuarios" && user.rol !== "ADMINISTRADOR") || (item.id === "servicios" && totalServices === 0);
                return (
                  <button
                    key={item.id}
                    onClick={() => !isDisabled && setActiveSection(item.id)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-full font-semibold transition-colors text-sm ${
                      activeSection === item.id
                        ? "bg-primary text-black hover:bg-primary-accent shadow-sm"
                        : isDisabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="text-lg" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="space-y-1">
            <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center gap-2 text-gray-500 hover:text-red-600 px-4 py-2 transition-colors text-sm font-medium rounded-lg hover:bg-red-50"
            >
                <FaTrash /> Dar de baja mi usuario
            </button>
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-2 text-gray-500 hover:text-gray-800 px-4 py-2 transition-colors text-sm font-medium rounded-lg hover:bg-gray-100"
            >
                <FaRightFromBracket /> Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Contenido Derecho */}
        <main className="flex-1">
            {/* Menú móvil (visible solo en pantallas pequeñas) */}
            <div className="md:hidden mb-6 flex gap-2 overflow-x-auto pb-2">
                 {menuItems.map((item) => {
                    const isDisabled = (item.id === "usuarios" && user.rol !== "ADMINISTRADOR") || (item.id === "servicios" && totalServices === 0);
                    return (
                      <button
                        key={item.id}
                        onClick={() => !isDisabled && setActiveSection(item.id)}
                        disabled={isDisabled}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                            activeSection === item.id
                            ? "bg-primary text-black"
                            : isDisabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : "bg-white border border-gray-200 text-gray-600"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                })}
            </div>

            {/* Área de Acciones/Contenido */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm min-h-[600px]">
                {activeSection === "resumen" && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold">Hola, {user.nombre}</h1>
                        <p className="text-gray-600">Bienvenido a tu panel de control. Aquí tienes un resumen de tu actividad.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-5 bg-orange-50 rounded-xl border border-orange-100">
                                <h3 className="font-semibold text-orange-800">Dispositivos</h3>
                                <p className="text-3xl font-bold text-orange-900 mt-2">{dispositivos.length}</p>
                            </div>
                            <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                                <h3 className="font-semibold text-green-800">Animales</h3>
                                <p className="text-3xl font-bold text-green-900 mt-2">{animales.length}</p>
                            </div>
                            <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                                <h3 className="font-semibold text-purple-800">Mis Servicios</h3>
                                <p className="text-3xl font-bold text-purple-900 mt-2">{totalServices}</p>
                            </div>
                            <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                                <h3 className="font-semibold text-blue-800">Costo Mensual</h3>
                                <p className="text-3xl font-bold text-blue-900 mt-2">{totalCost.toFixed(2)} €</p>
                            </div>
                        </div>

                        {/* Gráficas de actividad */}
                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Monitorización en Tiempo Real</h3>
                            {dispositivos.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {dispositivos.map((device, index) => {
                                        // Determinar servicios disponibles para graficar
                                        let servicesToGraph = device.servicios_contratados?.filter(s => getServiceLabel(s) !== "Valor") || [];
                                        if (servicesToGraph.length === 0) servicesToGraph = ["GENERICO"];

                                        const selectedService = selectedServiceMap[device.id] || servicesToGraph[0];
                                        const data = deviceMeasurements[device.id]?.[selectedService] || [];
                                        
                                        const color = chartColors[index % chartColors.length];
                                        const yLabel = getServiceLabel(selectedService);
                                        
                                        const points = data.length > 0 ? data.map((item, i) => {
                                            const x = 35 + (i / 99) * 365;
                                            const y = 180 - (item.value / 100) * 160;
                                            return `${x},${y}`;
                                        }).join(" ") : "";

                                        return (
                                            <div key={device.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex flex-col">
                                                        <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                                                            {device.alias}
                                                        </h4>
                                                        {servicesToGraph.length > 1 && (
                                                            <select 
                                                                value={selectedService} 
                                                                onChange={(e) => setSelectedServiceMap({...selectedServiceMap, [device.id]: e.target.value})}
                                                                className="mt-1 text-[10px] border border-gray-200 rounded p-0.5 bg-gray-50 text-gray-600 focus:outline-none focus:border-primary"
                                                            >
                                                                {servicesToGraph.map(s => (
                                                                    <option key={s} value={s}>{s}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {device.animal_nombre && (
                                                            <span className="text-[10px] text-[#8B4513] bg-[#8B4513]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <FaPaw className="w-2 h-2" /> {device.animal_nombre}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] text-[#8B4513] bg-[#8B4513]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            <FaMicrochip className="w-2 h-2" /> {device.tipo}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-[200px] relative">
                                                    <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
                                                        {/* Y Axis Label */}
                                                        <text x="-100" y="10" transform="rotate(-90)" textAnchor="middle" className="text-[10px] fill-gray-500 font-medium" style={{ fontSize: '10px' }}>
                                                            {yLabel}
                                                        </text>

                                                        {/* Grid & Axes */}
                                                        <g className="text-gray-300">
                                                            {/* Y Axis Grid lines */}
                                                            {Array.from({ length: 6 }, (_, i) => i * 20).map((tick) => {
                                                                const y = 180 - (tick / 100) * 160;
                                                                return (
                                                                    <g key={tick}>
                                                                        <line x1="35" y1={y} x2="400" y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                                                                        <text x="30" y={y + 3} textAnchor="end" className="text-[8px] fill-gray-400" style={{ fontSize: '8px' }}>{tick}</text>
                                                                    </g>
                                                                );
                                                            })}
                                                            {/* X Axis Grid lines */}
                                                            {Array.from({ length: 100 }).map((_, i) => {
                                                                if (i % 20 !== 0) return null;
                                                                const x = 35 + (i / 99) * 365;
                                                                const dateLabel = data[i]?.date ? data[i].date.split(' ')[1] : "";
                                                                return (
                                                                    <g key={i}>
                                                                        <line x1={x} y1="20" x2={x} y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                                                                        <text x={x} y="195" textAnchor="middle" className="text-[8px] fill-gray-400" style={{ fontSize: '8px' }}>{dateLabel}</text>
                                                                    </g>
                                                                );
                                                            })}
                                                            {/* Main Axes */}
                                                            <line x1="35" y1="20" x2="35" y2="180" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                                            <line x1="35" y1="180" x2="400" y2="180" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                                        </g>

                                                        {/* Data Line */}
                                                        {points && (
                                                            <polyline
                                                                fill="none"
                                                                stroke={color}
                                                                strokeWidth="2"
                                                                points={points}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                vectorEffect="non-scaling-stroke"
                                                            />
                                                        )}
                                                    </svg>
                                                    {data.length === 0 && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-xs text-gray-400 font-medium bg-white/90 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                                                {!device.animal_nombre ? "Sin animal asociado" : "Sin datos"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                    <p className="text-gray-500">No hay dispositivos para mostrar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === "animales" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Mis Animales</h2>
                            {!showAddAnimalForm && (
                                <button 
                                    onClick={startAdding}
                                    className="bg-secondary text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity text-sm font-medium"
                                >
                                    + Añadir Nuevo Animal
                                </button>
                            )}
                        </div>

                        {showAddAnimalForm ? (
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                                <h3 className="text-lg font-semibold mb-4">{editingAnimalId ? "Editar Animal" : "Nuevo Animal"}</h3>
                                <form onSubmit={handleSaveAnimal} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Nombre <FaPen className="w-3 h-3" />
                                            </label>
                                            <input 
                                                className="p-3 border rounded-lg w-full"
                                                required
                                                value={newAnimal.nombre}
                                                onChange={(e) => setNewAnimal({...newAnimal, nombre: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Tipo <FaPen className="w-3 h-3" />
                                            </label>
                                            <select 
                                                className="p-3 border rounded-lg w-full bg-white"
                                                value={newAnimal.tipo}
                                                onChange={(e) => {
                                                    const newType = e.target.value;
                                                    const validSpecies = speciesOptions[newType];
                                                    setNewAnimal({
                                                        ...newAnimal, 
                                                        tipo: newType,
                                                        especie: validSpecies && validSpecies.length > 0 ? validSpecies[0].value : ""
                                                    });
                                                }}
                                            >
                                                <option value="MASCOTA">Mascota</option>
                                                <option value="GRANJA">Granja</option>
                                                <option value="EXOTICO">Exótico</option>
                                                <option value="SALVAJE">Salvaje</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Especie <FaPen className="w-3 h-3" />
                                            </label>
                                            <select 
                                                className="p-3 border rounded-lg w-full bg-white"
                                                value={newAnimal.especie}
                                                onChange={(e) => setNewAnimal({...newAnimal, especie: e.target.value})}
                                            >
                                                {speciesOptions[newAnimal.tipo]?.map((option) => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Estado <FaPen className="w-3 h-3" />
                                            </label>
                                            <select 
                                                className="p-3 border rounded-lg w-full bg-white"
                                                value={newAnimal.estado}
                                                onChange={(e) => setNewAnimal({...newAnimal, estado: e.target.value})}
                                            >
                                                <option value="ACTIVO">Activo</option>
                                                <option value="INACTIVO">Inactivo</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Tamaño (cm) <FaPen className="w-3 h-3" />
                                            </label>
                                            <input 
                                                type="number" step="0.01" className="p-3 border rounded-lg w-full"
                                                value={newAnimal.tamano}
                                                onChange={(e) => setNewAnimal({...newAnimal, tamano: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Peso (kg) <FaPen className="w-3 h-3" />
                                            </label>
                                            <input 
                                                type="number" step="0.01" className="p-3 border rounded-lg w-full"
                                                value={newAnimal.peso}
                                                onChange={(e) => setNewAnimal({...newAnimal, peso: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-end items-center mt-4">
                                        {editingAnimalId && (
                                            <button 
                                                type="button" 
                                                onClick={handleDeleteAnimal} 
                                                className="mr-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                                            >
                                                <FaTrash className="w-4 h-4" /> Eliminar
                                            </button>
                                        )}
                                        <button type="button" onClick={() => setShowAddAnimalForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary-accent">{isSaving ? "Guardando..." : "Guardar"}</button>
                                    </div>
                                </form>
                            </div>
                        ) : animales.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 mb-4">No tienes animales registrados aún.</p>
                            </div>
                        ) : null}

                        {!showAddAnimalForm && animales.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {animales.map((animal) => {
                                    const animalDevices = dispositivos.filter(d => d.animal_id === animal.id);
                                    const associatedUsers = Array.from(new Set(animalDevices.map(d => d.usuario_asociado_nombre).filter((name): name is string => !!name)));
                                    return (
                                    <div key={animal.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="p-1.5 bg-[#8B4513]/10 text-secondary rounded-full">
                                                    {animal.tipo === 'GRANJA' ? <FaCow className="text-base" /> : 
                                                     animal.tipo === 'EXOTICO' ? <GiSnake className="text-base" /> :
                                                     animal.tipo === 'SALVAJE' ? <GiTigerHead className="text-base" /> :
                                                     <FaPaw className="text-base" />}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {animal.is_owner && (
                                                        <>
                                                            <button 
                                                                onClick={() => startEditing(animal)}
                                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                                title="Editar información"
                                                            >
                                                                <FaPen className="w-3 h-3" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteAnimalById(animal.id)}
                                                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                                                title="Eliminar animal"
                                                            >
                                                                <FaTrash className="w-3 h-3" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {!animal.is_owner && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">ASOCIADO</span>
                                                    )}
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${animal.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                        {animal.estado}
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-800 leading-tight">{animal.nombre}</h3>
                                            <p className="text-gray-500 text-[11px] mb-1">{animal.especie} • {animal.tipo}</p>
                                            <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600 mb-2">
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase">Peso</p>
                                                    <p className="font-medium">{animal.peso} kg</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase">Tamaño</p>
                                                    <p className="font-medium">{animal.tamaño} cm</p>
                                                </div>
                                            </div>
                                            {animalDevices.length > 0 ? (
                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                    <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Dispositivos:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {animalDevices.map(device => (
                                                            <span key={device.id} className="px-2 py-0.5 bg-[#8B4513]/10 text-[#8B4513] rounded-md text-[10px] flex items-center gap-1">
                                                                <FaMicrochip className="w-2 h-2" /> {device.alias}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 text-[11px] italic flex items-center gap-1 pt-2 border-t border-gray-100 mt-2">
                                                    <FaMicrochip className="w-3 h-3" /> Sin dispositivo
                                                </p>
                                            )}
                                            {associatedUsers.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                    <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Usuarios Asociados:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {associatedUsers.map((userName, index) => (
                                                            <span key={index} className="px-2 py-0.5 bg-[#8B4513]/10 text-[#8B4513] rounded-md text-[10px] flex items-center gap-1">
                                                                <FaUser className="w-2 h-2" /> {userName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )})}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "dispositivos" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Mis Dispositivos</h2>
                            {!showAddDeviceForm && (
                                <button 
                                    onClick={startAddingDevice}
                                    className="bg-secondary text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity text-sm font-medium"
                                >
                                    + Añadir Dispositivo
                                </button>
                            )}
                        </div>

                        {showAddDeviceForm ? (
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                                <h3 className="text-lg font-semibold mb-4">{editingDeviceId ? "Editar Dispositivo" : "Nuevo Dispositivo"}</h3>
                                <form onSubmit={handleSaveDevice} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Alias <FaPen className="w-3 h-3" />
                                            </label>
                                            <input 
                                                placeholder="Alias" 
                                                className="p-3 border rounded-lg w-full"
                                                required
                                                value={newDevice.alias}
                                                onChange={(e) => setNewDevice({...newDevice, alias: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Tipo <FaPen className="w-3 h-3" />
                                            </label>
                                            <select 
                                                className="p-3 border rounded-lg w-full bg-white"
                                                value={newDevice.tipo}
                                                onChange={(e) => setNewDevice({...newDevice, tipo: e.target.value})}
                                            >
                                                <option value="COLLAR">Collar</option>
                                                <option value="TERMOMETRO">Termómetro</option>
                                                <option value="ANILLO">Anillo</option>
                                                <option value="BOTON">Botón</option>
                                                <option value="SENSOR">Sensor</option>
                                                <option value="OTRO">Otro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Modelo <FaPen className="w-3 h-3" />
                                            </label>
                                            <input 
                                                placeholder="Modelo" 
                                                className="p-3 border rounded-lg w-full"
                                                required
                                                value={newDevice.modelo}
                                                onChange={(e) => setNewDevice({...newDevice, modelo: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Número de Serie <FaPen className="w-3 h-3" />
                                            </label>
                                            <input 
                                                placeholder="Número de Serie" 
                                                className="p-3 border rounded-lg w-full"
                                                required
                                                value={newDevice.numeroSerie}
                                                onChange={(e) => setNewDevice({...newDevice, numeroSerie: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Estado <FaPen className="w-3 h-3" />
                                            </label>
                                            <select 
                                                className="p-3 border rounded-lg w-full bg-white"
                                                value={newDevice.estado}
                                                onChange={(e) => setNewDevice({...newDevice, estado: e.target.value})}
                                            >
                                                <option value="ACTIVO">Activo</option>
                                                <option value="INACTIVO">Inactivo</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Asociar a Animal <FaPaw className="w-3 h-3" />
                                            </label>
                                            <select 
                                                className="p-3 border rounded-lg w-full bg-white"
                                                value={newDevice.animalId}
                                                onChange={(e) => setNewDevice({...newDevice, animalId: e.target.value})}
                                            >
                                                <option value="">-- Ninguno --</option>
                                                {animales.filter(a => a.is_owner).map(a => (
                                                    <option key={a.id} value={a.id}>{a.nombre} ({a.especie})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                                Usuario Asociado <FaUser className="w-3 h-3" />
                                            </label>
                                            <select 
                                                className="p-3 border rounded-lg w-full bg-white"
                                                value={newDevice.usuarioAsociadoId}
                                                onChange={(e) => setNewDevice({...newDevice, usuarioAsociadoId: e.target.value})}
                                            >
                                                <option value="">-- Ninguno --</option>
                                                {invitedUsers.map(u => (
                                                    <option key={u.id} value={u.id}>{u.nombre} {u.apellidos}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-end items-center mt-4">
                                        {editingDeviceId && (
                                            <button type="button" onClick={handleDeleteDevice} className="mr-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors">
                                                <FaTrash className="w-4 h-4" /> Eliminar
                                            </button>
                                        )}
                                        <button type="button" onClick={() => setShowAddDeviceForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary-accent">{isSaving ? "Guardando..." : "Guardar"}</button>
                                    </div>
                                </form>
                            </div>
                        ) : dispositivos.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 mb-4">No tienes dispositivos registrados aún.</p>
                            </div>
                        ) : null}

                        {!showAddDeviceForm && dispositivos.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {dispositivos.map((device) => (
                                    <div key={device.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-1.5 bg-[#8B4513]/10 text-secondary rounded-full">
                                                <FaMicrochip className="text-base" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {device.is_owner && (
                                                    <>
                                                        <button 
                                                            onClick={() => startEditingDevice(device)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                            title="Editar dispositivo"
                                                        >
                                                            <FaPen className="w-3 h-3" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteDeviceById(device.id)}
                                                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                                            title="Eliminar dispositivo"
                                                        >
                                                            <FaTrash className="w-3 h-3" />
                                                        </button>
                                                    </>
                                                )}
                                                {!device.is_owner && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">ASOCIADO</span>
                                                )}
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${device.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                    {device.estado}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 leading-tight">{device.alias}</h3>
                                        <p className="text-gray-500 text-[11px] mb-1">{device.tipo} • Modelo: {device.modelo}</p>
                                        <p className="text-gray-500 text-[11px] mb-0.5">S/N: {device.numero_serie}</p>
                                        {device.animal_nombre ? (
                                            <div className="mt-2 pt-2 border-t border-gray-100 mb-2">
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Animal:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="px-2 py-0.5 bg-[#8B4513]/10 text-[#8B4513] rounded-md text-[10px] flex items-center gap-1">
                                                        <FaPaw className="w-2 h-2" /> {device.animal_nombre}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-[11px] italic flex items-center gap-1 pt-2 border-t border-gray-100 mt-2 mb-2">
                                                <FaPaw className="w-3 h-3" /> Sin Animal
                                            </p>
                                        )}
                                        {device.usuario_asociado_nombre && (
                                            <div className="mt-2 pt-2 border-t border-gray-100 mb-2">
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Usuario Asociado:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="px-2 py-0.5 bg-[#8B4513]/10 text-[#8B4513] rounded-md text-[10px] flex items-center gap-1">
                                                        <FaUser className="w-2 h-2" /> {device.usuario_asociado_nombre}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="relative">
                                            {device.is_owner ? (
                                                <button 
                                                    onClick={() => handleServiceMenuClick(device.id)}
                                                    className="w-full bg-secondary text-white py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                                                >
                                                    Servicios
                                                </button>
                                            ) : (
                                                <button 
                                                    disabled
                                                    className="w-full bg-gray-300 text-gray-500 py-1.5 rounded-lg text-xs font-medium cursor-not-allowed"
                                                >
                                                    Servicios (Solo lectura)
                                                </button>
                                            )}
                                            {activeServiceMenu === device.id && (
                                                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-xl rounded-lg mt-1 z-20 p-1 max-h-48 overflow-y-auto">
                                                    {getServicesForDevice(device.tipo).map((servicio) => {
                                                        const isSelected = (selectedServices[device.id] || []).includes(servicio);
                                                        const price = SERVICE_PRICES[servicio] || 0;
                                                        return (
                                                        <div key={servicio} onClick={() => handleToggleService(device.id, servicio)} className={`px-2 py-1.5 hover:bg-gray-50 text-[10px] cursor-pointer rounded border-b border-gray-50 last:border-0 text-left flex justify-between items-center ${isSelected ? 'text-secondary font-bold bg-[#8B4513]/5' : 'text-gray-700'}`}>
                                                            <span>{servicio} <span className="text-gray-400 ml-1">({price.toFixed(2)} €)</span></span>
                                                            {isSelected && <FaCheck className="w-3 h-3" />}
                                                        </div>
                                                    )})}
                                                    <div className="sticky bottom-0 bg-white pt-2 pb-1 border-t border-gray-100">
                                                        <button 
                                                            onClick={() => handleHireServices(device.id)}
                                                            className="w-full bg-primary text-black py-2 rounded-full text-[10px] font-bold hover:bg-primary-accent flex justify-center items-center gap-1 shadow-sm transition-colors"
                                                        >
                                                            <FaCheck className="w-3 h-3" /> Contratar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "servicios" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Mis Servicios Contratados</h2>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-gray-800 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3">Dispositivo</th>
                                            <th className="px-6 py-3">Servicio</th>
                                            <th className="px-6 py-3 text-right">Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {dispositivos.filter(d => d.is_owner && d.servicios_contratados && d.servicios_contratados.length > 0).flatMap(device => 
                                            device.servicios_contratados!.map((servicio, idx) => ({
                                                device,
                                                servicio,
                                                price: SERVICE_PRICES[servicio] || 0,
                                                key: `${device.id}-${idx}`
                                            }))
                                        ).map((item) => (
                                            <tr key={item.key} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 font-medium text-gray-900">
                                                    <div className="flex items-center gap-2">
                                                        <FaMicrochip className="text-gray-400" />
                                                        {item.device.alias}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3">{item.servicio}</td>
                                                <td className="px-6 py-3 text-right font-medium">
                                                    {item.price.toFixed(2)} €
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-bold text-gray-900">
                                        <tr>
                                            <td colSpan={2} className="px-6 py-4 text-right">Total Mensual</td>
                                            <td className="px-6 py-4 text-right text-lg text-blue-600">
                                                {totalCost.toFixed(2)} €
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "usuarios" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Usuarios Asociados</h2>
                            {!showInviteForm && (
                                <button 
                                    onClick={() => setShowInviteForm(true)}
                                    className="bg-secondary text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity text-sm font-medium"
                                >
                                    + Invitar Usuario
                                </button>
                            )}
                        </div>

                        {showInviteForm ? (
                             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                                <h3 className="text-lg font-semibold mb-4">Invitar Usuario</h3>
                                <form onSubmit={handleInviteUser} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email del usuario</label>
                                        <input 
                                            type="email"
                                            placeholder="ejemplo@email.com" 
                                            className="p-3 border rounded-lg w-full"
                                            required
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <button type="button" onClick={() => setShowInviteForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary-accent">{isSaving ? "Invitando..." : "Invitar"}</button>
                                    </div>
                                </form>
                            </div>
                        ) : invitedUsers.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 mb-4">No hay usuarios asociados a tu cuenta.</p>
                            </div>
                        ) : null}

                        {!showInviteForm && invitedUsers.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {invitedUsers.map((invitedUser) => (
                                    <div key={invitedUser.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="p-1.5 bg-[#8B4513]/10 text-secondary rounded-full">
                                                    <FaUser className="text-base" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleRemoveInvitation(invitedUser.id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Eliminar invitación"
                                                    >
                                                        <FaTrash className="w-3 h-3" />
                                                    </button>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${invitedUser.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                        {invitedUser.estado}
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-800 leading-tight">{invitedUser.nombre} {invitedUser.apellidos}</h3>
                                            <p className="text-gray-500 text-[11px] mb-2">{invitedUser.email}</p>
                                            {invitedUser.dispositivos_asociados && invitedUser.dispositivos_asociados.length > 0 ? (
                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                    <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Dispositivos asociados:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {invitedUser.dispositivos_asociados.map((deviceAlias, index) => (
                                                            <span key={index} className="px-2 py-0.5 bg-[#8B4513]/10 text-[#8B4513] rounded-md text-[10px] flex items-center gap-1">
                                                                <FaMicrochip className="w-2 h-2" /> {deviceAlias}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-gray-400 italic mt-2 pt-2 border-t border-gray-100">Sin dispositivos asociados</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "perfil" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
                        <div className="space-y-4 max-w-md">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                        Nombre <FaPen className="w-3 h-3" />
                                    </label>
                                    <input 
                                        className="w-full p-3 bg-white rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-primary"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                        Apellidos <FaPen className="w-3 h-3" />
                                    </label>
                                    <input 
                                        className="w-full p-3 bg-white rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-primary"
                                        value={apellidos}
                                        onChange={(e) => setApellidos(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                    Email <FaPen className="w-3 h-3" />
                                </label>
                                <input 
                                    className="w-full p-3 bg-white rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
                                    Método de Pago <FaPen className="w-3 h-3" />
                                </label>
                                <select
                                    className="w-full p-3 bg-white rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:border-primary"
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                >
                                    <option value="TARJETA">Tarjeta</option>
                                    <option value="TRANSFERENCIA">Transferencia</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rol</label>
                                <div className="p-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg border border-gray-200 text-gray-600 cursor-not-allowed">{user.rol}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado</label>
                                <div className="p-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg border border-gray-200 text-gray-600 cursor-not-allowed">{user.estado}</div>
                            </div> 
                            <button 
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="mt-4 w-full bg-primary text-black font-semibold py-3 rounded-lg hover:bg-primary-accent transition-colors disabled:opacity-50"
                            >
                                {isSaving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
      </div>
    </div>
  );
}
