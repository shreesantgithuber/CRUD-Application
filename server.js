
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

let items=[];
let nextId = 1;
    
app.get('/api/items', (req,res)=>{
    res.json(items);
})

app.post('/api/items', (req,res)=>{
    const newItem = {
        id: nextId++,
        name: req.body.name
    };
    items.push(newItem);
    res.status(201).json(newItem);
})


app.put('/api/items/:id', (req,res)=>{
    const itemId = parseInt(req.params.id);
    const updatedItem = items.find(item=> item.id === itemId);
    if(updatedItem) {
        updatedItem.name = req.body.name;
        res.json(updatedItem);
    } else {
        res.status(404).send('Item not found');
    }
});


app.delete('/api/items/:id', (req,res) => {
    const itemId = parseInt(req.params.id);
    items = items.filter( item => item.id !== itemId );
    res.status(204).send(); 
})

app.listen(3000, ()=>{
    console.log(`The Server is listening at PORT 3000`);
})