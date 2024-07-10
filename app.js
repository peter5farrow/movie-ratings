import express from "express";
import session from "express-session";
import morgan from "morgan";
import ViteExpress from "vite-express";
import { Movie, Rating, User } from "./src/model.js";

const app = express();
const port = "8000";
ViteExpress.config({ printViteDevServerHost: true });

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({ secret: "ssshhhhh", saveUninitialized: true, resave: false })
);

//MIDDLEWARE
function loginRequired(req, res, next) {
  if (!req.session.userId) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
}

//List of all movies
app.get("/api/movies", async (req, res) => {
  const allMovies = await Movie.findAll();
  res.json(allMovies);
});

//Details for one movie
app.get("/api/movies/:movieId", async (req, res) => {
  const selectedMovie = await Movie.findOne({
    where: { movieId: req.params.movieId },
  });
  res.json(selectedMovie);
});
//OR
// app.get("/api/movies/:movieId", async (req, res) => {
//   const { movieId } = req.params;
//   const movie = await Movie.findByPk(movieId);
//   res.json(movie);
// });

//User login
app.post("/api/auth", async (req, res) => {
  const { email, password } = req.body;

  const possibleUser = await User.findOne({
    where: { email: email, password: password },
  });

  if (possibleUser) {
    req.session.userId = possibleUser.userId;
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});
//OR
// app.post('/api/auth', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ where: { email: email } });

//   if (user && user.password === password) {
//     req.session.userId = user.userId;
//     res.json({ success: true });
//   } else {
//     res.json({ success: false });
//   }
// });

//User logout
app.post("/api/logout", loginRequired, (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

//Ratings for one movie
app.get("/api/ratings", loginRequired, async (req, res) => {
  const user = await User.findByPk(req.session.userId);
  const ratings = await user.getRatings({
    include: {
      model: Movie,
      attributes: ["title"],
    },
  });
  res.json(ratings);
});

//Create a rating as current user
app.post("/api/ratings", loginRequired, async (req, res) => {
  const { movieId, score } = req.body;
  const user = await User.findByPk(req.session.userId);

  const newRating = await user.createRating({
    movieId: movieId,
    score: score,
  });
  res.json(newRating);
});

ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
