import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    try {
      const getCompanies = async () => {
        const { data } = await axios.get('http://localhost:8080/data.json');
        const dict = {};
        const cleaned = data?.items?.filter(({ uuid }) => {
          if (dict[uuid]) return false;
          dict[uuid] = true;
          return true;
        });
        setCompanies(cleaned);
      };
      getCompanies();
    } catch (error) {}
  }, []);
  let categories = {};
  companies?.forEach(({ uuid, industries }) => {
    industries?.forEach(({ id, name }) => {
      if (!categories[id]) categories[id] = { name, companies: [uuid] };
      else if (!categories[id]?.companies?.includes(uuid))
        categories[id].companies.push(uuid);
    });
  });
  return (
    <div className="max-w-sm w-full lg:max-w-full lg:flex flex content-center justify-center flex-col items-center">
      {Object.keys(categories).map(categoryId => (
        <div
          key={categoryId}
          className="max-w-sm rounded overflow-hidden shadow-lg"
        >
          <div className="px-6 py-4 w-96">
            <div className="flex my-3 justify-between">
              <p className="font-bold text-xl">
                {categories[categoryId].name.charAt(0).toUpperCase() +
                  categories[categoryId].name.slice(1)}
              </p>
              <p className="font-bold text-xl">
                {categories[categoryId]?.companies?.length}
              </p>
            </div>
            <hr />
            <div>
              {companies
                ?.filter(({ uuid }) =>
                  categories[categoryId]?.companies?.includes(uuid)
                )
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(({ name, uuid }, i) => (
                  <p key={uuid} className="text-gray-700 py-2 text-base">
                    {name}
                  </p>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
