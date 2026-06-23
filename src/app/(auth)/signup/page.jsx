"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signUp, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const { data: session } = authClient.useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    const validatePassword = (pass) => {
        const hasUppercase = /[A-Z]/.test(pass);
        const hasLowercase = /[a-z]/.test(pass);
        const isLongEnough = pass.length >= 6;
        return hasUppercase && hasLowercase && isLongEnough;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error("Please enter your name");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("Password must contain at least 1 uppercase letter, 1 lowercase letter, and be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            await signUp.email({
                email,
                password,
                name,
                image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
                callbackURL: "/lessons",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Account created successfully!");
                        setLoading(false);
                        router.push("/lessons");
                        router.refresh();
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Failed to create account. Please try again.");
                        setLoading(false);
                    }
                }
            });
        } catch (err) {
            toast.error("An unexpected error occurred.");
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/lessons"
            });
        } catch (err) {
            toast.error("Google sign in failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden transition-colors duration-300">
            {/* Background glowing decorations */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-500/5"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl dark:bg-indigo-500/5"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8 z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Join Lexmora to explore premium life lessons
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                    <div>
                        <label htmlFor="signup-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <User className="h-5 w-5" />
                            </span>
                            <input
                                id="signup-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="signup-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Mail className="h-5 w-5" />
                            </span>
                            <input
                                id="signup-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="signup-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <Lock className="h-5 w-5" />
                            </span>
                            <input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none rounded"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Must include at least 1 uppercase, 1 lowercase letter, and 6+ characters.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    aria-label="Sign up with Google"
                    className="w-full py-3 px-4 bg-white dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 outline-none"
                >
                    <FcGoogle className="h-5 w-5" />
                    Google
                </button>

                <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
