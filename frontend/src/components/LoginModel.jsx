import React from "react";

import { motion, scale } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { RxCross1 } from "react-icons/rx";
import { signInWithPopup } from "@firebase/auth";
import { auth, provider } from "../utils/firebase";
import api from "../utils/axios";

function LoginModel({ onclose, setuser }) {
  const handlegoogleauth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const response = await api.post("api/auth/login", { token });
      setuser(response?.data.user);
      onclose();
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
      <div className="relative w-full max-w-sm bg-black backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 text-white">
        {onclose && (
          <button
            onClick={onclose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          >
            <RxCross1 size={18} />
          </button>
        )}

        {/* Header Section */}
        <div className="text-center mt-2 mb-6">
          <h2 className="text-xl font-semibold tracking-wide">
            Sign In to CareerPal
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Continue your AI interview journey
          </p>
        </div>

        {/* Google Sign-In Button */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlegoogleauth}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl transition-all duration-200 text-sm font-medium shadow-inner"
          >
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </motion.button>
        </div>

        {/* Footer Text */}
        <div className="text-center border-t border-white/5 pt-4">
          <p className="text-[11px] text-zinc-500">
            Secure authentication powered by Firebase
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModel;
