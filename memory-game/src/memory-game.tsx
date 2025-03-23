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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Memory Game</h1>

      {/* Flexbox as Grid */}
      <div className="flex flex-wrap justify-center w-[320px]">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`w-16 h-16 flex items-center justify-center text-2xl border rounded cursor-pointer ${
              card.flipped || card.matched ? "bg-gray-200" : "bg-blue-500"
            }`}
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
