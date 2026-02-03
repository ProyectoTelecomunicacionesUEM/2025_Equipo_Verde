import { auth } from "@/auth";
import Link from "next/link";
import Container from "@/components/Container";
import Section from "@/components/Section";
import { FaCheck } from "react-icons/fa6";

export default async function ExoticosPage() {
  const session = await auth();

  return (
    <div className="mt-24">
      <Container>
        <Section
          id="exoticos"
          title=""
          description=""
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Imagen Grande a la Izquierda */}
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1550948537-130a1ce83314?q=80&w=2672&auto=format&fit=crop"
                alt="Tucán exótico"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Contenido a la Derecha */}
            <div className="space-y-8">
              <div>
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
                  Cuidado Especializado
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 leading-tight">
                  Atención experta para <span className="text-blue-600">animales extraordinarios.</span>
                </h1>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                  Soluciones tecnológicas adaptadas a cada especie: control térmico remoto para acuarios y terrarios, anillos especiales para aves y sensores ultraligeros para pequeños mamíferos.
                </p>
              </div>

              {/* Lista de características */}
              <ul className="space-y-3">
                {["Monitorización térmica remota", "Anillos de seguimiento para patas y alas", "Sensores en arneses muy ligeros", "Sistema de alarmas y ajuste remoto"].map((item, index) => (
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
                  href="/exoticosservicios"
                  className="inline-flex justify-center items-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Empezar Ahora
                </Link>
              ) : (
                <Link href="/exoticosservicios" className="inline-flex justify-center items-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
                  Añadir Exótico
                </Link>
              )}
                <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
                  * Adaptado a la normativa de tenencia responsable.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="features"
          title="Dispositivos adaptados a su naturaleza"
          description="Hardware diseñado específicamente para la anatomía y necesidades de animales no convencionales."
        >
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1503917988258-f87a78e3c995?q=80&w=2574&auto=format&fit=crop" 
                  alt="Control de Hábitat" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Peces y Reptiles</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Dispositivo que permite monitorizar y ajustar la temperatura del acuario o terrario de forma remota, además de establecer alarmas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=2070&auto=format&fit=crop" 
                  alt="Pájaros" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pájaros</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Anillos en las patas/alas especiales para un seguimiento preciso sin interferir en su movimiento.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=2070&auto=format&fit=crop" 
                  alt="Pequeños Mamíferos" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pequeños Mamíferos</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sensores integrados en collares o arneses muy ligeros, diseñados para no sobrecargar a mascotas de tamaño reducido.
              </p>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}
