import SectionTitle from "./SectionTitle";

interface Props {
    id: string;
    title: string;
    description: string | React.ReactNode;
}

const Section: React.FC<React.PropsWithChildren<Props>> = ({ id, title, description, children }: React.PropsWithChildren<Props>) => {
    return (
        <section id={id} className="py-10 lg:py-20">
            <SectionTitle>
                <h2 className="text-center mb-4">{title}</h2>
            </SectionTitle>
            <div className="mb-12 text-center text-foreground-accent max-w-3xl mx-auto">{description}</div>
            {children}
        </section>
    )
}

export default Section