import "./styles.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { getAll, Pokemon } from "./API";

interface PokemonWithPower extends Pokemon {
  power: number;
}

const calculatePower = (pokemon: Pokemon) =>
  pokemon.hp +
  pokemon.attack +
  pokemon.defense +
  pokemon.special_attack +
  pokemon.special_defense +
  pokemon.speed;

let tableRender = 0;
const PokemonTable: React.FunctionComponent<{
  pokemon: PokemonWithPower[];
}> = React.memo(({ pokemon }: { pokemon: PokemonWithPower[] }) => {
  console.log(`Table Render = ${tableRender++}`);

  return (
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Type</td>
          <td colSpan={6}>Stats</td>
          <td>Power</td>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type.join(",")}</td>
            <td>{p.hp}</td>
            <td>{p.attack}</td>
            <td>{p.defense}</td>
            <td>{p.special_attack}</td>
            <td>{p.special_defense}</td>
            <td>{p.speed}</td>
            <td>{p.power}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

let appRender = 0;
export default function App() {
  console.log(`App Render = ${appRender++}`);

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [threshold, setThreshold] = useState(0);

  useEffect(() => {
    getAll().then(setPokemons);
  }, []);

  const pokemonsWithPower: Pokemon[] = useMemo(
    () =>
      pokemons.map((p: Pokemon) => ({
        ...p,
        power: calculatePower(p),
      })),
    [pokemons]
  );

  const countOverThreshold = useMemo(
    () => pokemonsWithPower.filter((p) => p.power > threshold).length,
    [pokemonsWithPower, threshold]
  );

  const onSetThreshold = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
      setThreshold(parseInt(value, 0)),
    []
  );

  const min = useMemo(
    () => Math.min(...pokemonsWithPower.map((p) => p.power)),
    [pokemonsWithPower]
  );

  const max = useMemo(
    () => Math.max(...pokemonsWithPower.map((p) => p.power)),
    [pokemonsWithPower]
  );

  return (
    <div>
      <div className="top-bar">
        <div>Search</div>
        <input type="text"></input>
        <div>Power threshold</div>
        <input type="text" value={threshold} onChange={onSetThreshold} />
        <div>Count over threshold: {countOverThreshold}</div>
      </div>
      <div className="two-column">
        <PokemonTable pokemon={pokemonsWithPower} />
        <div>
          <div>Min: {min}</div>
          <div>Max: {max}</div>
        </div>
      </div>
    </div>
  );
}
