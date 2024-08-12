// import the model
const Workout = require('../models/workoutModel');
// import mongoose
const mongoose = require('mongoose')

// GET ALL Workouts
const getWorkouts = async (req, res) => {
    const workouts = await Workout.find({}).sort({createdAt: -1})
    res.status(200).json(workouts)
}

// GET SINGLE Workout
const getWorkout = async (req, res) => {
    const {id} = req.params
    // check if id is valid mongo id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'});
    }
    // Try find a workout by its id
    const workout = await Workout.findById(id)
    // if no workout found show an error
    if(!workout) {
        return res.status(404).json({error: 'No such workout'});
    }
    // otherwise return the workout found
    res.status(200).json(workout)
}


// CREATE Workout
const createWorkout = async (req, res) => {
    const {title, load, reps} = req.body

    // add doc to db
    try {
        const workout = await Workout.create({title, load, reps})
        res.status(200).json(workout)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const deleteWorkout = async (req, res) => {
    // get the id from the request parameters
    const {id} = req.params;
    // check if id is valid mongo object id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'});
    }

    // if it is valid - find and delete
    const workout = await Workout.findOneAndDelete({_id: id})

    //if id is valid but no workout found
    if (!workout) {
        return res.status(404).json({error: 'No such workout'});
    }

    // if it successfully finds and deletes:
    res.status(200).json(workout);
}

// Update Workout
const updateWorkout = async (req,res) => {
    const {id} = req.params

    // check if the id is Mongo valid:
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Workout'})
    }

    // find a workout by its id and if finds it
    // spread out the properties of the req.body
    // it will take whats in the req.body and update the workout
    // with that information
    const workout = await Workout.findOneAndUpdate({_id: id}, {
        ...req.body
    },
    { new: true }) // new true make suers its returning the new update

    if(!workout) {
        return res.status(404).json({error: 'No such Workout'})
    }

    res.status(200).json(workout)

}


module.exports = {getWorkouts,getWorkout, createWorkout, deleteWorkout,updateWorkout}