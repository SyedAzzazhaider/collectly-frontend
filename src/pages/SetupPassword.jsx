import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { Eye, EyeOff } from "lucide-react";

const SetupPassword = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session");
    const navigate = useNavigate();

    // Store Actions & State
    const {
        resumeSession,
        registerComplete,
        isLoading,
        error,
        tempEmail,
        setField
    } = useAuthStore();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState("");

    // Clear errors on mount
    useEffect(() => {
        setField("error", null);
    }, [setField]);

    // Resume Logic
    useEffect(() => {
        const initSession = async () => {
            if (!sessionId) {
                navigate('/login');
                return;
            }
            if (!tempEmail) {
                await resumeSession(sessionId);
            }
        };
        initSession();
    }, [sessionId, tempEmail, navigate, resumeSession]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError("");

        if (password !== confirmPassword) {
            setValidationError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters");
            return;
        }

        const success = await registerComplete(sessionId, password);
        if (success) {
            navigate("/"); // Redirect to dashboard
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e1127] px-4">
            <div className="w-full max-w-md bg-[#141526] p-8 rounded-lg shadow-lg border border-[#1f2035]">
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d7b3ff] text-[#0e1127] font-bold text-sm">C</div>
                    <span className="text-xl font-bold text-white">Collectly</span>
                </Link>

                <h2 className="text-2xl font-bold text-white mb-2 text-center">Set Your Password</h2>

                {tempEmail && (
                    <p className="text-center text-gray-400 text-sm mb-6">
                        for <span className="text-[#d7b3ff] font-medium">{tempEmail}</span>
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-md bg-[#1f2035] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d7b3ff] border border-[#1f2035]"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 rounded-md bg-[#1f2035] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d7b3ff] border border-[#1f2035]"
                        />
                    </div>

                    {(error || validationError) && (
                        <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center">
                            {validationError || error}
                            {typeof error === 'string' && error.includes("Session") && (
                                <button
                                    type="button"
                                    onClick={() => navigate('/signup')}
                                    className="block w-full mt-2 text-xs underline font-medium"
                                >
                                    Start Over
                                </button>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full p-3 bg-[#d7b3ff] text-[#0e1127] font-bold rounded-md hover:bg-[#c49eff] transition disabled:opacity-50 mt-2"
                    >
                        {isLoading ? "Setting Password..." : "Complete Registration"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default SetupPassword;
