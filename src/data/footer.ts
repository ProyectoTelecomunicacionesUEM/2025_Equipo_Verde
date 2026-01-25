import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading: "Bienestar animal inteligente: ¡Tú eliges los servicios, tú controlas el coste!.",
    quickLinks: [
        {
        text: "Mascotas",
        url: "#mascotas"
        },
        {
            text: "Granjas",
            url: "#granjas"
        },
        {
            text: "Exóticos",
            url: "#exoticos"
        },
        {
            text: "Salvajes",
            url: "#salvajes"
        }
    ],
    email: 'contacto@mypetplan.com',
    telephone: '+34 912345678',
    socials: {
        // github: 'https://github.com',
        // x: 'https://twitter.com/x',
        twitter: 'https://twitter.com/Twitter',
        facebook: 'https://facebook.com',
        // youtube: 'https://youtube.com',
        linkedin: 'https://www.linkedin.com',
        // threads: 'https://www.threads.net',
        instagram: 'https://www.instagram.com',
    }
}