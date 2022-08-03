import React, { useEffect, useState, useMemo } from "react";
import { Pokemon, getAll, getByName } from "./API";

import "./styles.css";

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
}> = ({ pokemon }) => {
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
};

let appRender = 0;
export default function App() {
  console.log(`App Render = ${appRender++}`);

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [threshold, setThreshold] = useState(0);

  useEffect(() => {
    getAll().then(setPokemons);
  }, []);

  const pokemonsWithPower: Pokemon[] = pokemons.map((p: Pokemon) => ({
    ...p,
    power: calculatePower(p),
  }));

  const countOverThreshold = pokemonsWithPower.filter(
    (p) => p.power > threshold
  ).length;

  const onSetThreshold = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setThreshold(parseInt(value, 0));

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
          <div>Min: </div>
          <div>Max: </div>
        </div>
      </div>
    </div>
  );
}
