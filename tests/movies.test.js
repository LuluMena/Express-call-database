const request = require("supertest");
const app = require("../src/app");
const database = require("../database");
// afterAll(() => database.end);
afterAll(() => database.query("TRUNCATE TABLE movies"));

describe("POST /api/movies", () => {
  it("should return created movie", async () => {
    const newMovie = {
      title: "Star Wars",
      director: "George Lucas",
      year: "1977",
      color: "1",
      duration: 120,
    };

    const response = await request(app).post("/api/movies").send(newMovie);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const [result] = await database.query(
      "SELECT * FROM movies WHERE id = ?", response.body.id
    );
    const [moviesInDatabase] = result;

    expect(moviesInDatabase).toHaveProperty("id");

    expect(moviesInDatabase).toHaveProperty("title");
    expect(moviesInDatabase.title).toStrictEqual(newMovie.title);

    expect(moviesInDatabase).toHaveProperty("director");
    expect(moviesInDatabase.director).toStrictEqual(newMovie.director);

    expect(moviesInDatabase).toHaveProperty("year");
    expect(moviesInDatabase.year).toStrictEqual(newMovie.year);

    expect(moviesInDatabase).toHaveProperty("color");
    expect(moviesInDatabase.color).toStrictEqual(newMovie.color);

    expect(moviesInDatabase).toHaveProperty("duration");
    expect(moviesInDatabase.duration).toStrictEqual(newMovie.duration);
  })

  it("should return an error", async () => {
    const movieWithMissingProps = { title: "Harry Potter" };

    const response = await request(app)
      .post("/api/movies")
      .send(movieWithMissingProps);

    expect(response.status).toEqual(422);
  })
})

describe("GET /api/movies", () => {
  it("should return all movies", async () => {
    const response = await request(app).get("/api/movies");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/movies/:id", () => {
  it("should return one movie", async () => {
    const response = await request(app).get("/api/movies/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no movie", async () => {
    const response = await request(app).get("/api/movies/0");

    expect(response.status).toEqual(404);
  });
});


describe("PUT /api/movies/:id", () => {
  it("should edit movie", async () => {
    const newMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162
    };

    const [result] = await database.query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?,?,?,?,?)", [newMovie.title, newMovie.director, newMovie.year, newMovie.color, newMovie.duration]
    );
    // const result = await request(app)
    //   .post(`/api/movies`)
    //   .send(newMovie);
    
    const id = result.insertId;

    const updatedMovie = {
      title: "Wild is life",
      director: "Alan Smithee",
      year: "2023",
      color: "0",
      duration: 120
    }

    const response = await request(app)
      .put(`/api/movies/${id}`)
      .send(updatedMovie);

    expect(response.status).toEqual(204);

    const [movies] = await database.query("SELECT * FROM movies WHERE id=?", id);

    const [moviesInDatabase] = movies;

    expect(moviesInDatabase).toHaveProperty("id");

    expect(moviesInDatabase).toHaveProperty("title");
    expect(moviesInDatabase.title).toStrictEqual(updatedMovie.title);

    expect(moviesInDatabase).toHaveProperty("director");
    expect(moviesInDatabase.director).toStrictEqual(updatedMovie.director);

    expect(moviesInDatabase).toHaveProperty("year");
    expect(moviesInDatabase.year).toStrictEqual(updatedMovie.year);

    expect(moviesInDatabase).toHaveProperty("color");
    expect(moviesInDatabase.color).toStrictEqual(updatedMovie.color);

    expect(moviesInDatabase).toHaveProperty("duration");
    expect(moviesInDatabase.duration).toStrictEqual(updatedMovie.duration);
  })

  it("should return an error", async () => {
    const movieWithMissingProps = { title: "Harry Potter" };

    const response = await request(app)
      .put(`/api/movies/1`)
      .send(movieWithMissingProps);

    expect(response.status).toEqual(422);
  })

  it("should return no movie", async () => {
    const newMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162,
    };
    const response = await request(app)
      .put("/api/movies/0")
      .send(newMovie);

    expect(response.status).toEqual(404);
  })
})

describe("DELETE /api/movies/:id",()=>{
  it("should delete route", async () => {
     const newMovie = {
      title: "Deleted Movie",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162
    };
    
    const [result] = await database.query("INSERT INTO movies(title, director, year, color, duration) VALUES (?,?,?,?,?)", [newMovie.title, newMovie.director, newMovie.year, newMovie.color, newMovie.duration])
    const id = result.insertId;

    // delete the newMovie
    const deleteResponse = await request(app)
      .delete(`/api/movies/${id}`);
    expect(deleteResponse.status).toEqual(204);

    //fetching the deleted movie should return 404 error
    const fetchResponse = await request(app)
      .get(`/api/movies/${id}`)
    expect(fetchResponse.status).toEqual(404);

  })
})