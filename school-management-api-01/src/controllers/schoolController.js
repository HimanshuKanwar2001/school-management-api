

const db = require('../db');


exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error adding school', error });
    }
};


exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    try {
        const [schools] = await db.execute('SELECT * FROM schools');
        const sortedSchools = schools.map(school => {
            const distance = calculateDistance(
                latitude, longitude, school.latitude, school.longitude
            );
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schools', error });
    }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
