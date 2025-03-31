const fs = require('fs');

// Load the two JSON files
const courses1 = JSON.parse(fs.readFileSync('Fall 2025.json', 'utf-8'));
const courses2 = JSON.parse(fs.readFileSync('Spring 2025.json', 'utf-8'));

// Merge and remove duplicates based on course 'code'
const merged = [...courses1, ...courses2];
const uniqueCourses = Object.values(
    merged.reduce((acc, course) => {
        acc[course.code] = course; // last course with the same code wins
        return acc;
    }, {})
);

// Write the result to a new file
fs.writeFileSync('merged_fall_and_spring.json', JSON.stringify(uniqueCourses, null, 2), 'utf-8');

console.log(`✅ Merged ${merged.length} courses into ${uniqueCourses.length} unique entries.`);
console.log(`📝 Output written to merged_fall_and_spring.json`);
