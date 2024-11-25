export interface Podcast {
  id: string;
  title: string;
  host: string;
  description: string;
  imageUrl: string;
  feedUrl: string;
}

export const topPodcasts: Podcast[] = [
  {
    id: "pat-mcafee",
    title: "The Pat McAfee Show",
    host: "Pat McAfee",
    description: "Former NFL punter Pat McAfee delivers his hot takes on sports news and events. A mix of football analysis, humor, and interviews with top NFL personalities.",
    imageUrl: "https://images.unsplash.com/photo-1642059870522-bb7a747cb4b1?q=80&w=600&h=600&auto=format&fit=crop",
    feedUrl: "https://feeds.megaphone.fm/ESP7297553965"
  },
  {
    id: "pff-nfl",
    title: "The PFF NFL Podcast",
    host: "Sam Monson & Steve Palazzolo",
    description: "Deep dive analytics and advanced stats from Pro Football Focus experts, breaking down NFL games and players using PFF's unique data and grades.",
    imageUrl: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=600&h=600&auto=format&fit=crop",
    feedUrl: "https://feeds.simplecast.com/U644ZfMt"
  },
  {
    id: "move-the-sticks",
    title: "NFL: Move the Sticks",
    host: "Daniel Jeremiah & Bucky Brooks",
    description: "Former NFL scouts Daniel Jeremiah and Bucky Brooks break down the latest news and developments in the NFL, analyzing team needs and player evaluations.",
    imageUrl: "https://images.unsplash.com/photo-1631495634750-0c507026b3c8?q=80&w=600&h=600&auto=format&fit=crop",
    feedUrl: "https://omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/0E61FE66-E985-446F-BC46-AE27003599DA/C1B3EAA8-DB6B-4865-AC29-AE27003599F6/podcast.rss"
  },
  {
    id: "rich-eisen",
    title: "The Rich Eisen Show",
    host: "Rich Eisen",
    description: "NFL Network's Rich Eisen brings his unique perspective to the world of sports, entertainment, and pop culture with celebrity interviews and football analysis.",
    imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=600&h=600&auto=format&fit=crop",
    feedUrl: "https://feeds.megaphone.fm/WWO9698947413"
  }
];