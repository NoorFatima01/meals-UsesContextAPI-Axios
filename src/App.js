import './App.css';
import Fav from './components/Fav.js'
import Search from './components/Search';
import Meals from './components/Meals';
import Modal from './components/Modal';
import { useGlobalContext } from './context';

function App() {
   const {showModal, favorites} = useGlobalContext()
  return (
    <main> 
      <Search/>
      {favorites.length > 0 && <Fav/>}
      <Meals/>
      {showModal && <Modal/>}
    </main>
  );
}
export default App;