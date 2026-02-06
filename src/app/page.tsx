import Link from "next/link";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Logos from "@/components/Logos";
import Benefits from "@/components/Benefits/Benefits";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";

export default async function HomePage() {
  return (
    <>
      <div className="mt-32">
        <Container>
          <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
            <img
              src="/images/pets-hero.png"
              alt="Perro y gato juntos"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 flex flex-col justify-start pt-10 items-center text-center text-white bg-black/40 p-6">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
                MyPetPlan
              </h1>
              <div className="text-base md:text-lg font-medium space-y-2 drop-shadow-md">
                <p>Bienestar animal inteligente</p>
                <p>Tú eliges los servicios</p>
                <p>Tú controlas el coste</p>
              </div>

              <div className="mt-auto mb-8">
                <Link href="#pricing" className="inline-flex justify-center items-center px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
                  Saber más
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Logos />
      <Container>
        <div id="proyecto" className="scroll-mt-32">
          <Benefits />
        </div>

        <Section
          id="pricing"
          title="Servicios y Modelo de Tarifas"
          description={
            <div className="flex flex-col items-center">
              <p>No hay precios cerrados ni planes fijos, el coste depende de:</p>
              <ul className="list-disc text-left mt-2 mb-4 space-y-1">
                <li>Tipo de dispositivo</li>
                <li>Servicios activados</li>
                <li>Tiempo de uso</li>
              </ul>
              <p className="font-semibold italic">“Tú eliges los servicios, tú controlas el coste”</p>
            </div>
          }
        >
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Columna 1: Modelo de servicio */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-900">🐾 Modelo de servicio</h3>
              <ul className="space-y-3 text-gray-600">
                <li>-El usuario elige el dispositivo según el tipo de animal.</li>
                <li>-El usuario contrata solo los servicios que necesita.</li>
                <li>-Informes y alertas diarias siempre incluidos mientras el servicio esté activo.</li>
              </ul>
            </div>

            {/* Columna 2: Tipos de dispositivos */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-900">🧩 Tipos de dispositivos</h3>
              <ul className="space-y-3 text-gray-600">
                <li><span className="font-semibold text-gray-800">-Mascotas:</span> collares o arneses para perros y gatos.</li>
                <li><span className="font-semibold text-gray-800">-Exóticos:</span> termómetros inteligentes, anillos RFID, sensores ligeros.</li>
                <li><span className="font-semibold text-gray-800">-Granja:</span> collares GPS y aretes electrónicos con sensores.</li>
                <li><span className="font-semibold text-gray-800">-Salvaje:</span> wearables miniaturizados (orientado a empresas e investigación).</li>
              </ul>
            </div>

            {/* Columna 3: Servicios disponibles */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-900">📊 Servicios disponibles</h3>
              <p className="text-sm text-gray-500 mb-3 italic">(según dispositivo)</p>
              <ul className="space-y-2 text-gray-600">
                <li>-Seguimiento cardíaco y respiratorio</li>
                <li>-Actividad y sueño</li>
                <li>-Localización GPS y alertas anti-fuga</li>
                <li>-Ladridos y patrones de comportamiento</li>
                <li>-Climatización de acuarios y terrarios</li>
                <li>-Sensores de temperatura y calidad del agua</li>
                <li className="pt-2 border-t border-gray-100 mt-2">
                  <span className="font-semibold text-gray-800 block mb-1">Servicios avanzados en granja:</span>
                  <ul className="pl-4 space-y-1 list-disc list-inside text-sm">
                    <li>Rumia</li>
                    <li>Ingesta de alimentos</li>
                    <li>Detección de mastitis</li>
                    <li>Alerta de parto</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="testimonials"
          title="Lo que dicen nuestros clientes"
          description="¿Por qué nuestros clientes nos recomiendan?"
        >
          <Testimonials />
        </Section>

        <FAQ />

        <Stats />
        
        <CTA />
      </Container>
    </>
  );
}
