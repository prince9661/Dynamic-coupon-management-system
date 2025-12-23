import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function Landing() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] relative overflow-hidden font-sans selection:bg-[#58a6ff] selection:text-[#0d1117]">

            {/* Dynamic Background */}
            <div className="absolute inset-0 opacity-[0.1]" style={{
                backgroundImage: 'linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)',
                backgroundSize: '80px 80px',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
            }}></div>

            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-[1280px] mx-auto px-4 h-[62px] flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link to="/" className="group flex items-center gap-2 transition-opacity hover:opacity-90">
                            <span className="text-[24px] font-extrabold tracking-tight bg-gradient-to-r from-white via-[#c9d1d9] to-white bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                COUPON PULSE
                            </span>
                        </Link>

                        {/* Nav Links - Updated as per request */}
                        <nav className="hidden md:flex items-center gap-6 text-[14px] font-semibold text-white">
                            <a href="#features" className="hover:text-white/70 transition-colors cursor-pointer">Features</a>
                            <a href="#creators" className="hover:text-white/70 transition-colors cursor-pointer">Creators</a>
                            {isAuthenticated && (
                                <Link to="/dashboard" className="text-[#3fb950] hover:text-[#2ea043] transition-colors cursor-pointer flex items-center gap-1">
                                    Dashboard &rarr;
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* Actions - Search Removed */}
                    {/* Actions - Search Removed */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="text-[14px] font-semibold text-white border border-white/20 rounded-md px-3 py-1.5 hover:border-white/50 transition-colors">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-[14px] font-semibold text-white hover:text-white/70 transition-colors">Sign in</Link>
                                <Link to="/register" className="text-[14px] font-semibold text-white border border-white/20 rounded-md px-3 py-1.5 hover:border-white/50 transition-colors">Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-48 pb-32 px-4">
                <div className="max-w-[1280px] mx-auto grid md:grid-cols-12 gap-12">
                    {/* Left Column - Content */}
                    <div className="md:col-span-7 flex flex-col items-start text-left">

                        {/* Eyebrow Removed */}

                        <h1 className="text-[64px] md:text-[80px] font-semibold text-white leading-[1.1] tracking-tight mb-8">
                            Manage coupons. <br />
                            <span className="text-[#8b949e]">Dynamically.</span>
                        </h1>

                        <p className="text-[20px] md:text-[24px] text-[#8b949e] leading-relaxed mb-10 max-w-[600px]">
                            COUPON PULSE is a real-time coupon management system built for developers.
                            Create, validate, and track usage securely and instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            {/* Email Signup Input Group */}
                            {/* Email Signup Input Group */}
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="bg-[#238636] text-white font-bold px-8 py-4 rounded-md hover:bg-[#2ea043] transition-colors whitespace-nowrap text-lg shadow-[0_0_20px_rgba(35,134,54,0.5)]">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <div className="flex w-full sm:w-auto bg-white rounded-md p-1 pl-4">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="flex-1 bg-transparent text-[#0d1117] placeholder-[#57606a] outline-none text-[16px]"
                                    />
                                    <Link to="/register" className="bg-[#238636] text-white font-bold px-6 py-3 rounded-md hover:bg-[#2ea043] transition-colors whitespace-nowrap">
                                        Sign up for COUPON PULSE
                                    </Link>
                                </div>
                            )}

                            {/* Enterprise Link Removed */}
                        </div>
                    </div>

                    {/* Right Column - Visual/Code */}
                    <div className="md:col-span-5 relative">
                        {/* Code Window */}
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl p-4 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 origin-bottom-right">
                            {/* Window Controls */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                            </div>
                            {/* Code */}
                            <div className="font-mono text-[14px]">
                                <div className="text-[#8b949e]">import</div> <div className="text-white inline">COUPON PULSE</div> <div className="text-[#8b949e] inline">from</div> <div className="text-[#a5d6ff] inline">'@couponpulse/sdk'</div>;
                                <br /><br />
                                <div className="text-[#ff7b72]">const</div> <div className="text-[#d2a8ff] inline">client</div> = <div className="text-[#ff7b72]">new</div> <div className="text-[#f0883e] inline">COUPON PULSE</div>({'{'}
                                <div className="pl-4 text-[#79c0ff]">apiKey</div>: <div className="text-[#a5d6ff] inline">'cp_live_...'</div>
                                {'}'});
                                <br /><br />
                                <div className="text-[#8b949e]">// Validate a coupon</div>
                                <div className="text-[#ff7b72]">await</div> <div className="text-[#d2a8ff] inline">client</div>.<div className="text-[#d2a8ff] inline">validate</div>(<div className="text-[#a5d6ff] inline">'SUMMER2025'</div>);
                            </div>
                        </div>
                        {/* Decoration Behind */}
                        <div className="absolute -z-10 top-10 right-10 w-full h-full border border-[#30363d] rounded-lg opacity-50"></div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 relative z-10 px-4">
                <div className="max-w-[1280px] mx-auto">
                    <div className="mb-12">
                        <span className="text-[#3fb950] font-semibold text-[16px] mb-2 block">Productivity</span>
                        <h2 className="text-[40px] md:text-[52px] font-semibold text-white leading-tight">
                            Accelerate high-quality <br />
                            promotional campaigns.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Large Card */}
                        <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl p-10 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-white text-[24px] font-semibold mb-4">Dynamic Engine</h3>
                                <p className="text-[#8b949e] text-[16px] max-w-[400px]">
                                    Generate precise percentage or flat rate coupons. Set expiry rules, usage limits, and automatic invalidation logic with granular control.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#238636]/20 to-transparent rounded-bl-full pointer-events-none"></div>
                        </div>

                        {/* Tall Card */}
                        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-10 relative overflow-hidden lg:row-span-2 group">
                            <h3 className="text-white text-[24px] font-semibold mb-4">Real-time Tracking</h3>
                            <p className="text-[#8b949e] text-[16px] mb-8">
                                Monitor coupon usage instances instantly. Prevent abuse and adhere to budget limits with live analytics.
                            </p>
                            <div className="w-full h-[200px] bg-[#0d1117] border border-[#30363d] rounded-lg p-4 font-mono text-[12px] text-white opacity-80 group-hover:opacity-100 transition-opacity">
                                {'>'} Stream connected...<br />
                                {'>'} Coupon <span className="text-[#3fb950]">REDEEMED</span><br />
                                {'>'} User: user_123<br />
                                {'>'} Value: $50.00
                            </div>
                        </div>

                        {/* Small Card */}
                        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-10 relative overflow-hidden group">
                            <h3 className="text-white text-[24px] font-semibold mb-4">Admin Control</h3>
                            <p className="text-[#8b949e] text-[16px]">
                                Centralized dashboard for campaign management. View detailed analytics and control coupon behavior securely.
                            </p>
                        </div>

                        {/* Small Card */}
                        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-10 relative overflow-hidden group">
                            <h3 className="text-white text-[24px] font-semibold mb-4">Secure by Design</h3>
                            <p className="text-[#8b949e] text-[16px]">
                                Strict ACLs, session-based auth, and encrypted coupon generation logic.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Creators Section */}
            <section id="creators" className="py-24 relative z-10 px-4 border-t border-[#30363d] bg-[#161b22]/30">
                <div className="max-w-[1280px] mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-[40px] font-semibold text-white mb-4">Meet the Creators</h2>
                        <p className="text-[#8b949e] text-[20px]">The team behind COUPON PULSE.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-12">
                        {/* Creator 1: Aditya Raj */}
                        <div className="w-[300px] group cursor-pointer">
                            {/* Retro Card Frame */}
                            <div className="bg-[#e6e6e6] rounded-[24px] rounded-tl-[8px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 group-hover:-translate-y-2 relative">
                                {/* Top Decoration (Dots) */}
                                <div className="flex justify-center gap-3 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-[#ff7b72] border border-black/10 shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#ff7b72] border border-black/10 shadow-sm"></div>
                                </div>

                                {/* Inner Image Box */}
                                <div className="bg-[#0d1117] rounded-[16px] aspect-square mb-6 border-4 border-[#0d1117] shadow-inner relative overflow-hidden flex items-center justify-center">
                                    {/* Real Image */}
                                    <img
                                        src="/Adi.jpeg"
                                        alt="Aditya Raj"
                                        className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105 image-pixelated"
                                    />
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none opacity-40"></div>
                                </div>

                                {/* Bottom Decoration (Button) */}
                                <div className="flex justify-start">
                                    <div className="w-5 h-5 rounded-full bg-[#ff7b72] border border-black/10 shadow-sm"></div>
                                </div>
                            </div>

                            {/* Text Info */}
                            <div className="text-center mt-6">
                                <h3 className="text-white text-[24px] font-bold tracking-wide mb-1">Aditya Raj</h3>
                                <p className="text-[#8b949e] text-[20px]">UI/UX & Frontend Designer & Backend Contributor</p>
                            </div>
                        </div>

                        {/* Creator 2: Prince Kumar */}
                        <div className="w-[300px] group cursor-pointer">
                            {/* Retro Card Frame */}
                            <div className="bg-[#e6e6e6] rounded-[24px] rounded-tl-[8px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 group-hover:-translate-y-2 relative">
                                {/* Top Decoration (Dots) */}
                                <div className="flex justify-center gap-3 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-[#ff7b72] border border-black/10 shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#ff7b72] border border-black/10 shadow-sm"></div>
                                </div>

                                {/* Inner Image Box */}
                                <div className="bg-[#0d1117] rounded-[16px] aspect-square mb-6 border-4 border-[#0d1117] shadow-inner relative overflow-hidden flex items-center justify-center">
                                    {/* Real Image */}
                                    <img
                                        src="/Prince.jpeg"
                                        alt="Prince Kumar"
                                        className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105 image-pixelated"
                                    />
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none opacity-40"></div>
                                </div>

                                {/* Bottom Decoration (Button) */}
                                <div className="flex justify-start">
                                    <div className="w-5 h-5 rounded-full bg-[#ff7b72] border border-black/10 shadow-sm"></div>
                                </div>
                            </div>

                            {/* Text Info */}
                            <div className="text-center mt-6">
                                <h3 className="text-white text-[24px] font-bold tracking-wide mb-1">Prince Kumar</h3>
                                <p className="text-[#8b949e] text-[20px]">Backend Developer & Bug Fixer</p>
                            </div>
                        </div>

                        {/* Creator 3: Mayank Yadav */}
                        <div className="w-[300px] group cursor-pointer">
                            {/* Retro Card Frame */}
                            <div className="bg-[#e6e6e6] rounded-[24px] rounded-tl-[8px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform transition-transform duration-300 group-hover:-translate-y-2 relative">
                                {/* Top Decoration (Dots) */}
                                <div className="flex justify-center gap-3 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-[#ff7b72] border border-black/10 shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#ff7b72] border border-black/10 shadow-sm"></div>
                                </div>

                                {/* Inner Image Box */}
                                <div className="bg-[#0d1117] rounded-[16px] aspect-square mb-6 border-4 border-[#0d1117] shadow-inner relative overflow-hidden flex items-center justify-center">
                                    {/* Real Image */}
                                    <img
                                        src="/Mayank.jpeg"
                                        alt="Mayank Yadav"
                                        className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105 image-pixelated"
                                    />
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none opacity-40"></div>
                                </div>

                                {/* Bottom Decoration (Button) */}
                                <div className="flex justify-start">
                                    <div className="w-5 h-5 rounded-full bg-[#ff7b72] border border-black/10 shadow-sm"></div>
                                </div>
                            </div>

                            {/* Text Info */}
                            <div className="text-center mt-6">
                                <h3 className="text-white text-[24px] font-bold tracking-wide mb-1">Mayank Yadav</h3>
                                <p className="text-[#8b949e] text-[20px]">Backend Script Developer & Contributor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >


            {/* Footer */}
            < footer className="bg-[#0d1117] py-12 px-4 border-t border-[#30363d]" >
                <div className="max-w-[1280px] mx-auto grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-[#8b949e]">
                            <span className="text-[12px]">© 2025 COUPON PULSE System</span>
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    );
}
