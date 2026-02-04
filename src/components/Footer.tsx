import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

import { siteDetails } from '@/data/siteDetails';
import { footerDetails } from '@/data/footer';
import { getPlatformIconByName } from '@/utils';

const Footer: React.FC = () => {
    return (
        <footer className="bg-hero-background text-foreground py-10">
            <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/MyPetPlanLogo.png"
                            alt={siteDetails.siteName}
                            width={60}
                            height={60}
                            className="min-w-fit w-12 h-12 md:w-16 md:h-16 object-contain"
                        />
                        <h3 className="manrope text-xl font-semibold cursor-pointer">
                            {siteDetails.siteName}
                        </h3>
                    </Link>
                    <p className="mt-3.5 text-foreground-accent text-center">
                        {footerDetails.subheading}
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <h4 className="text-lg font-semibold mb-4 mt-2 md:mt-4">Accesos Rápidos</h4>
                    <ul className="text-foreground-accent text-center">
                        <li className="mb-2">
                            <Link href="/mascotas" className="hover:text-foreground">Mascotas</Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/granjas" className="hover:text-foreground">Granjas</Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/exoticos" className="hover:text-foreground">Exóticos</Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/salvajes" className="hover:text-foreground">Salvajes</Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col items-center">
                    <h4 className="text-lg font-semibold mb-4 mt-2 md:mt-4">Contactanos</h4>

                    {footerDetails.email && <a href={`mailto:${footerDetails.email}`}  className="block text-foreground-accent hover:text-foreground">Email: {footerDetails.email}</a>}

                    {footerDetails.telephone && <a href={`tel:${footerDetails.telephone}`} className="block text-foreground-accent hover:text-foreground">Phone: {footerDetails.telephone}</a>}

                    {footerDetails.socials && (
                        <div className="mt-5 flex items-center justify-center gap-5 flex-wrap">
                            {Object.keys(footerDetails.socials).map(platformName => {
                                if (platformName && footerDetails.socials[platformName]) {
                                    return (
                                        <Link
                                            href={footerDetails.socials[platformName]}
                                            key={platformName}
                                            aria-label={platformName}
                                        >
                                            {getPlatformIconByName(platformName)}
                                        </Link>
                                    )
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 md:text-center text-foreground-accent px-6">
                <p>Copyright &copy; {new Date().getFullYear()} {siteDetails.siteName}. All rights reserved.</p>
                <p className="text-sm mt-2 text-gray-500">UI kit by <a href="https://ui8.net/youthmind/products/fintech-finance-mobile-app-ui-kit" target="_blank">Youthmind</a></p>
            </div>
        </footer>
    );
};

export default Footer;
