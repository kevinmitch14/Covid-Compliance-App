import Input from './components/Input';
import Results from './components/Results';
import ChipHeader from './components/ChipHeader';
import './styles/App.css';
import db from './firebase';
import { useEffect, useState } from 'react';
import { HerokuRequest } from './components/HerokuRequest';

const App = () => {
  const [placeData, setData] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    db.collection('reviews').orderBy('average', 'desc').onSnapshot(snapshot => {
      setData(snapshot.docs.map(doc => doc.data()))
      setloading(false)
    })
  }, [loading])

  // Initial Heroku Request as load time is slow when there is no requests for a long period of time.
  useEffect(() => {
    HerokuRequest()
  }, []);

  return (
    <div className="App">
      <header className="Header">
        <Input placeData={placeData} loading={loading} />
        <ChipHeader />
      </header>
      <Results placeData={placeData} loading={loading} />
    </div>
  );
}

export default App;