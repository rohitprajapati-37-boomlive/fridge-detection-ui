function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Type or speak an ingredient..."
      className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-96 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchBar;
