import Input from './components/Input';
import Results from './components/Results';
import ChipHeader from './components/ChipHeader';
import './styles/App.css';
import db from './firebase';
import { useEffect } from 'react';
import { HerokuRequest } from './components/HerokuRequest';
import { placeDataRecoil, placeLoading } from './atoms';

import { collection, onSnapshot } from "firebase/firestore";
import { useSetRecoilState } from 'recoil';

const App = () => {

  const setPlaceData = useSetRecoilState(placeDataRecoil)
  const setLoading = useSetRecoilState(placeLoading)


  useEffect(() => {
    onSnapshot(collection(db, "reviews"), (collection) => {
      setPlaceData(collection.docs.map(doc => doc.data()))
      setLoading(false)
    });
  }, [setLoading, setPlaceData])


  useEffect(() => {
    HerokuRequest()
  }, []);

  return (
    <div className="App">
      <header className="Header">
        <Input />
        <ChipHeader />
      </header>
      <Results />
    </div>
  );
}
export default App;