// ChatSearchInput.jsx
import React, { useState } from "react";

const ChatSearchInput = ({ onQueryResult }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError("");
        try {
            const response = await fetch(
                `https://ifn.coolify.vps.boomlive.in/find_recipe_by_query?query=${encodeURIComponent(query)}`
            );
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            onQueryResult(data); // Pass API result to parent
        } catch (e) {
            setError("Something went wrong. Try again.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-2 my-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    className="border-2 border-gray-200 p-3 rounded-xl flex-1 focus:border-red-500 focus:outline-none"
                    placeholder="Or, ask me in chat (e.g. 'Any brinjal recipes?')"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 transition-colors"
                >
                    {loading ? "Searching..." : "Ask"}
                </button>
            </div>
            {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
    );
};

export default ChatSearchInput;
