import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    try {
      const getCompanies = async () => {
        const { data } = await axios.get('http://localhost:8080/data.json');
        console.log('data', data);
      };
      getCompanies();
    } catch (error) {
      console.log('error', error);
    }
  });
  return (
    <div className="App">
      <div className="bg-blue-500 text-white p-4">
        This is a Tailwind CSS styled component.
      </div>
    </div>
  );
}

export default App;
