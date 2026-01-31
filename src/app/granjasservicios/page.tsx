'use client';

import React, { useState } from 'react';
import Container from "@/components/Container";
import Section from "@/components/Section";
import { FaCheck, FaHeartPulse, FaChartLine, FaLocationDot, FaCow, FaUtensils, FaTriangleExclamation, FaBell } from "react-icons/fa6";

const services = [
  {
    id: 'gps',
    title: 'Localización y alertas anti-fuga',
    description: 'GPS integrado para localización en tiempo real y alertas de perímetro.',
    price: 6.99,
    icon: <FaLocationDot className="w-8 h-8 text-green-500" />
  },
  {
    id: 'health',
    title: 'Seguimiento cardíaco y respiratorio',
    description: 'Monitorización de constantes vitales para detectar estrés o enfermedades.',
    price: 4.99,
    icon: <FaHeartPulse className="w-8 h-8 text-red-500" />
  },
  {
    id: 'activity',
    title: 'Mediciones de actividad y sueño',
    description: 'Control del descanso y actividad física del ganado.',
    price: 2.99,
    icon: <FaChartLine className="w-8 h-8 text-blue-500" />
  },
  {
    id: 'rumination',
    title: 'Patrones de rumia',
    description: 'Análisis detallado de la rumia para evaluar la salud digestiva.',
    price: 3.99,
    icon: <FaCow className="w-8 h-8 text-amber-700" />
  },
  {
    id: 'food',
    title: 'Ingesta de alimentos',
    description: 'Monitorización del comportamiento alimentario e ingesta diaria.',
    price: 3.99,
    icon: <FaUtensils className="w-8 h-8 text-orange-500" />
  },
  {
    id: 'mastitis',
    title: 'Alerta para Mastitis bovina',
    description: 'Detección temprana de indicadores de mastitis en la leche.',
    price: 5.99,
    icon: <FaTriangleExclamation className="w-8 h-8 text-yellow-500" />
  },
  {
    id: 'birth',
    title: 'Alerta parto',
    description: 'Avisos inmediatos ante signos de inicio del parto.',
    price: 4.99,
    icon: <FaBell className="w-8 h-8 text-purple-500" />
  }
];

export default function GranjasServiciosPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const totalMonthly = selectedServices.reduce((acc, id) => {
    const service = services.find(s => s.id === id);
    return acc + (service ? service.price : 0);
  }, 0);

  return (
    <div className="mt-24">
      <Container>
        <Section
          id="services-selection"
          title="Configura tu Plan"
          description="Selecciona los servicios que necesitas para la gestión de tu granja. Paga solo por lo que usas."
        >
          <div className="flex flex-col lg:flex-row gap-10 items-start mt-8">
            {/* Columna Izquierda: Selección de Servicios */}
            <div className="flex-1 grid gap-6">
              {services.map(service => (
                <div 
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-6 ${
                    selectedServices.includes(service.id) 
                    ? 'border-blue-600 bg-blue-50 shadow-md' 
                    : 'border-gray-100 bg-white hover:border-blue-200'
                  }`}
                >
                  <div className="p-4 bg-white rounded-full shadow-sm shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                    <p className="text-blue-600 font-semibold mt-2">{service.price}€ / mes</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                    selectedServices.includes(service.id)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-transparent'
                  }`}>
                    <FaCheck size={14} />
                  </div>
                </div>
              ))}
            </div>

            {/* Columna Derecha: Resumen de Pago */}
            <div className="w-full lg:w-96 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h3>
              
              <div className="space-y-4 mb-8">
                {selectedServices.length === 0 ? (
                  <p className="text-gray-500 text-center py-4 italic">Ningún servicio seleccionado</p>
                ) : (
                  selectedServices.map(id => {
                    const s = services.find(serv => serv.id === id);
                    return (
                      <div key={id} className="flex justify-between text-sm items-center">
                        <span className="text-gray-700 w-2/3">{s?.title}</span>
                        <span className="font-semibold">{s?.price}€</span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-gray-600 font-medium">Total Mensual</span>
                  <span className="text-4xl font-bold text-blue-600">{totalMonthly.toFixed(2)}€</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Contratar Plan
              </button>
              <p className="text-xs text-gray-400 text-center mt-4">
                Sin permanencia. Puedes cancelar cuando quieras.
              </p>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}
