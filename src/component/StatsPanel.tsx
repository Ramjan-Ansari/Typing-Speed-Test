interface StatsPanelProps {
  label: string;
  value: string | number;
}

const StatsPanel = ({ label, value }: StatsPanelProps ) => {
  return (
    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
};

export default StatsPanel;
