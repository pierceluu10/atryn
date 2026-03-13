"use client";

const suggestions = [
  "Find AI and ML labs",
  "Show me robotics professors",
  "Mental health support",
  "Startup opportunities",
  "Undergraduate research",
  "Career services",
];

interface Props {
  onSelect: (text: string) => void;
}

export default function SuggestionChips({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="text-xs border border-primary/20 text-primary bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
