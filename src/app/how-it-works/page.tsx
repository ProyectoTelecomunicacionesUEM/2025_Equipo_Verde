export default function HowItWorksPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 mt-24 space-y-4">
      <h1 className="text-3xl font-semibold">Cómo funciona</h1>
      <ol className="list-decimal pl-6 text-gray-700 space-y-2">
        <li>Inicia sesión en MyPetPlan.</li>
        <li>Activa tu dispositivo (wearable) y asígnalo a tu animal.</li>
        <li>Visualiza datos en tiempo real (simulación) en el panel.</li>
        <li>Si eres admin, concede permisos a otros usuarios.</li>
      </ol>
    </main>
  );
}

