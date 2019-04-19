const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const moviedex = require('./movies-data.json')
require('dotenv').config()

const app = express()

app.use(morgan('dev'))

app.use(cors())

console.log(process.env.API_TOKEN)

function validateToken(req, res, next) {
    const apiKey = process.env.API_TOKEN;
    const userKey = req.get('Authorization');

    if(!userKey || userKey.split(' ')[1] !== apiKey) {
        return res.status(401).json({error: 'Unauthorized request'})
    }

    debugger

    next()
}

app.use(validateToken)

function handleGetMovie(req, res) {
    const searchGenre = req.query.genre;
    const searchCountry = req.query.country;
    const avgVote = req.query.avg_vote;
    const filmName = req.query.film_title;

    let response = moviedex;
    if(searchGenre) {
        response = response.filter(movie => movie.genre.toLowerCase() === searchGenre.toLowerCase())
    }

    if(searchCountry) {
        response = response.filter(movie => movie.country.toLowerCase() === searchCountry.toLowerCase())
    }

    if(avgVote) {
        response = response.filter(movie => Number(movie.avg_vote) >= avgVote)
    }

    if(filmName) {
        response = response.filter(movie => movie.film_title.toLowerCase() === filmName.toLowerCase())
    }
   
    res.json(response)
}

app.get('/movie', handleGetMovie)


app.listen(8000, () => {
  console.log(`Server listening at http://localhost:8000`)
})