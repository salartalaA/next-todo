"use client";

import { login } from "@/actions/auth";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import SubmitButton from "@/app/components/SubmitButton";
import AuthContext from "@/app/context/AuthContext";
import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "@/app/assets/Logo.png";
import Image from "next/image";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [state, setState] = useState(null);
  const { loginContext } = useContext(AuthContext);

  const formAction = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const response = await login(null, formData);

    setState(response);
  };

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success(state.success);
      loginContext(state?.user);
      window.location.reload();
      window.location.replace("/");
    }
  }, [state]);

  return (
    <main>
      <div className="bg-primary text-white min-h-screen">
        <div className="w-1/2 min-h-screen mx-auto p-4 rounded-lg">
          <Image
            className="mx-auto my-8 md:my-16 cursor-pointer"
            src={Logo}
            alt="logo"
          />
          <div className="bg-secondary max-w-96 mx-auto rounded-md flex flex-col">
            <div className="md:flex md:justify-around pt-8">
              <div className="mb-4 w-fit mx-auto md:mx-0">
                <Link
                  href="/auth/login"
                  className="mx-1 px-4 py-1 rounded-md text-center shadow-md border-2 bg-purple-900"
                >
                  <span className="mx-2">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  Login
                </Link>
              </div>
              <div className="w-fit mx-auto md:mx-0">
                <Link
                  href="/auth/register"
                  className="font-semibold text-sm mx-1 px-4 py-1 rounded-md text-white text-center shadow-md border-2 bg-blue-900"
                >
                  <span className="mx-2">
                    <FontAwesomeIcon icon={faUserPlus} />
                  </span>
                  Signup
                </Link>
              </div>
            </div>
            <form onSubmit={formAction}>
              <div className="text-xs font-bold">
                <div className="m-4 mt-12">
                  <label htmlFor="email">Email</label>
                  <span className="text-red-600 mx-1">&#42;</span>
                  <input
                    className="outline-none w-full border-2 mt-3 p-2 border-slate-100 focus:border-slate-400 focus:shadow-md transition-all rounded-md text-primary"
                    name="email"
                    type="text"
                    id="email"
                  />
                </div>
                <div className="m-4">
                  <label htmlFor="password">Password</label>
                  <span className="text-red-600 mx-1">&#42;</span>
                  <input
                    className="outline-none w-full border-2 mt-3 p-2 border-slate-100 focus:border-slate-400 focus:shadow-sm transition-all rounded-md text-primary"
                    name="password"
                    type="password"
                    id="password"
                  />
                </div>
              </div>
              <div className="mx-4">
                <SubmitButton title="Login" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
