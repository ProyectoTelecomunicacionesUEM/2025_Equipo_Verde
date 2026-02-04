import { auth } from "@/auth";
import Link from "next/link";
import Container from "@/components/Container";
import Section from "@/components/Section";
import { FaCheck } from "react-icons/fa6";

export default async function MascotasPage() {
  const session = await auth();

  return (
    <div className="mt-24">
      <Container>
        <Section
          id="mascotas"
          title=""
          description=""
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Imagen Grande a la Izquierda */}
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2672&auto=format&fit=crop"
                alt="Perro y gato juntos"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Contenido a la Derecha */}
            <div className="space-y-8">
              <div>
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
                  Gestión Integral
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 leading-tight">
                  El bienestar de tu mascota, <span className="text-blue-600">simplificado.</span>
                </h1>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                  La plataforma definitiva para llevar el control de salud, ubicación y necesidades de tus compañeros peludos. Dispositivo en collar, arnés en tres tamaños disponibles según medidas y peso.
                </p>
              </div>

              {/* Lista de características */}
              <ul className="space-y-3">
                {["Seguimiento cardíaco y respiratorio", "Seguimiento de ladridos", "Mediciones de actividad y sueño", "Localización y alertas anti-fuga"].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FaCheck size={12} />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                {!session?.user ? (
                  <Link
                    href="/mascotasservicios"
                    className="inline-flex justify-center items-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Empezar Ahora
                  </Link>
                ) : (
                  <Link href="/mascotasservicios" className="inline-flex justify-center items-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
                    Añadir Mascota
                  </Link>
                )}
                <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
                  * Únete a miles de dueños responsables hoy mismo.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="features"
          title="Todo lo que necesitas para su cuidado"
          description="Tecnología avanzada diseñada para la tranquilidad de los dueños y la felicidad de las mascotas."
        >
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=2670&auto=format&fit=crop" 
                  alt="GPS Tracking" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Localización GPS Precisa</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Rastreo en tiempo real con cobertura ilimitada. Define Zonas Seguras y recibe alertas instantáneas si tu mascota se aleja demasiado.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?q=80&w=2069&auto=format&fit=crop" 
                  alt="Health Monitoring" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Monitoreo de Salud</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Vigila sus niveles de actividad, calidad del sueño y calorías quemadas. Detecta cambios de comportamiento antes de que sean un problema.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=2670&auto=format&fit=crop" 
                  alt="Activity History" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Historial de Aventuras</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Guarda sus lugares favoritos y rutas de paseo. Comparte el acceso con paseadores o familiares para que todos estén conectados.
              </p>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}
