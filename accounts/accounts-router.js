const router = require('express').Router();

const db = require('../data/dbConfig.js');

router.get('/', async (req, res) => {
  try {
    const accounts = await db('accounts');
    res.status(200).json(accounts);
  } catch ({message}) {
    res.status(500).json(message);
  }
})

router.get('/:id', async (req, res) => {
  const {id} = req.params;

  try {
    //Remember to pass these in destructured if not using the below syntax for the where statement
    const account = await db('accounts').where('id', '=', id); 
    if(account) {
      res.status(200).json(account);
    } else {
      res.status(422).json({message: `No record with id: ${id} exists in the database.`})
    }
  } catch ({message}) {
    res.status(500).json(message)
  }
})

router.get('/:limit?/:sortBy?/:sortDir?', async (req, res) => {
  const limit = req.params.limit || 10;
  const sortBy = req.params.sortBy || 'name';
  const sortDir = req.params.sortDir || 'asc';

  try {
    const accounts = await db('accounts').orderBy(sortBy, sortDir).limit(limit);
    res.status(200).json(accounts);
  } catch ({message}) {
    res.status(500).json(message);
  }
})

router.post('/', async (req, res) => {
  const newPost = req.body;

  try {
    const added = await db('accounts').insert(newPost);
    res.status(201).json(added);
  } catch ({message}) {
    res.status(500).json(message)
  }
})

router.put('/:id', async (req, res) => {
  const {id} = req.params;
  const accountUpdate = req.body;
  try {
    const updatedRecords = await db('accounts').where({id}).update(accountUpdate);
    if(updatedRecords) {
      res.status(200).json(updatedRecords);
    } else {
      res.status(400).json({message: `The account with id: ${id} does not exist`});
    }
  } catch ({message}) {
    res.status(500).json(message);
  }
})

router.delete('/:id', async (req, res) => {
  const {id} = req.params;

  try{
    const accountsDeleted = await db('accounts').where({id}).del();
    if(accountsDeleted) {
      res.status(200).json(accountsDeleted);
    } else {
      res.status(400).json({message: `The account with id: ${id} does not exist`})
    }
  } catch ({message}) {
    res.status(500).json(message);
  }
})

module.exports = router;