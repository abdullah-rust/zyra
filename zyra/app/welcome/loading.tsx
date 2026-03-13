export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8E2DE2] via-[#4A00E0] to-[#00d2ff]">
      {/* Animated Glowing Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Ring */}
        <div className="absolute w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>

        {/* Inner Pulsing Circle */}
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl animate-pulse">
          {/* Small Dot inside */}
          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
        </div>
      </div>

      {/* Loading Text with Shimmer Effect */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold text-white tracking-[0.2em] animate-pulse">
          ZYRA
        </h2>
        <div className="mt-2 flex gap-1 justify-center">
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}
