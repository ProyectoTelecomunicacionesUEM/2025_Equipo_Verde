'use client';

import React, { useState } from 'react';
import Container from "@/components/Container";
import Section from "@/components/Section";
import { FaCheck, FaHeartPulse, FaDog, FaChartLine, FaLocationDot } from "react-icons/fa6";

const services = [
  {
    id: 'health',
    title: 'Seguimiento cardíaco y respiratorio',
    description: 'Monitorización constante de las constantes vitales para detectar anomalías a tiempo.',
    price: 4.99,
    icon: <FaHeartPulse className="w-8 h-8 text-red-500" />
  },
  {
    id: 'bark',
    title: 'Seguimiento de ladridos',
    description: 'Registro de patrones de ladrido y alertas de comportamiento inusual o ansiedad.',
    price: 1.99,
    icon: <FaDog className="w-8 h-8 text-orange-500" />
  },
  {
    id: 'activity',
    title: 'Mediciones de actividad y sueño',
    description: 'Control detallado del ejercicio diario y la calidad del descanso nocturno.',
    price: 2.99,
    icon: <FaChartLine className="w-8 h-8 text-blue-500" />
  },
  {
    id: 'gps',
    title: 'Localización y alertas anti-fuga',
    description: 'GPS en tiempo real con configuración de geocercas y avisos inmediatos de salida.',
    price: 6.99,
    icon: <FaLocationDot className="w-8 h-8 text-green-500" />
  }
];

export default function MascotasServiciosPage() {
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
          description="Selecciona los servicios que necesitas para el cuidado de tu mascota. Paga solo por lo que usas."
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
