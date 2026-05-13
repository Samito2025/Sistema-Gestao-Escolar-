export default function SuccessAlert({ message }) {
  return (
    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
      <h3 className="font-semibold mb-1">Sucesso</h3>
      <p>{message}</p>
    </div>
  );
}
