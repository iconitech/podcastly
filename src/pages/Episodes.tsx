import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { topPodcasts } from "@/data/podcasts";
import { ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Episodes() {
  const { podcastId } = useParams();
  const navigate = useNavigate();
  
  const podcast = topPodcasts.find((p) => p.id === podcastId);
  
  if (!podcast) {
    return (
      <div className="pt-24 px-4 pb-16">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold">Podcast not found</h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go back home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          className="mb-8 hover:bg-neutral-800"
          onClick={() => navigate("/podcasts")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to podcasts
        </Button>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <img
            src={podcast.imageUrl}
            alt={podcast.title}
            className="w-48 h-48 object-cover rounded-lg"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{podcast.title}</h1>
            <p className="text-xl text-neutral-400 mb-4">{podcast.host}</p>
            <p className="text-neutral-400 max-w-2xl">{podcast.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {podcast.episodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:bg-neutral-800/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{episode.title}</h3>
                  <p className="text-neutral-400">{episode.description}</p>
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-black">
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
    </div>
  );
}