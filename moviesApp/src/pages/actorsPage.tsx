import React, { useState } from "react";
import { useQuery } from "react-query";
import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/headerMovieList";
import { getActors } from "../api/tmdb-api";

interface Actor {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
}

const ActorsPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const {
    data,
    error,
    isLoading,
    isError,
  } = useQuery<{ results: Actor[] }, Error>(["actors", page], () => getActors(page), {
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, 
  });

  if (isLoading) {
    return <Typography variant="h5" align="center">Loading...</Typography>;
  }

  if (isError) {
    return <Typography variant="h5" align="center">Error: {error.message}</Typography>;
  }

  const actors = data?.results || [];

  return (
    <div>
      <Header title="ACTORS" />

      <Grid container spacing={4} justifyContent="center">
        {actors.map((actor) => (
          <Grid key={actor.id} item xs={12} sm={6} md={4} lg={3}>
            <Link to={`/actors/${actor.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ textAlign: "center" }}>
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={actor.name}
                  style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                />
                <Typography variant="h6" style={{ marginTop: "8px" }}>
                  {actor.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {actor.known_for_department}
                </Typography>
              </div>
            </Link>
            <Button
              variant="outlined"
              size="small"
              component={Link}
              to={`/actors/${actor.id}/info`}
              style={{ marginTop: "8px" }}
            >
              More Info
            </Button>
          </Grid>
        ))}
      </Grid>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Button
          variant="contained"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={{ marginRight: "1rem" }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ActorsPage;
