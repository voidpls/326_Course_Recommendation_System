const fs = require('fs');

// Load the JSON file
const filePath = './complete_course_list.json';
const outputPath = './sorted_full_course_list.json';

const courseData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Filter out INFO courses
const filteredCourses = courseData.filter(course => {
    return !course.code.trim().toUpperCase().startsWith('INFO');
});

// Sorting function: CICS before COMPSCI, then by course number
filteredCourses.sort((a, b) => {
    const [aDept, aNum] = a.code.split(/\\s+/);
    const [bDept, bNum] = b.code.split(/\\s+/);

    const deptOrder = (dept) => dept.toUpperCase() === 'CICS' ? 0 : 1;

    const aOrder = deptOrder(aDept);
    const bOrder = deptOrder(bDept);

    if (aOrder !== bOrder) return aOrder - bOrder;

    const aParsed = parseInt(aNum, 10) || 0;
    const bParsed = parseInt(bNum, 10) || 0;

    return aParsed - bParsed;
});

// Write to a new file
fs.writeFileSync(outputPath, JSON.stringify(filteredCourses, null, 2));