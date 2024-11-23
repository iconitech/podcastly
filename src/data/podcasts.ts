export interface Podcast {
  id: string;
  title: string;
  host: string;
  description: string;
  imageUrl: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  date: string;
  duration: string;
  description: string;
}

export const topPodcasts: Podcast[] = [
  {
    id: "around-the-nfl",
    title: "Around the NFL",
    host: "Dan Hanzus, Gregg Rosenthal, and Marc Sessler",
    description: "NFL.com's official podcast covering the latest news, analysis, and game breakdowns.",
    imageUrl: "https://images.unsplash.com/photo-1642059870522-bb7a747cb4b1?q=80&w=600&h=600&auto=format&fit=crop",
    episodes: [
      {
        id: "atn-1",
        title: "2024 Super Bowl LVIII Recap",
        date: "2024-02-12",
        duration: "1h 25m",
        description: "Complete analysis of the Chiefs vs 49ers Super Bowl matchup"
      },
      // More episodes can be added here
    ]
  },
  {
    id: "pff-nfl",
    title: "PFF NFL Podcast",
    host: "Sam Monson & Steve Palazzolo",
    description: "Deep dive analytics and advanced stats from Pro Football Focus experts.",
    imageUrl: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=600&h=600&auto=format&fit=crop",
    episodes: [
      {
        id: "pff-1",
        title: "Free Agency Preview 2024",
        date: "2024-02-10",
        duration: "58m",
        description: "Breaking down the top free agents and their potential landing spots"
      }
    ]
  },
  {
    id: "move-the-sticks",
    title: "Move the Sticks",
    host: "Daniel Jeremiah & Bucky Brooks",
    description: "Former NFL scouts break down prospects and analyze team building.",
    imageUrl: "https://images.unsplash.com/photo-1631495634750-0c507026b3c8?q=80&w=600&h=600&auto=format&fit=crop",
    episodes: [
      {
        id: "mts-1",
        title: "2024 NFL Draft Top 50 Prospects",
        date: "2024-02-09",
        duration: "1h 15m",
        description: "Complete breakdown of the top prospects in the upcoming draft"
      }
    ]
  },
  {
    id: "the-athletic-nfl",
    title: "The Athletic NFL Show",
    host: "Robert Mays",
    description: "In-depth analysis and interviews with NFL's top minds.",
    imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=600&h=600&auto=format&fit=crop",
    episodes: [
      {
        id: "athletic-1",
        title: "Offseason Team Needs Analysis",
        date: "2024-02-08",
        duration: "1h 05m",
        description: "Breaking down each team's biggest needs heading into free agency"
      }
    ]
  }
];