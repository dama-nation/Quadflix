import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authUser';
import quadflixLogo from '../../assets/quadflix_logo.jpg';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const res = await signup({ username, email, password });
            if (!res.success) {
                setErrorMsg(res.message || 'Signup failed. Please try again.');
            } else {
                navigate('/');
            }
        } catch (err) {
            setErrorMsg('A network error occurred. Is your backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-cyan-500 selection:text-black">
            
            {/* Background Effects (Matched to your Login Page) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Branding */}
            <div className="relative z-10 mb-8 text-center flex flex-col items-center animate-[fadeInUp_0.8s_ease-out_forwards]">
                <Link to="/" className="flex flex-col items-center gap-4 group">
                    <img src={quadflixLogo} alt="Quadflix" className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-shadow duration-500" />
                    <h1 className="text-3xl md:text-4xl font-black tracking-widest text-white drop-shadow-md">
                        QUAD<span className="text-cyan-500">FLIX</span>
                    </h1>
                </Link>
                <p className="text-zinc-400 text-sm mt-3 font-medium tracking-wide">
                    Create your account to start streaming
                </p>
            </div>

            {/* Form Card */}
            <div className="relative z-10 w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 shadow-2xl opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center animate-pulse">
                            {errorMsg}
                        </div>
                    )}

                    <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            required
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-zinc-500"
                        />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-zinc-500"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-950/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-zinc-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign Up <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>

                <p className="mt-6 text-center text-zinc-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;