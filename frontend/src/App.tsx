import { useEffect, useState } from 'react';

interface ListItem {
  id: number;
  name: string;
}

function App() {
  const [items, setItems] = useState<ListItem[]>([]);

  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data);
        setItems(data.items); 
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Monorepo: React + Express</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;