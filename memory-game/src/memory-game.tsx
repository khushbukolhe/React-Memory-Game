import { useEffect, useState } from "react";

const emojis = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥑", "🥕"];

interface CardObject {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const generateCards = (): CardObject[] => {
  const shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  return shuffledEmojis.map((emoji, index) => ({
    id: index,
    emoji,
    flipped: false,
    matched: false,
  }));
};

export const MemoryGame = () => {
  const [cards, setCards] = useState<CardObject[]>(generateCards());
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      if (cards[first].emoji === cards[second].emoji) {
        setCards((prevCard) => {
          return prevCard.map((prevCard) =>
            prevCard.id === first || prevCard.id === second
              ? { ...prevCard, matched: true }
              : prevCard
          );
        });
        setSelectedCards([]);
      } else {
        setTimeout(() => {
          setCards((prevCards) => {
            return prevCards.map((prevCard) =>
              prevCard.id === first || prevCard.id === second
                ? { ...prevCard, flipped: false }
                : prevCard
            );
          });
          setSelectedCards([]);
        }, 1000);
      }
    }
  }, [cards, selectedCards]);

  useEffect(() => {
    if (cards.every((card) => card.matched === true)) {
      setGameOver(true);
    }
  }, [cards]);

  const handlePlayAgain = () => {
    setGameOver(false);
    setCards(generateCards());
    setSelectedCards([]);
  };

  const handleCardClick = (id: number) => {
    if (selectedCards.length === 2 || cards[id].flipped) return;

    setCards((prevCards) =>
      prevCards.map((prev) =>
        prev.id === id ? { ...prev, flipped: true } : prev
      )
    );
    setSelectedCards((prev) => [...prev, id]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "16px" }}>
    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "16px" }}>Memory Game</h1>
  
    {/* Flexbox as Grid */}
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", width: "320px" }}>
      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            border: "1px solid gray",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: card.flipped || card.matched ? "#E5E7EB" : "#3B82F6",
          }}
          onClick={() => handleCardClick(card.id)}
        >
          {card.flipped || card.matched ? card.emoji : "❓"}
        </div>
      ))}
    </div>
  

      {gameOver && (
        <button
          className="mt-4 p-2 bg-green-500 text-white rounded"
          onClick={handlePlayAgain}
        >
          Play Again
        </button>
      )}
    </div>
  );
};
