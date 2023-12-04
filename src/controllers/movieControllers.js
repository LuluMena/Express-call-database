const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    color: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    color: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];


const database = require("../../database");

const getMovies = (req, res) => {
  database
    .query("SELECT * FROM movies")
    .then(([movies]) => {
      res.json(movies); // use res.json instead of console.log
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM movies WHERE id = ? ", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0])
      } else {
        res.sendStatus(404)
      }
    })
    .catch((err) => {
      // console.error(err);
      res.sendStatus(500);
    });
};

const getUsers = (req, res) => {
  database
    .query("SELECT * FROM users")
    .then(([users]) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
}

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.status(200).json(users[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    })
}

const postMovie = (req,res) => {
  const {title, director, year, color, duration} = req.body;

  database
    .query("INSERT INTO movies(title, director, year, color, duration) VALUES(?,?,?,?,?)", [title, director, year, color, duration])
    .then(([result])=> {
      res.status(201).send({id:result.insertId});
    })
    .catch((err)=>{
      console.log(err);
      res.sendStatus(500);
    })
}

const postUser = (req,res) => {
  const {firstname, lastname, email, city, language} = req.body;

  database
    .query("INSERT INTO users(firstname, lastname, email, city, language) VALUES(?,?,?,?,?)",[firstname, lastname, email, city, language])
    .then(([result])=>{
      res.status(201).send({id:result.insertId});
    })
    .catch((err)=>{
      console.error(err);
      res.sendStatus(500);
    })
}

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  postUser,
  getUsers,
  getUserById,
};
