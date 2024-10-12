"use client";
import React, { useState, useEffect } from "react";
import { useSession, getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter(); // Initialize useRouter for navigation
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  useEffect(() => {
    // If already logged in, redirect to HomeTasks page
    if (session) {
      const userId = session?.user?.id;
      //console.log(userId);
      router.push(`/pages/hometasks/${userId}`);
    }
  }, [session, router]);

  return (
    <div className="flex min-h-screen">
      {/* Left Section: 30% width */}
      <div className="w-1/3 bg-blue-100 flex flex-col justify-center items-center p-10">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4 mb-8">
          <img src="/images/logo3.png" alt="Logo" className="w-24 h-24" />
          <h1
            className="text-blue-900 text-4xl font-bold tracking-wide"
            style={{ fontFamily: "cursive" }}
          >
            Progress
          </h1>
        </div>

        {/* Login Text */}
        <h2
          className="text-2xl text-blue-900 font-semibold mb-6 text-center"
          style={{ fontFamily: "cursive" }}
        >
          Sign in to your account
        </h2>

        {/* Google Sign-in Button */}
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className="flex items-center justify-center bg-gray-50 border border-gray-300 px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-200 ease-in-out text-gray-900"
            >
              <FcGoogle className="mr-2" size={24} />
              Sign in with Google
            </button>
          ))}
      </div>

      {/* Right Section: 70% width */}
      <div
        className="w-2/3 flex justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: `url('/images/bg.png')` }}
      >
        <h1
          className="text-4xl font-bold text-white drop-shadow-lg max-w-lg text-center"
          style={{ fontFamily: "cursive" }}
        >
          Manage your tasks efficiently and stay organized.
        </h1>
      </div>
    </div>
  );
};

export default LoginPage;
