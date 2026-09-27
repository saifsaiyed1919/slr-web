export default function PendingUnlocksTable() {
  // Aage chalkar yahan pending tickets API se aayenge
  const pendingUnlocks = [
    { id: 1, brand: "Dell", model: "Precision 5550", issue: "Master Password", date: "27-Sep-2026" },
    { id: 2, brand: "HP", model: "ProBook 440 G9", issue: "Endpoint Security", date: "27-Sep-2026" },
  ];

  return (
    <table className="w-full text-left border-collapse min-w-[800px] animate-fade-in">
      <thead>
        <tr className="bg-srt-card border-b border-srt-hover text-sm text-srt-muted">
          <th className="p-4 font-semibold">Brand</th>
          <th className="p-4 font-semibold">Model</th>
          <th className="p-4 font-semibold">Issue Type</th>
          <th className="p-4 font-semibold">Added On</th>
          <th className="p-4 font-semibold text-center">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-srt-hover">
        {pendingUnlocks.map((job) => (
          <tr key={job.id} className="hover:bg-srt-panel transition-colors">
            <td className="p-4">{job.brand}</td>
            <td className="p-4">{job.model}</td>
            <td className="p-4 text-[#ff6b6b] font-semibold">{job.issue}</td>
            <td className="p-4 text-srt-muted">{job.date}</td>
            <td className="p-4 flex items-center justify-center gap-4">
              <button className="text-xs bg-srt-accent/20 text-srt-accent border border-srt-accent/50 px-3 py-1.5 rounded hover:bg-srt-accent hover:text-srt-bg transition-colors font-bold tracking-wide">
                PROCESS NOW
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}