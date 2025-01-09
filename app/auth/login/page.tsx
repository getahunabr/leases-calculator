"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await signIn("credentials", {
      // redirect: false,
      email,
      password,
    });

    if (response?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/"); // Redirect to the protected page
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter your email"
              className="mt-2 block w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="Enter your password"
              className="mt-2 block w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link
              href="/auth/register"
              className="text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import CustomFormField from "../CustomFormField";
// import SubmitButton from "../SubmitButton";
// import { useState } from "react";
// import { UserFormValidation } from "@/lib/Validation";
// import { useRouter } from "next/navigation";
// import { createUser } from "../../../lib/action";

// const LoginForm = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   // 1. Define your form.
//   const form = useForm<z.infer<typeof UserFormValidation>>({
//     resolver: zodResolver(UserFormValidation),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//     },
//   });

//   // 2. Define a submit handler.
//   async function onSubmit({
//     name,
//     email,
//     phone,
//     password,
//   }: z.infer<typeof UserFormValidation>) {
//     setIsLoading(true);
//     try {
//       const userData = { name, email, phone, password };
//       const user = await createUser(userData); // Call your createUser function
//       if (user) router.push(`/patients/${user.$id}/register`);
//     } catch (error) {
//       console.error("Error creating user:", error); // Log any errors during user creation
//     }
//     setIsLoading(false);
//   }
//   return (

//   );
// };
// export default LoginForm;
