import { auth } from "@/auth";
import Container from "@/components/Container";
import Section from "@/components/Section";
import { FaCheck } from "react-icons/fa6";

export default async function SalvajesPage() {
  const session = await auth();

  return (
    <div className="mt-24">
      <Container>
        <Section
          id="salvajes"
          title=""
          description=""
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Imagen Grande a la Izquierda */}
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=2574&auto=format&fit=crop"
                alt="Fauna salvaje"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Contenido a la Derecha */}
            <div className="space-y-8">
              <div>
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
                  Investigación y Conservación
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 leading-tight">
                  Tecnología para la <span className="text-blue-600">protección de la biodiversidad.</span>
                </h1>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                  Soluciones avanzadas para el sector empresas. Implementamos wearables miniaturizados que requieren evaluación e investigación para un monitoreo preciso y respetuoso.
                </p>
              </div>

              {/* Lista de características */}
              <ul className="space-y-3">
                {["Wearables miniaturizados de última generación", "Proyectos de evaluación e investigación", "Soluciones específicas para el sector empresas", "Monitoreo de impacto ambiental"].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FaCheck size={12} />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
              {session?.user && (
                <button className="inline-flex justify-center items-center w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
                  Acceso Profesional
                </button>
              )}
                <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
                  * Soluciones personalizadas para proyectos de investigación.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="features"
          title="Innovación para el estudio de fauna"
          description="Dispositivos y metodologías diseñadas para obtener datos de valor en entornos exigentes."
        >
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=2670&auto=format&fit=crop" 
                  alt="Wearables Miniaturizados" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Wearables Miniaturizados</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tecnología de rastreo compacta que requiere evaluación previa para adaptarse a la morfología de cada especie.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
                  alt="Evaluación e Investigación" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Evaluación e Investigación</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Plataforma integral para el análisis de datos y la investigación científica aplicada a la conservación.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 w-full mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=2676&auto=format&fit=crop" 
                  alt="Sector Empresas" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sector Empresas</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Servicios especializados para corporaciones que requieren estudios de impacto y seguimiento de fauna.
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="contact"
          title="Contacta con nuestro equipo"
          description="¿Tienes un proyecto de conservación o investigación? Hablemos de cómo podemos ayudarte."
        >
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input type="text" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Tu nombre" />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">Organización / Empresa</label>
                  <input type="text" id="company" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Nombre de la entidad" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email corporativo</label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="nombre@empresa.com" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Detalles del proyecto</label>
                <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Cuéntanos sobre tus necesidades de rastreo..."></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Enviar Solicitud
              </button>
            </form>
          </div>
        </Section>
      </Container>
    </div>
  );
}