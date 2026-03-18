interface ResultPanelProps {
  label : string;
  value : string | number ;
}

const ResultPanel = ({ label, value }: ResultPanelProps ) => {
  return (
    <div>
      <div className="font-semibold">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
};

export default ResultPanel;
