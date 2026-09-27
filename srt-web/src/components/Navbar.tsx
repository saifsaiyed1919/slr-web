export default function Navbar() {
  return (
    <header className="h-16 bg-srt-panel/70 backdrop-blur-md border-b border-srt-hover flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-bold text-srt-text">Workspace Overview</h2>
      
      {/* User Profile Area */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-srt-muted">Saif S. Saiyed (L3)</span>
        <div className="w-9 h-9 rounded-full bg-srt-card border border-srt-accent flex items-center justify-center text-srt-accent font-bold">
          SS
        </div>
      </div>
    </header>
  );
}