export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  types: PokemonType[];
  sprites: {
    front_default: string;
    back_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemons(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error("failed to bring pokemon");
  }
  return response.json();
}

export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error(`failed to bring pokemon: ${nameOrId}`);
  }
  return response.json();
}
