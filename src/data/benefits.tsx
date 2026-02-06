import { FiBarChart2, FiBriefcase, FiDollarSign, FiLock, FiPieChart, FiShield, FiTarget, FiTrendingUp, FiUser } from "react-icons/fi";

import { IBenefit } from "@/types"

export const benefits: IBenefit[] = [
    {
        title: "Quienes somos",
        description: "Este proyecto nace con la intención de fomentar el uso de los dispositivos inteligentes para el control y cuidado de animales, ofreciendo tecnología Wearable de forma personalizada y asequible.",
        bullets: [
            {
                title: "Objetivo Comercial",
                description: "Facilitar la toma de decisiones para el cuidado animal.",
                icon: <FiBarChart2 size={26} />
            },
            {
                title: "Diseño",
                description: "Una plataforma cómoda y fácil de usar para todos.",
                icon: <FiUser size={26} />
            },
            {
                title: "Funcionalidad",
                description: "Herramienta integral de gestión de datos y alertas.",
                icon: <FiTrendingUp size={26} />
            }
        ],
        imageSrc: "/images/granja.jpg"
    },
    {
        title: "Nuestros servicios",
        description: "Cubrimos Mascotas, Animales de Granja, Exóticos y Salvajes. Configura los servicios que necesitas y paga solo por lo que usas.",
        bullets: [
            {
                title: "Mascotas y Exóticos",
                description: "Collares y sensores para perros, gatos, aves y reptiles.",
                icon: <FiTarget size={26} />
            },
            {
                title: "Animales de Granja",
                description: "GPS y monitorización de salud para ganado.",
                icon: <FiBriefcase size={26} />
            },
            {
                title: "Planes Flexibles",
                description: "¡Tú eliges los servicios, tú controlas el coste!",
                icon: <FiPieChart size={26} />
            }
        ],
        imageSrc: "/images/servicios.jpg"
    },
    {
        title: "Equipo de desarrollo",
        description: "Un equipo multidisciplinar de ingeniería comprometido con el bienestar animal y la innovación tecnológica.",
        bullets: [
            {
                title: "Gestión y Calidad",
                description: "Jessica Baidez (PO) y Claudia (Scrum Master).",
                icon: <FiShield size={26} />
            },
            {
                title: "Desarrollo e Investigación",
                description: "Sebastián Bernal, Guillermo Cristobal y Jorge García.",
                icon: <FiUser size={26} />
            },
            {
                title: "Stakeholders",
                description: "Flavio Grillo (Docente).",
                icon: <FiLock size={26} />
            }
        ],
        imageSrc: "/images/Equipo.jpg"
    },
]