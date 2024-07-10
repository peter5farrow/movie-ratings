import { useLoaderData, useNavigate } from "react-router-dom";
import CreateRatingForm from "../components/CreateRatingForm";
import axios from "axios";

export default function MovieDetailPage() {
  const {
    movie: { movieId, title, posterPath, overview },
  } = useLoaderData();

  const navigate = useNavigate();

  async function handleCreateRating(e, { score }) {
    e.preventDefault();
    const res = await axios.post("/api/ratings", {
      score: score,
      movieId: movieId,
    });
    if (res.data) {
      navigate("/me");
    }
  }

  return (
    <>
      <h1>{title}</h1>

      <img src={posterPath} alt={title} style={{ width: "200px" }} />

      <p>{overview}</p>

      <CreateRatingForm onCreateRating={handleCreateRating} />
    </>
  );
}
