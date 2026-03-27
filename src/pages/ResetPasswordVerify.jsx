import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

const ResetPasswordVerify = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    const { forgotPasswordVerify, isLoading, error, setField } = useAuthStore();
    const [code, setCode] = useState("");

    // Clear errors on mount
    useEffect(() => {
        setField("error", null);
    }, [setField]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length !== 6) return;

        const success = await forgotPasswordVerify(email, code);
        if (success) {
            navigate(`/reset-password?email=${encodeURIComponent(email)}&code=${code}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e1127] px-4">
            <div className="w-full max-w-md bg-[#141526] p-8 rounded-lg shadow-lg border border-[#1f2035] text-center">
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d7b3ff] text-[#0e1127] font-bold text-sm">C</div>
                    <span className="text-xl font-bold text-white">Collectly</span>
                </Link>

                <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-gray-400 mb-6 text-sm">
                    Enter the 6-digit code sent to <span className="text-[#d7b3ff] font-medium">{email}</span>
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="text"
                        maxLength="6"
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-4 text-center text-3xl tracking-[10px] rounded-md bg-[#1f2035] text-white focus:outline-none focus:ring-2 focus:ring-[#d7b3ff] font-mono border border-[#1f2035]"
                        autoFocus
                    />

                    {error && (
                        <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || code.length !== 6}
                        className="w-full p-3 bg-[#d7b3ff] text-[#0e1127] font-bold rounded-md hover:bg-[#c49eff] transition disabled:opacity-50"
                    >
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="text-sm text-gray-500 hover:text-white transition font-medium"
                    >
                        Try a different email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordVerify;
