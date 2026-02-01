export interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: 'treats' | 'entertainment' | 'tech' | 'goals';
}

export const shopItems: ShopItem[] = [
  // Treats
  { id: 'candy', name: 'Candy', price: 5, icon: '🍬', category: 'treats' },
  { id: 'icecream', name: 'Ice Cream', price: 8, icon: '🍦', category: 'treats' },
  { id: 'pizza', name: 'Pizza', price: 12, icon: '🍕', category: 'treats' },
  { id: 'popcorn', name: 'Popcorn', price: 6, icon: '🍿', category: 'treats' },
  
  // Entertainment
  { id: 'movie', name: 'Movie Ticket', price: 15, icon: '🎬', category: 'entertainment' },
  { id: 'game', name: 'Video Game', price: 50, icon: '🎮', category: 'entertainment' },
  { id: 'concert', name: 'Concert', price: 75, icon: '🎤', category: 'entertainment' },
  
  // Tech & Gear
  { id: 'headphones', name: 'Headphones', price: 60, icon: '🎧', category: 'tech' },
  { id: 'sneakers', name: 'Sneakers', price: 80, icon: '👟', category: 'tech' },
  { id: 'skateboard', name: 'Skateboard', price: 120, icon: '🛹', category: 'tech' },
  
  // Big Goals
  { id: 'switch', name: 'Nintendo Switch', price: 350, icon: '🕹️', category: 'goals' },
  { id: 'iphone', name: 'iPhone', price: 500, icon: '📱', category: 'goals' },
];

export interface SubscriptionItem {
  id: string;
  name: string;
  cost: number;
  icon: string;
}

export const subscriptionItems: SubscriptionItem[] = [
  { id: 'roblox', name: 'Roblox Premium', cost: 15, icon: '🟩' },
  { id: 'minecraft', name: 'Minecraft Realms', cost: 10, icon: '⛏️' },
  { id: 'disney', name: 'Disney+', cost: 12, icon: '🏰' },
  { id: 'spotify', name: 'Spotify Kids', cost: 8, icon: '🎵' },
  { id: 'pokemon', name: 'Pokémon GO+', cost: 5, icon: '⚡' },
  { id: 'youtube', name: 'YouTube Premium', cost: 14, icon: '▶️' },
  { id: 'fortnite', name: 'Fortnite Crew', cost: 12, icon: '🎯' },
  { id: 'books', name: 'Epic! Books', cost: 10, icon: '📚' },
];
