const express = require("express")
const app = express()
const path = require('path')

const PORT = 3000

app.use(express.static(path.join(__dirname, '../src')))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'))
})

// import routers
const detailsRouter  = require('./routes/course_details')
const progressRouter = require('./routes/course_progress')
const reviewsRouter  = require('./routes/course_reviews')
const profileRouter  = require('./routes/course_profile')

// mount routers
app.use('/course-details', detailsRouter);
app.use('/course-progress', progressRouter);
app.use('/course-reviews', reviewsRouter);
app.use('/course-profile', profileRouter);

// catch all 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// // In-memory storage for demonstration purposes
// let profileData = {};

// // GET: Retrieve profile data
// app.get('/profile', (req, res) => {
//     res.json(profileData);
// });

// // POST: Create new profile data
// app.post('/profile', express.json(), (req, res) => {
//     profileData = req.body;
//     res.status(201).json({ message: 'Profile created successfully', data: profileData });
// });

// // PUT: Update existing profile data
// app.put('/profile', express.json(), (req, res) => {
//     profileData = { ...profileData, ...req.body };
//     res.json({ message: 'Profile updated successfully', data: profileData });
// });

// // DELETE: Delete profile data
// app.delete('/profile', (req, res) => {
//     profileData = {};
//     res.json({ message: 'Profile deleted successfully' });
// });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

module.exports = app
