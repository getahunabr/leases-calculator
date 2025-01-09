"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setError(message || "User already exists");
      } else {
        router.push("/auth/login"); // Redirect to login page after successful registration
      }
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-teal-600">
      <div className=" bg-white p-10 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="Enter your name"
              className="mt-2 block w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

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
              className="mt-2 block w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
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
              className="mt-2 block w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-green-500 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////

// import { useState } from "react";

// const Rigester = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//     setFormData({ name: "", email: "", password: "" });
//     alert("Form submitted successfully!");
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         name="name"
//         placeholder="Name"
//         value={formData.name}
//         onChange={handleChange}
//       />
//       <label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//       </label>
//       <label>
//         Password:
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//         />
//       </label>
//     </form>
//   );
// };
/////////////////////////////////////////////////////

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import "react-datepicker/dist/react-datepicker.css";
// import "react-phone-number-input/style.css";
// import SubmitButton from "../SubmitButton";
// import { PatientFormValidation } from "@/lib/Validation";

// const RegisterForm = ({ user }: { user: User }) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof PatientFormValidation>>({
//     resolver: zodResolver(PatientFormValidation),
//     defaultValues: {
//       ...PatientFormDefaultValues,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
//     setIsLoading(true);

//     try {
//       const patient = {
//         userId: user.$id,
//         name: values.name,
//         email: values.email,
//         phone: values.phone,
//         birthDate: new Date(values.birthDate),
//         gender: values.gender,
//         address: values.address,
//         occupation: values.occupation,
//         privacyConsent: values.privacyConsent,
//       };

//       const newPatient = await registerPatient(patient);

//       if (newPatient) {
//         router.push(`/patients/${user.$id}/new-appointment`);
//       }
//     } catch (error) {
//       console.log(error);
//     }

//     setIsLoading(false);
//   };

//   return (

//   );
// };

// export default RegisterForm;
