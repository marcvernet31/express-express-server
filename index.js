const express = require('express')
const app = express()

// information served (should be on another file)
let notes = [  
    {    id: 1,    content: "HTML is easy",    date: "2022-05-30T17:30:31.098Z",    important: true  }
]

// middleware example, log on console on request
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }  

app.use(express.json())

// load middleware
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {    
        response.json(note)  
    } else {    
        response.status(404).end()  
    }
  })

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})


const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
}


app.post('/api/notes', (request, response) => {
    const body = request.body 
    if (!body.content) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
    }
    const note = {
        content: body.content,
        important: body.important || false,
        // generation of date has to be done in server
        // we cant be sure that the machine running the browser has the clock 
        // coorectly setup
        date: new Date(),
        id: generateId(),
      }
    
    notes = notes.concat(note)
    response.json(note)
  })


// middleware example on return
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
