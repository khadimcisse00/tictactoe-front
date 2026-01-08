"use client";

type Props = {
  valeur: string;
  onChange: (v: string) => void;
};

const avatars = Array.from({ length: 9 }).map(
  (_, i) => `/avatars/avatar${i + 1}.png`
);

export function SelectionAvatar({ valeur, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {avatars.map((src) => (
        <button
          type="button"
          key={src}
          onClick={() => onChange(src)}
          className={`border rounded-lg p-1 ${
            valeur === src ? "border-green-500" : "border-base-300"
          }`}
        >
          <img src={src} alt="avatar" className="w-full h-auto" />
        </button>
      ))}
    </div>
  );
}
