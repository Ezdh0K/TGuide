const pool = require('../config/db');
const Place = require('../models/placeModel');

exports.getPlaces = async (req, res) => {
    try {
        const place = await Place.getAll();
        res.status(200).json(place);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;
        const place = await Place.getById({ id });
        if (!place) return res.status(404).json({ error: 'Place not found' });
        res.status(200).json(place);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createPlace = async (req, res) => {
    try {
        const place = await Place.create( req.body );
        res.status(201).json(place);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updatePlace = async (req, res) => {
    try {
        const place = await Place.put({ ...req.params, ...req.body });
        res.status(200).json(place);

    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.upsertPlace = async (req, res) => {
    try {
        const { name, address, category, price, rating, shortDescription, phone, email } = req.body;
        const imagePath = req.file ? req.file.path : null;
        if (!name || !address || !category) {
            return res.status(400).json({ error: 'Название, адрес и категория обязательны' });
        }
        
        const newPlace = {
            name: name,
            address,
            category,
            image: imagePath,
            price: price ? parseFloat(price) : null,
            rating: rating ? parseFloat(rating) : null,
            short_description: shortDescription,
            phone,
            email
        };
        const savedPlace = await Place.upsert(newPlace);
        console.log('Получено новое место:', savedPlace);

        if (!savedPlace) {
            return res.status(500).json({ error: 'Не удалось сохранить место' });
        }

        res.status(201).json({ message: 'Место успешно добавлено!', place: savedPlace });
    } catch (error) {
        console.error('Ошибка в upsertPlace:', error);
        res.status(500).json({ error: error.message });
    }
    
};

exports.deletePlace = async (req, res) => {
    try {
        const deleted = await Place.delete({ id: req.params.id });
        if (deleted === 0) return res.status(404).json({ error: 'Place not found' });
        res.status(204).send();
    } catch (err) { res.status(500).json({ error: err.message }); }
};