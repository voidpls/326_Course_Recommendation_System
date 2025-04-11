export function loadCourseReviewPage() {
    loadCourses()
}

async function loadCourses(){
    let courseListElement = document.getElementById("course-list")
    console.log(courseListElement)
    let resoonse = await fetch("Services/course-details-page/complete_course_list.json")
    let courseList = await resoonse.json()
    console.log(courseList)
    for(let i = 0; i < courseList.length; i++){
        let course = courseList[i]
        let course_item = document.createElement("li")
        course_item.className = "course-item"
        course_item.innerHTML = `<div class="rating-box"><h1 class="rating-text">3.1</h1></div><div class="name-box"><h2 class="name-text">${course.code}: ${course.title}</h2></div>`
        courseListElement.appendChild(course_item)
    }
}