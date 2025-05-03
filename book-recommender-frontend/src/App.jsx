import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE;

function BookInputs({books, setBook}){
  return (
    <>
      {books.map((book, index) => (
        <input
          autoFocus={index === 0}
          key={index}
          type="text"
          value={book}
          onChange={y => setBook(index, y.target.value)}  
          placeholder={`Book ${index +1}`}
        />
      ))}
    </>
  );
}

function Recommendation({ recommendation }) {
  if (!recommendation) return null;
  return (
    <div className="recommendation">
      <h2>Your Recommendation:</h2>
      <p><strong>{recommendation.title}</strong></p>
      <p>{recommendation.reason}</p>
    </div>
  );
}

function App() {
  const [books, setBooks] = useState(['', '', '']);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const setBook = (index, value) =>{
    const newBooks = [...books];
    newBooks[index] = value;
    setBooks(newBooks);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      console.log("User-entered books:", books);
    
      const response = await fetch(`${API_BASE}/book-recommendation`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({books}),
      });
  
      if(!response.ok) {
        throw new Error("Failed to fetch recommendation");
      }

      const data = await response.json();
      console.log(data);

      setRecommendation(data);
  
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Advait's Book Recommender</h1>
      <form onSubmit={handleSubmit}>
        <BookInputs books={books} setBook={setBook} />
                
        <button 
          type="submit" 
          disabled={loading}
          className={loading ? 'loading': ''}>
            {loading ? 'Getting recommendations' : 'Get Recommendations'} 
        </button>
      </form>

      <Recommendation recommendation={recommendation} />
    </div>
  )
}

export default App
