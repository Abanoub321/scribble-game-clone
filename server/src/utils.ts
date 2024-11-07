const words = ['dog', 'cat', 'house', 'tree', 'car', 'sun', 'moon', 'book', 'phone', 'computer'];

export function selectNewWord() {
  return words[Math.floor(Math.random() * words.length)];
} 