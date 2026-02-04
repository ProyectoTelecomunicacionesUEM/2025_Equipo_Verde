import { auth } from "@/auth";
import Link from "next/link";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing/Pricing";
import FAQ from "@/components/FAQ";
import Logos from "@/components/Logos";
import Benefits from "@/components/Benefits/Benefits";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";

export default async function HomePage() {
  const session = await auth();

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
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white bg-black/40 p-6">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
                MyPetPlan
              </h1>
              <div className="text-base md:text-lg font-medium space-y-2 drop-shadow-md">
                <p>Bienestar animal inteligente</p>
                <p>Tú eliges los servicios</p>
                <p>Tú controlas el coste</p>
              </div>

              <div className="mt-6">
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
          title="Nuestros Planes"
          description="Simple, transparent pricing. No surprises."
        >
          <Pricing />
        </Section>

        <Section
          id="testimonials"
          title="What Our Clients Say"
          description="Hear from those who have partnered with us."
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
