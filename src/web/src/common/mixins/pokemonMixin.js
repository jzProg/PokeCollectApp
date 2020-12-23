import { mapGetters } from 'vuex';

const Pokedex = require('pokeapi-js-wrapper');
const P = new Pokedex.Pokedex();

const pokemonMixin = {
  data() {
    return {
      totalPokemon: 300, // TODO map by region (?)
      imageAPI: 'https://pokeres.bastionbot.org/images/pokemon/',
      startersInfo: {
        NUM_OF_STARTERS: 3,
        STANDARD_STARTERS: ['bulbasaur', 'squirtle', 'charmander'],
      },
      coinsInfo: {
        START_COINS: 100,
        REWARD_COINS: 200,
      },
      packInfo: {
        NUM_OF_CARDS: 2,
      },
      gameRewards: [
        {
           type: 'item',
        },
        {
          type: 'pokemon',
        }
      ],
      prizes: {
        PACK: {
          type: 'pack',
          items: [{ title: 'pokemon pack', quantity: 1, price: 700 }],
        },
        STONE: {
         type: 'stone',
         items: [{ title: 'fire-stone', quantity: 1, price: 2500 },
                  { title: 'water-stone', quantity: 1, price: 220 },
                  { title: 'thunder-stone', quantity: 1, price: 2700 }],
        }
      },
      avatars: {
        1: {
          name: 'Ash',
          image: 'avatar-1.png',
          pokemon: {
            0 : [
              'charmander',
              'bulbasaur',
              'squirtle',
              'pikachu',
              'pidgeotto',
              'butterfree'
            ],
            1: [
              'pikachu',
              'kingler',
              'snorlax',
              'charmeleon',
              'totodile',
              'Muk'
            ] ,
            2: [
              'charizard',
              'pikachu',
              'chicorita',
              'pidgeon',
              'primeape',
              'lapras'
            ]
          }
        },
        2: {
          name: 'Brock',
          image: 'avatar-2.png',
          pokemon: {
            0: [
              'zubat',
              'geodude',
              'onix',
              'chansey',
              'mudkip',
              'vulpix'
            ],
            1: [
              'vulpix',
              'geodude',
              'golbat',
              'onix',
              'marshtomp',
              'bonsly'
            ],
            2: [
              'steelix',
              'golbat',
              'geodude',
              'crobat',
              'sudowoodo',
              'ludicolo'
            ]
          }
        },
        3: {
          name: 'Gary',
          image: 'avatar-3.png',
          pokemon: {
            0: [
              'squirtle',
              'eevee',
              'krabby',
              'arcanine',
              'doduo',
              'hoothoot'
            ],
            1: [
              'wartortle',
              'eevee',
              'electivire',
              'nidoking',
              'arcanine',
              'dodrio'
            ],
            2: [
              'blastoise',
              'umbreon',
              'golem',
              'scizor',
              'magmar',
              'nidoqueen'
            ]
          }
        },
        4: {
          name: 'Misty',
          image: 'avatar-4.png',
          pokemon: {
            0: [
              'staryu',
              'psyduck',
              'corsola',
              'horsea',
              'goldeen',
              'poliwag'
            ],
            1: [
              'starmie',
              'goldeen',
              'azurill',
              'poliwhirl',
              'caserin',
              'togepi'
            ],
            2: [
              'gyarados',
              'politoed',
              'togetic',
              'scizor',
              'starmie',
              'golduck'
            ]
          }
        },
        5: {
          name: 'Team Rocket',
          image: 'avatar-5.jpg',
          pokemon: {
            0: [
              'meowth',
              'magikarp',
              'ekans',
              'bellsprout',
              'cacnea',
              'koffing'
            ],
            1: [
              'ditto',
              'wobbuffet',
              'victreebel',
              'growlie',
              'weezing',
              'arbok'
            ],
            2: [
              'gyarados',
              'lickitung',
              'wobbuffet',
              'mimikyu',
              'arbok',
              'weezing'
            ]
          }
        },
      },
    }
  },
  methods: {
    getPokemon(nameOrId) {
      return P.getPokemonByName(nameOrId);
    },
    getPokemonSpecies(nameOrId) {
      return P.getPokemonSpeciesByName(nameOrId);
    },
    getPokemonImage(id) {
      return this.imageAPI + id + '.png';
    },
    getItem(itemName) {
      return P.getItemByName(itemName);
    },
    getPokemonInfoFromList(listOfPokemon, listToFill) {
      while(listToFill.length > 0) {
        listToFill.pop();
      }
      return Promise.all(listOfPokemon.map(this.getPokemon)).then(data => {
        return Promise.all(listOfPokemon.map(this.getPokemonSpecies)).then(data2 => {
           data2.forEach((res, i) => {
             const image = this.getPokemonImage(data[i].id);
             Object.assign(data[i], { color: res.color.name, pokeImage: image, description: res.flavor_text_entries[0].flavor_text, level: 1 });
             if (listToFill.filter(e => e.name === data[i].name).length <= 0) {
               const { id, name, stats, height, weight, types, sprites, moves, base_experience, color, pokeImage, description, level } = data[i];
               listToFill.push({ id, name, stats, height, weight, types, level,
                                 sprites: { back_default: sprites.back_default, front_default: sprites.front_default },
                                 moves: { 0: { move: moves[0].move}, 1: { move: moves[1].move }, 2: { move: moves[2].move }, 3: { move: moves[3].move }},
                                 base_experience, color, pokeImage, description });
             }
           });
        });
      });
    },
    chooseRandomPokemon(min, max) {
      let randomId = this.getRandomInt(min, max);
      while((this.getUserPokemon || []).filter(pokemon => pokemon.id === randomId).length) {
        randomId = this.getRandomInt(min, max);
      }
      return randomId;
    },
  },
  computed: {
    ...mapGetters([
      'getUserPokemon',
    ]),
  }
};

export default pokemonMixin;
