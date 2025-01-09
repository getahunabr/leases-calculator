import Link from "next/link";
import LeaseInputForm from "./components/Form/LeaseForm";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-500">
      <div className="w-full max-w-5xl px-8 py-10  shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Lease Form
        </h1>
        <LeaseInputForm />
        <div className="mt-8 flex flex-col items-center text-gray-600">
          <p className="text-sm">© 2025 LeaseCalc</p>
          <Link
            href="/Dashboard"
            className="text-blue-500 hover:underline mt-4"
          ></Link>
        </div>
      </div>
    </div>
  );
}
