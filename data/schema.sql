DROP TABLE IF EXISTS movies;

CREATE TABLE movies(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  poster VARCHAR(255),
  vote_average VARCHAR(255),
  overview TEXT,
  release_date TEXT,
);

CREATE TABLE users()
