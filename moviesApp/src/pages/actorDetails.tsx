import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActorDetails, getActorFilmography } from "../api/tmdb-api";
import { Box, Card, CardContent, CardMedia, Container, Rating, Stack, styled } from "@mui/material";
import MovieCard from "../components/movieCard"; 
import Spinner from "../components/spinner";
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import { BaseMovieProps } from "../types/interfaces";
import Header from "../components/headerMovieList";

const ProfileImage = styled('img')({
  borderRadius: '16px',
  objectFit: 'cover',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
});

const ActorDetailsView: React.FC = () => {
  const { actorId } = useParams<{ actorId: string }>();
  const [actor, setActor] = useState<any>(null);
  const [filmography, setFilmography] = useState<BaseMovieProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadActorData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [profileData, filmsData] = await Promise.all([
        getActorDetails(actorId!),
        getActorFilmography(actorId!)
      ]);

      setActor(profileData);
      setFilmography(
        filmsData.map((film: any) => ({
          ...film,
          release_date: film.release_date || "Date not available",
        }))
      );
    } catch (err) {
      console.error("Error loading actor data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [actorId]);

  useEffect(() => {
    loadActorData();
  }, [loadActorData]);

  if (isLoading || !actor) return <Spinner />;

  return (
    <Container maxWidth="xl">
      <Header title={`${actor.name}'s Filmography`} />
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mb: 6 }}>
        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
          <Card>
            <CardMedia>
              <ProfileImage
                src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                alt={actor.name}
                style={{ width: '100%' }}
              />
            </CardMedia>
            <CardContent>
              <Box component="h1" sx={{ fontSize: '2rem', mb: 1 }}>{actor.name}</Box>
              <Box component="p" sx={{ color: 'text.secondary' }}>
                {actor.birthday || "Birth date unavailable"}
              </Box>
              <Rating 
                value={actor.popularity / 20} 
                precision={0.5} 
                readOnly 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box component="h2" sx={{ fontSize: '1.5rem', mb: 2 }}>Biography</Box>
              <Box component="p" sx={{ lineHeight: 1.6 }}>
                {actor.biography || "No biographical information available."}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      <Box component="section">
        <Box component="h2" sx={{ fontSize: '1.8rem', mb: 3 }}>
          {actor.name}'s Notable Works
        </Box>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 3
        }}>
          {filmography.map((film) => (
            <MovieCard
              key={film.id}
              movie={film}
              action={(m) => <AddToFavouritesIcon {...m} />}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default ActorDetailsView;