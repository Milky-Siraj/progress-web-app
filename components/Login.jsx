"use client";
import React, { useState, useEffect } from "react";
import { useSession, getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  useEffect(() => {
    if (session) {
      const userId = session?.user?.id;
      router.push(`/pages/hometasks/${userId}`);
    }
  }, [session, router]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      {/* Left Section */}
      <div className="flex flex-col w-full lg:w-1/2 xl:w-1/3 bg-gray-900  shadow-xl justify-center items-center p-8 md:p-10 min-h-screen lg:min-h-0 mx-auto lg:mx-0 border border-blue-700">
        <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-8">
          <img
            src="/images/logo3.png"
            alt="Logo"
            className="w-20 h-20 md:w-28 md:h-28"
          />
          <h1
            className="text-blue-800 text-4xl md:text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: "cursive" }}
          >
            Progress
          </h1>
        </div>

        <h2
          className="text-xl md:text-2xl text-blue-700 font-semibold mb-6 text-center tracking-wide"
          style={{ fontFamily: "cursive" }}
        >
          Please Sign Up or Login
        </h2>

        {/* Google Sign-in Button */}
        {providers &&
          Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className="flex items-center text-white justify-center bg-grey-700 border border-blue-700 px-8 md:px-10 py-3 md:py-4 rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-200 ease-in-out text-gray-900 w-full max-w-xs text-lg md:text-xl"
            >
              <FcGoogle className="mr-3" size={24} />
              <span>Sign in with Google</span>
            </button>
          ))}
      </div>

      {/* Right Section - hidden on smaller screens */}
      <div
        className="hidden lg:flex w-1/2 xl:w-2/3 justify-center items-center bg-cover bg-center bg-blue-600 bg-opacity-80  "
        style={{
          backgroundImage: `url('/images/bg.png')`,
          minHeight: "50vh",
        }}
      >
        <h1
          className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg max-w-md lg:max-w-lg text-center px-6"
          style={{ fontFamily: "cursive" }}
        >
          Manage your tasks efficiently and stay organized.
        </h1>
      </div>
    </div>
  );
};

export default LoginPage;
