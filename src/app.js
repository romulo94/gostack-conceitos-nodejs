const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeUUID(request, response, next){
  const { id } = request.params

  if(!isUuid(id)) return response.status(400).json({error: "Invalid uuid."})

  return next()
}

app.use('/repositories/:id', validadeUUID)


app.get("/repositories", (request, response) => {
  
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(repositorie)

  return response.json(repositorie)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { url, title, techs } = request.body

  const repositorieIndex = repositories.findIndex(el => el.id === id)

  if(repositorieIndex < 0) return response.status(400).json({error: "Repositorie does not exists."})
  
  const repositorie = repositories[repositorieIndex]

  repositorie.url = url
  repositorie.techs = techs
  repositorie.title = title

  return response.json(repositorie)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(el => el.id === id)

  if(repositorieIndex < 0) return response.status(400).json({error: "Repositorie does not exists."})
  
  repositories.splice(repositorieIndex, 1)

  return response.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(el => el.id === id)

  if(repositorieIndex < 0) return response.status(400).json({error: "Repositorie does not exists."})

  const repositorie = repositories[repositorieIndex]

  repositorie.likes++

  return response.json(repositorie)
});

module.exports = app;
