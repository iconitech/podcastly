import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { topPodcasts } from "@/data/podcasts";
import { useNavigate } from "react-router-dom";

export default function PodcastShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Top NFL Podcasts</h2>
        <p className="text-neutral-400 text-center mb-12 max-w-2xl mx-auto">
          Get instant summaries from the most popular NFL podcasts, curated just for you.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topPodcasts.map((podcast) => (
            <Card key={podcast.id} className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <img
                  src={podcast.imageUrl}
                  alt={podcast.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle className="text-xl font-bold">{podcast.title}</CardTitle>
                <CardDescription className="text-neutral-400">
                  {podcast.host}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-400">{podcast.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-neutral-800 hover:bg-neutral-700"
                  onClick={() => navigate(`/podcasts/${podcast.id}`)}
                >
                  View Episodes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}