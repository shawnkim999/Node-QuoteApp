"use client"
import { useEffect, useState } from "react";
import axios from "axios";

interface Quote {
  id: string;
  text: string;
  author: string;
  likes: number;
}

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchQuotes();
  }, [])

  const fetchQuotes = async () => {
    axios.get(`${api}/quotes`)
      .then(res => {
        setQuotes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch quotes");
        setLoading(false);
      })
  }

  const handleLike = async (id: string) => {
    setQuotes(prev => 
      prev.map(quote =>
        quote.id === id ? { ...quote, likes: quote.likes + 1 } : quote
      )
    )
    try {
      await axios.post(`${api}/quotes/${id}/like`);

      const res = await axios.get(`${api}/quotes/${id}`);
      const updatedQuote = res.data;

      setQuotes(prev =>
        prev.map(quote =>
          quote.id === id ? updatedQuote : quote
        )
      );

    } catch (err) {
        console.error("Failed to like quote: ", err);
        setQuotes(prev =>
          prev.map(quote =>
            quote.id === id ? { ...quote, likes: quote.likes - 1 } : quote
          )
        );
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Text</th>
            <th>Likes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td>{quote.author}</td>
              <td>{quote.text}</td>
              <td>{quote.likes}</td>
              <td>
                <button onClick={() => handleLike(quote.id)}>❤️ Like</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
