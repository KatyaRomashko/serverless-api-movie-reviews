// actorsPage.tsx
import { useCallback, useEffect, useState } from "react";
import { getActors } from "../api/tmdb-api";
import { Box, Card, CardContent, CardMedia, Container, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/headerMovieList";
import CustomPagination from "../components/customPageNav"; 

interface Actor {
  actorId: number;
  fullName: string;
  imageUrl: string | null;
  profession: string;
}

const ActorsListing: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [maxPageCount, setMaxPageCount] = useState(1);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const response = await getActors(currentPageIndex);
      const actorData = response.results.map((item: any) => ({
        actorId: item.id,
        fullName: item.name,
        imageUrl: item.profile_path,
        profession: item.known_for_department
      }));
      setActors(actorData);
      setMaxPageCount(response.total_pages);
    } catch (error) {
      console.log("Error loading actors:", error);
    }
  }, [currentPageIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updatePage = (_: unknown, newIndex: number) => {
    setCurrentPageIndex(newIndex);
  };

  return (
    <Container maxWidth="xl">
      <Header title="Actors" />
      
      <Box sx={{ 
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 3,
        padding: 3
      }}>
        {actors.map((actor) => (
          <Card key={actor.actorId} sx={{ cursor: "pointer" }}>
            <Box>
              <CardMedia
                component="img"
                height="350"
                image={
                  actor.imageUrl 
                    ? `https://image.tmdb.org/t/p/w300${actor.imageUrl}`
                    : "/placeholder-actor.jpg"
                }
                alt={actor.fullName}
              />
              <CardContent>
                <Box component="h3" sx={{ margin: 0 }}>{actor.fullName}</Box>
                <Box component="p" sx={{ color: "text.secondary" }}>
                  {actor.profession}
                </Box>
              </CardContent>
            </Box >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <IconButton 
              onClick={() => navigate(`/actors/${actor.actorId}/details`)}
              sx={{ marginLeft: 1, marginBottom: 1 }}
            >
              Details
            </IconButton>
            <IconButton 
                  onClick={() => navigate(`/actors/${actor.actorId}`)}
            >View films</IconButton>
        
            </Box>
            
   
          </Card>
        ))}
      </Box>

      <CustomPagination
        totalItems={maxPageCount * 20}
        perPage={20}
        currentPage={currentPageIndex}
        pageChangeHandler={updatePage}
      />
    </Container>
  );
};

export default ActorsListing;