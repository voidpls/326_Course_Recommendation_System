const fs = require('fs');

// Load both JSON files
const courses = JSON.parse(fs.readFileSync('merged_fall_and_spring.json', 'utf-8'));
const offeringPlan = JSON.parse(fs.readFileSync('course_offering_plan.json', 'utf-8'));

// Create a lookup map from offering plan
const offeringMap = offeringPlan.reduce((acc, item) => {
    acc[item["Course Code"]] = item["Frequency"]; // Or store more if needed
    return acc;
}, {});

// Add "semesters" or "frequency" info to each course
const updatedCourses = courses.map(course => {
    const frequency = offeringMap[course.code] || null;
    return {
        ...course,
        frequency
    };
});

// Write the updated courses to a new file
fs.writeFileSync('complete_course_list.json', JSON.stringify(updatedCourses, null, 2), 'utf-8');