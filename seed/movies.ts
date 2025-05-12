import { Movie, Review } from '../shared/types';

export const movies : Movie[] = [
  {
    id: 673,
    language: 'en',
    title: 'Dune: Part One',
    overview: 'A young nobleman must travel to the most dangerous planet in the universe to ensure the future of his family and his people.',
    release_date: '2021-10-22',
    vote_average: 8.0,
  },
  {
    id: 259,
    language: 'en',
    title: 'Everything Everywhere All at Once',
    overview: 'An overwhelmed laundromat owner is swept into an insane adventure where she alone can save the multiverse by exploring alternate lives she could have led.',
    release_date: '2022-03-11',
    vote_average: 8.1,
  },
  {
    id: 784,
    language: 'en',
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    release_date: '2023-07-21',
    vote_average: 8.4,
  }
  

]
export const reviews: Review[] = [
  {
    reviewId: 1,
    movieId: 673,
    reviewerName: "user1@example.com",
    reviewText: "Great movie! Loved the action scenes.",
    rating: 5,
    createdAt: "2023-10-01T12:00:00Z",
  },
  {
    reviewId: 2,
    movieId: 259,
    reviewerName: "user2@example.com",
    reviewText: "The plot was a bit predictable.",
    rating: 3,
    createdAt: "2023-10-02T12:00:00Z",
  },
  {
    reviewId: 3,
    movieId: 784,
    reviewerName: "user3@example.com",
    reviewText: "Amazing cinematography!",
    rating: 4,
    createdAt: "2023-10-03T12:00:00Z",
  },
];
