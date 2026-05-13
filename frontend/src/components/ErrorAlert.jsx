export default function ErrorAlert({ message }) {
  return (
    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <h3 className="font-semibold mb-1">Erro</h3>
      <p>{message}</p>
    </div>
  );
}
