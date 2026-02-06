import { IFAQ } from "@/types";
import { siteDetails } from "./siteDetails";

export const faqs: IFAQ[] = [
    {
        question: '¿Es seguro MyPetPlan?',
        answer: `Sí. MyPetPlan utiliza sistemas de acceso seguro y conexiones protegidas para garantizar que los datos de los animales y de los usuarios estén siempre protegidos.

Solo las personas autorizadas pueden acceder a la información, y el propietario del dispositivo puede conceder o retirar permisos en cualquier momento. Así, el control de los datos está siempre en manos del usuario.`,
    },
    {
        question: '¿Puedo usar MyPetPlan en varios dispositivos?',
        answer: `Sí. Puedes acceder a tu cuenta de MyPetPlan desde ordenador, tablet o móvil sin ningún problema.

Toda la información de tus animales y dispositivos se sincroniza en tiempo real, lo que te permite consultar los datos estés donde estés.`,
    },
    {
        question: '¿Puedo gestionar varios animales o dispositivos a la vez?',
        answer: `Por supuesto. MyPetPlan está diseñado para gestionar múltiples animales y dispositivos desde una sola cuenta.

Cada dispositivo se asocia a un animal concreto, y desde el panel de gestión puedes cambiar fácilmente entre ellos, tanto si tienes una sola mascota como si gestionas una granja completa.`
    },
    {
        question: '¿Necesito conocimientos técnicos para usar MyPetPlan?',
        answer: `No. MyPetPlan ha sido diseñado para ser una plataforma sencilla, clara e intuitiva.

No necesitas conocimientos técnicos ni veterinarios para entender la información. Los datos se muestran de forma visual, con alertas e informes que facilitan la comprensión y la toma de decisiones.`,
    },
    {
        question: '¿Qué animales y dispositivos son compatibles con MyPetPlan?',
        answer: `MyPetPlan es compatible con una amplia variedad de animales y dispositivos:

Mascotas como perros y gatos

Animales de granja (vacas, ovejas, cerdos)

Animales exóticos como aves, reptiles o peces

Dispositivos específicos para investigación y conservación

Los servicios disponibles dependen del tipo de animal y del dispositivo utilizado.`
    },
    {
        question: '¿Qué pasa si necesito ayuda usando la plataforma?',
        answer: `Nuestro equipo de soporte está disponible para ayudarte en todo momento.

Además, la plataforma incluye guías y explicaciones para facilitar la activación de dispositivos, la gestión de servicios y la interpretación de los datos.`
    }
];