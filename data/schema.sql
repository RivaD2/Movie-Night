DROP TABLE IF EXISTS movies;

CREATE TABLE movies(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  poster VARCHAR(255),
  rating VARCHAR(255),
  plot TEXT,
  actors TEXT,
  genre VARCHAR(255),
  username VARCHAR(255)
);

