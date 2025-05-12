import React from "react";
import { useQuery } from "react-query";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { MovieDetailsProps } from "../../types/interfaces";

const styles = {
  root: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 1.5,
  },
};


const getFavourites = (): { id: number }[] => {
  const stored = localStorage.getItem("favourites");
  return stored ? JSON.parse(stored) : [];
};

const MovieHeader: React.FC<MovieDetailsProps> = (movie) => {
  const { data: favourites = [] } = useQuery("favourites", getFavourites, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const isFavourite = favourites.some((m) => m.id === movie.id);

  return (
    <Paper component="div" sx={styles.root}>
      <IconButton aria-label="go back">
        <ArrowBackIcon color="primary" fontSize="large" />
      </IconButton>

      <Typography variant="h4" component="h3">
        {movie.title}{"   "}
        {movie.homepage && (
          <a href={movie.homepage}>
            <HomeIcon color="primary" fontSize="large" />
          </a>
        )}
        <br />
        <span>{movie.tagline}</span>
      </Typography>

      {isFavourite && <FavoriteIcon color="error" fontSize="large" />}

      <IconButton aria-label="go forward">
        <ArrowForwardIcon color="primary" fontSize="large" />
      </IconButton>
    </Paper>
  );
};

export default MovieHeader;
