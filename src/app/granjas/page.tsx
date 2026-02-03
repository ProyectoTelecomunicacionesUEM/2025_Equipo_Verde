import { auth } from "@/auth";
import Link from "next/link";
import Container from "@/components/Container";
import Section from "@/components/Section";
import { FaCheck } from "react-icons/fa6";

export default async function GranjasPage() {
  const session = await auth();

  return (
    <div className="mt-24">
      <Container>
        <Section
          id="granjas"
          title=""
          description=""
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Imagen Grande a la Izquierda */}
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2074&auto=format&fit=crop"
                alt="Ganado en el campo"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Contenido a la Derecha */}
            <div className="space-y-8">
              <div>
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
                  Gestión Ganadera Profesional
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 leading-tight">
                  Control total de tu ganado, <span className="text-blue-600">simplificado.</span>
                </h1>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                  Soluciones especializadas para vacas, ovejas y cerdos. Implementamos collares GPS y aretes electrónicos con sensores de movimiento, temperatura y acelerómetros para una gestión eficiente.
                </p>
              </div>

              {/* Lista de características */}
              <ul className="space-y-3">
                {["Collares GPS de alta precisión", "Aretes electrónicos inteligentes", "Sensores de movimiento y temperatura", "Monitorización de vacas, ovejas y cerdos"].map((item, index) => (
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
                  href="/granjasservicios"
                  className="inline-flex justify-center items-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Empezar Ahora
                </Link>
              ) : (
                <Link href="/granjasservicios" className="inline-flex justify-center items-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
                  Añadir Ganado
                </Link>
              )}
                <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
                  * Soluciones escalables para pequeñas y grandes explotaciones.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="features"
          title="Tecnología al servicio del campo"
          description="Dispositivos robustos diseñados para soportar las condiciones de la ganadería moderna."
        >
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=2121&auto=format&fit=crop" 
                  alt="Collares GPS" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Collares GPS</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Localización precisa para el control de pastoreo. Ideal para mantener el ganado dentro de las zonas asignadas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2070&auto=format&fit=crop" 
                  alt="Aretes Electrónicos" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aretes Electrónicos</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Identificación digital con opciones de acelerómetros integrados para el seguimiento de actividad individual.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop" 
                  alt="Sensores Avanzados" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sensores Avanzados</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monitorización de temperatura y movimiento para detectar celo, enfermedades o cambios de comportamiento.
              </p>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}
