function DetectedItems({ items }) {
  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-lg font-medium capitalize">{item}</p>
        </div>
      ))}
    </div>
  );
}

export default DetectedItems;
