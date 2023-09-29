import { type Pokemon } from "@/app/page";
import Image from "next/image";

interface InfoCardProps {
  pokemon: Pokemon;
}

export default function InfoCard({ pokemon }: InfoCardProps) {
  return (
    <div key={pokemon.name} className="border border-white p-2 rounded-sm">
      <img
        src={pokemon.image.front}
        alt={pokemon.name}
        className="w-20 h-20 mx-auto"
      />
      <h3 className="capitalize font-semibold text-lg">{pokemon.name}</h3>
      <div className="flex justify-between">
        {pokemon.types.map((t) => (
          <span key={t} className="capitalize">
            {t}
          </span>
        ))}
      </div>
      <button className="text-blue-500 hover:underline">See more</button>
    </div>
  );
}
