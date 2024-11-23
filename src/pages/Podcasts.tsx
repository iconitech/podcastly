import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { topPodcasts } from "@/data/podcasts";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Podcasts() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-4">NFL Podcasts</h1>
        <p className="text-xl text-neutral-400 mb-12">
          Get AI-powered summaries from the best NFL podcasts.
        </p>

        <div className="grid gap-12">
          {topPodcasts.map((podcast) => (
            <div key={podcast.id} className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <img
                  src={podcast.imageUrl}
                  alt={podcast.title}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2">{podcast.title}</h2>
                  <p className="text-lg text-neutral-400 mb-4">{podcast.host}</p>
                  <p className="text-neutral-400 max-w-2xl mb-6">{podcast.description}</p>
                  <Button 
                    onClick={() => navigate(`/podcasts/${podcast.id}`)}
                    className="bg-green-500 hover:bg-green-600 text-black"
                  >
                    View all episodes
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-400">Latest Episodes</h3>
                {podcast.episodes.slice(0, 3).map((episode) => (
                  <div
                    key={episode.id}
                    className="bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium mb-1">{episode.title}</h4>
                        <p className="text-sm text-neutral-400 line-clamp-2">{episode.description}</p>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-neutral-700 hover:bg-neutral-600 ml-4"
                      >
                        Get Summary
                      </Button>
                    </div>
                    <div className="flex items-center text-sm text-neutral-400">
                      <span>{episode.date}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{episode.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}