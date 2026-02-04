export default function ActivatePage() {
  return (
    <main className="max-w-2xl mx-auto p-6 mt-24 space-y-4">
      <h1 className="text-3xl font-semibold">Activar dispositivo</h1>
      <p className="text-gray-600">
        Introduce el código del dispositivo para asociarlo a tu cuenta (demo).
      </p>

      <form className="grid gap-3 max-w-sm">
        <input className="border rounded px-3 py-2" placeholder="Código de activación" />
        <button className="bg-black text-white rounded px-3 py-2">
          Activar
        </button>
      </form>
    </main>
  );
}

