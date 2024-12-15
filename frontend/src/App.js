import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    const getCompanies = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/data.json');
        // Use Set for O(1) lookup of unique UUIDs
        const uniqueCompanies = Array.from(
          new Map(data?.items?.map(item => [item.uuid, item])).values()
        );
        setCompanies(uniqueCompanies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setLoading(false);
      }
    };
    getCompanies();
  }, []);

  // Memoize categories calculation
  const categories = companies.reduce((acc, { uuid, industries }) => {
    industries?.forEach(({ id, name }) => {
      if (!acc[id]) {
        acc[id] = { name, companies: new Set([uuid]) };
      } else {
        acc[id].companies.add(uuid);
      }
    });
    return acc;
  }, {});

  // Convert Sets to Arrays for rendering
  Object.values(categories).forEach(category => {
    category.companies = Array.from(category.companies);
  });
  return (
    <div className="max-w-sm w-full lg:max-w-full lg:flex flex content-center justify-center flex-col items-center">
      <header className="w-full bg-white shadow-md mb-6 py-4">
        <div className="container mx-auto">
          <h1 className="font-bold text-2xl text-center text-gray-800">
            Companies
          </h1>
        </div>
      </header>
      {loading ? (
        <div className="animate-pulse">
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-gray-100">
            <div className="px-6 py-4 w-96">
              <div className="flex my-3 justify-between">
                <div className="h-6 w-32 bg-gray-300 rounded"></div>
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
              </div>
              <hr />
              <div className="space-y-3 py-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {Object.keys(categories).map(categoryId => (
            <div
              key={categoryId}
              className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white mb-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="px-6 py-4 w-96">
                <div className="flex my-3 justify-between items-center border-b pb-3">
                  <p className="font-bold text-xl text-gray-800">
                    {categories[categoryId].name.charAt(0).toUpperCase() +
                      categories[categoryId].name.slice(1)}
                  </p>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {categories[categoryId]?.companies?.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {companies
                    ?.filter(({ uuid }) =>
                      categories[categoryId]?.companies?.includes(uuid)
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(({ name, uuid, images }) => (
                      <div
                        key={uuid}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-all duration-200 cursor-pointer"
                      >
                        <img
                          className="w-8 h-8 rounded-full mr-3"
                          src={images['32x32']}
                          alt={name}
                          onError={e => (e.target.style.display = 'none')}
                        />
                        <p className="text-gray-700 text-base font-medium transition-all duration-200 group-hover:text-lg hover:text-gray-900 hover:scale-105">
                          {name}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2024 Company Directory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
