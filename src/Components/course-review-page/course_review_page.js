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
        //course_item.onclick = courseClick
        course_item.addEventListener("click", function (e) {courseClick(course)}, false)
        course_item.params = course
        courseListElement.appendChild(course_item)
    }
}

function courseClick(course){
    changeSelected(course)
    removeReviews()
    loadReviews()
}

function changeSelected(course){
    console.log(course)
    let selectedTitle = document.getElementById("course-item-selected")
    let prerequisites = document.getElementById("prerequisites")
    let instructors = document.getElementById("instructors")
    let credits = document.getElementById("credits")
    selectedTitle.innerHTML = `
        <div class="rating-box">
            <h1 class="rating-text">3.1</h1>
        </div>
        <div class="name-box">
            <h1 class="name-text">${course.code}: ${course.title}</h1>
        </div>`
    prerequisites.innerHTML = `Prerequisites: ${course.prerequisites}`
    credits.innerHTML = `Credits: ${course.credits}`
    instructors.innerHTML = `Instructors: ${course.instructors}`
}

function removeReviews(){
    console.log('reviews removed')
}

function loadReviews(){
    console.log('reviews loaded')
}