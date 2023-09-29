"use client";
import InfoCard from "@/components/info-card";
import { FormEvent, useEffect, useState } from "react";

export type Pokemon = {
  id: number;
  name: string;
  image: {
    front: string;
    back: string;
  };
  types: string[];
  weight: number;
};

export default function Home() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const data = await response.json();

        const urls = data.results.map((p: { url: string }) => p.url);

        const pokemonData = await Promise.all(
          urls.map(async (url: string) => {
            const response = await fetch(url);
            const p = await response.json();

            return {
              id: p.id,
              name: p.name,
              image: {
                front: p.sprites.front_default,
                back: p.sprites.back_default,
              },
              types: p.types.map(
                (t: { type: { name: string } }) => t.type.name
              ),
              weight: p.weight,
            };
          })
        );

        setPokemon(pokemonData);
        setSelectedPokemon(pokemonData[0]);
      } catch (error) {
        console.error("Error fetching all pokemon", error);
        alert("Error fetching all pokemon");
      } finally {
        setInitialLoading(false);
      }
    };

    // setTimeout(() => {
    //   fetchPokemon();
    // }, 3000);
    fetchPokemon();
  }, []);

  const createID = (id: number) => {
    let res = "000";
    if (id < 10) {
      res = `00${id}`;
    } else if (id < 100) {
      res = `0${id}`;
    } else {
      res = `${id}`;
    }

    return res;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPokemon((prev) => {
      return prev.filter((p) => p.name.includes(search.toLowerCase()));
    });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="px-8 py-4 border-b border-b-white sticky top-0 bg-black">
        <h1 className="font-bold text-4xl">Pokémon ting</h1>
      </header>
      <main className="flex flex-col items-center mt-40 gap-8 pb-12">
        <div className=" bg-yellow-500/60 flex flex-col relative w-[30rem] border-2 border-gray-700">
          <section className="bg-yellow-200/60 h-12 flex pl-4 justify-between items-start border-b-4 border-gray-700">
            <div className="bg-red-400 my-auto rounded-full px-1 border-2 border-gray-700">
              <h2 className="font-bold text-lg flex justify-between gap-4">
                <span>O</span>SINNOH POKéDEX<span>O</span>
              </h2>
            </div>
            <div className="flex items-center justify-center w-1/6 h-full border-l-4 border-gray-700 bg-lime-200/70">
              <button onClick={() => console.log("search")}>Search</button>
            </div>
          </section>
          {!initialLoading && pokemon ? (
            <section className="flex justify-between">
              <div className="h-40 w-40 mx-4 my-6 rounded-2xl p-2 bg-yellow-200/90 border-4 border-gray-700">
                <img
                  src={
                    selectedPokemon
                      ? selectedPokemon.image.front
                      : pokemon[0].image.front
                  }
                  alt=""
                  className="w-full h-full object-cover bg-gray-200 rounded-xl border-4 border-gray-500/70 hover:bg-gray-100 transition-colors duration-200"
                />
              </div>
              <div className="flex-1 mr-4 h-52 overflow-y-scroll">
                <ul className="flex flex-col gap-2 py-2 text-gray-700 font-bold">
                  {pokemon.map((p: Pokemon) => (
                    <li
                      key={p.id}
                      className={`flex rounded-2xl shadow-md hover:cursor-pointer ${
                        selectedPokemon?.id === p.id
                          ? "bg-yellow-200"
                          : "bg-yellow-200/80 hover:bg-yellow-200 transition-colors duration-300"
                      }`}
                      onClick={() => setSelectedPokemon(p)}
                    >
                      <h3 className="flex items-center gap-2">
                        <div className="h-6 w-6 m-1 rounded-full bg-yellow-500/50" />
                        <span>{createID(p.id)}</span>
                        {p.name.toUpperCase()}
                      </h3>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : (
            <section className="flex justify-between animate-pulse">
              <div className="h-40 w-40 mx-4 my-6 rounded-2xl p-2 bg-yellow-200/90 border-4 border-gray-700">
                <div className="w-full h-full bg-gray-200 rounded-xl border-4 border-gray-500/70" />
              </div>
              <div className="flex-1 mr-4 h-52 overflow-y-scroll">
                <ul className="flex flex-col gap-2 h-full py-2 text-gray-700 font-bold">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <li
                      key={num}
                      className="flex h-1/5 rounded-2xl shadow-md hover:cursor-pointer bg-yellow-200/80"
                    />
                  ))}
                </ul>
              </div>
            </section>
          )}
          <section className="bg-yellow-200/60 h-20 text-lg flex justify-between pl-4 items-start sticky top-0 border-t-4 border-gray-700">
            <div className="flex flex-1 justify-between">
              <div className="flex flex-col w-28 pt-2">
                <h3 className="">SEEN</h3>
                <p className="ml-auto">191</p>
              </div>
              <div className="flex flex-col w-28 pt-2 mr-8">
                <h3 className="">OBTAINED</h3>
                <p className="ml-auto">029</p>
              </div>
            </div>
            <div className="w-1/6 h-full ml-auto border-l-4 border-gray-700 bg-lime-200/70" />
          </section>
        </div>
      </main>
    </div>
  );
}
