import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded shadow max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Bem-vindo</h1>
        <p className="mb-6">
          Demo de autenticação (front-only). Use os botões abaixo:
        </p>

        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Entrar
          </Link>
          <Link href="/register" className="px-4 py-2 border rounded">
            Registrar
          </Link>
        </div>
      </div>
    </main>
  );
}
