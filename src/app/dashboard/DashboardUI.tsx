"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaChartLine, FaPaw, FaUser, FaRightFromBracket, FaTrash, FaPen, FaMicrochip, FaCow, FaUsers } from "react-icons/fa6";
import { GiTigerHead, GiSnake } from "react-icons/gi";
import { signOut } from "next-auth/react";
import { deleteUserAccount, updateUserProfile, addAnimal, updateAnimal, deleteAnimal } from "./actions";

export default function DashboardUI({ user, animales }: { user: any, animales: any[] }) {
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

  const menuItems = [
    { id: "resumen", label: "Resumen", icon: FaChartLine },
    { id: "animales", label: "Mis Animales", icon: FaPaw },
    { id: "dispositivos", label: "Mis Dispositivos", icon: FaMicrochip },
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

  function startEditing(animal: any) {
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

  return (
    <div className="min-h-screen pt-28 md:pt-40 bg-gray-50 pb-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar (Menú izquierdo) */}
        <aside className="w-full md:w-64 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hidden md:flex flex-col justify-between min-h-[600px]">
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6 px-2 text-gray-800">Panel de Control</h2>
            <nav className="space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full font-semibold transition-colors text-sm ${
                    activeSection === item.id
                      ? "bg-primary text-black hover:bg-primary-accent shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="text-lg" />
                  {item.label}
                </button>
              ))}
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
                 {menuItems.map((item) => (
                    <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                        activeSection === item.id
                        ? "bg-primary text-black"
                        : "bg-white border border-gray-200 text-gray-600"
                    }`}
                    >
                    {item.label}
                    </button>
                ))}
            </div>

            {/* Área de Acciones/Contenido */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm min-h-[600px]">
                {activeSection === "resumen" && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold">Hola, {user.nombre}</h1>
                        <p className="text-gray-600">Bienvenido a tu panel de control. Aquí tienes un resumen de tu actividad.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-5 bg-orange-50 rounded-xl border border-orange-100">
                                <h3 className="font-semibold text-orange-800">Dispositivos</h3>
                                <p className="text-3xl font-bold text-orange-900 mt-2">0</p>
                            </div>
                            <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                                <h3 className="font-semibold text-green-800">Animales</h3>
                                <p className="text-3xl font-bold text-green-900 mt-2">{animales.length}</p>
                            </div>
                            <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                                <h3 className="font-semibold text-purple-800">Mis Servicios</h3>
                                <p className="text-3xl font-bold text-purple-900 mt-2">0</p>
                            </div>
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
                                                onChange={(e) => setNewAnimal({...newAnimal, tipo: e.target.value})}
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
                                                <option value="PERRO">Perro</option>
                                                <option value="GATO">Gato</option>
                                                <option value="PEZ">Pez</option>
                                                <option value="REPTIL">Reptil</option>
                                                <option value="PAJARO">Pájaro</option>
                                                <option value="PEQUEÑOMAMIFERO">Pequeño Mamífero</option>
                                                <option value="VACA">Vaca</option>
                                                <option value="OVEJA">Oveja</option>
                                                <option value="CERDO">Cerdo</option>
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
                                {animales.map((animal) => (
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
                                                    <button 
                                                        onClick={() => startEditing(animal)}
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Editar información"
                                                    >
                                                        <FaPen className="w-3 h-3" />
                                                    </button>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${animal.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                        {animal.estado}
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-800 leading-tight">{animal.nombre}</h3>
                                            <p className="text-gray-500 text-[11px] mb-2">{animal.especie} • {animal.tipo}</p>
                                            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase">Peso</p>
                                                    <p className="font-medium">{animal.peso} kg</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px] uppercase">Tamaño</p>
                                                    <p className="font-medium">{animal.tamaño} cm</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "dispositivos" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Mis Dispositivos</h2>
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">No tienes dispositivos registrados aún.</p>
                            <button className="bg-secondary text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity text-sm font-medium">
                                + Añadir Dispositivo
                            </button>
                        </div>
                    </div>
                )}

                {activeSection === "usuarios" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Usuarios Asociados</h2>
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">No hay usuarios asociados a tu cuenta.</p>
                            <button className="bg-secondary text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity text-sm font-medium">
                                + Invitar Usuario
                            </button>
                        </div>
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
