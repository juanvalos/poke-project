import { useEffect } from 'react';
import { useState } from 'react';
import './App.css'
import ScreenPokemones from './components/ScreenPokemones.jsx';
import BattleScreen from './components/BattleScreen.jsx';
function App() {
  
  const [pokemones, setPokemones] = useState ('');
  const [position, setPosition] = useState (0); 
  
  const [myHealth, setHealth] = useState ([100]); 
  const [enemyHealth, setEnemyHealth] = useState ([100]); 

  const [] = useState(false);
  
  const [myPokeSelection, setMyPockeSelection] = useState ([100]); 
  const [computerRandomSelection, setComputerRandomSelection] = useState ([100]); 
  const [startGame, setStartGame] = useState(false);


  const pokeUrl ='https://pokeapi.co/api/v2/pokemon';
  
  const fetchData = async(url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const pokemonData = async (pokeUrl) => {
    const response = await fetchData (pokeUrl);
    
    const dataPromises = response.results.map((poke) => (
      fetchData(pokeUrl +'/'+ poke.name)
    ));
    
    const pokemonWithImages = await Promise.all(dataPromises)
    
    const addAttack = pokemonWithImages.map((pokemon) => {
      const attackValue = pokemon.moves.map((move) => ({
        ...move,
        attack: Math.floor(Math.random() * 50),
      }));

      return { ...pokemon, moves: attackValue };
    });

    console.log(addAttack);
    setPokemones(addAttack);
    // console.log(pokemonWithImages);
  };

  const handleSelection = (foward) => {
    console.log(foward);
    
    if (foward && position < 0) return;
    if (foward && position > 20) return;
    
    if (!foward){
      setPosition (position - 1);
    }
    
    else {
      setPosition (position + 1);
    }
    //console.log(position);
  };
  
  const filterSelection = () => {
    const mySelection = pokemones.filter((value, idx) => position === idx);
    setMyPockeSelection (mySelection);
    console.log(mySelection);

    computerSelection();
  };

  const computerSelection = () => {
    const computerPos = Math.floor(Math.random()*20);
    const computerRandomSelection = pokemones.filter((value, idx) => computerPos === idx);
    
    setComputerRandomSelection(computerRandomSelection);
    //console.log (computerSelection);

  };

  const handleStart = () => {
    setStartGame (true);
  };

  const makeAttack = () => {
    const myattack = Math.floor(Math.random()*20);
    const itsattack = Math.floor(Math.random()*20);

    
    if (myHealth <= 0){
      setEnemyHealth  (0);
      alert ("battle lost!!");
      return;
    }

    if (enemyHealth <=0 ){
      setHealth  (0);
      alert ("battle winned!!");
      return;
    }

    setEnemyHealth  (enemyHealth - myattack);
    setHealth  (myHealth - itsattack);

    

  };

  useEffect(() => {
    pokemonData (pokeUrl);
  },[]);
  
  return (
    <>
      <div className='main-container'>
      <h1>Game Boy Pocket</h1>
      <div className= 'layout-game' >
        <div className='layout-margingame'>
        <div className='container-screen'>
            <div className='screen-layout'>
              {
                startGame ? (
                  <BattleScreen 
                    myPokeSelection = {myPokeSelection}
                    computerRandomSelection = {computerRandomSelection}
                    enemyHealth = {enemyHealth}
                    myHealth = {myHealth}

                  />
                ) : (
                  pokemones && (<ScreenPokemones pokemones = {pokemones} position ={position}/>))
              }
            </div>
          </div>
        </div>  
          
        
        <div className='buttons-container'>
          
          <div className='container-pad'>
          <button className="btn-left"
            onClick = {() => handleSelection (false) } ></button>
          <div className="container-up-down">
            <button className="btn-up"></button>
            <button className="btn-down"></button>
          </div>
            <button className="btn-right" 
            onClick = {() => handleSelection (true) } >
            </button>
          </div>

          <div className='container-select'>
            <div className='container-select-btn'>
              <button className='btn-select'
              onClick = {() => filterSelection()}>
              </button>
              <div>select</div>
            </div>

            <div className='container-start-btn'>
              <button className='btn-start' onClick ={() => handleStart()}></button>
              <div>start</div>
            </div>
          </div>
          
          <div className='container-action'>
            <div className='button-b-container'>
              <button className='button-b'></button>
              <div>B</div>
            </div>

            <div className='button-a-container'>
              <button className='button-a'onClick={() => makeAttack ()}></button>
              <div>A</div>
            </div>
          </div>
            
        </div>
      </div>  
      </div>
     
    </>
  )
}

export default App
