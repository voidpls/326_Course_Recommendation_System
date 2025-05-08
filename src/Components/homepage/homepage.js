window.homePageInit = () => {
    const recommendationsSubmitBtn = document.getElementById('recommendations-submit-btn');
    const interestsInput = document.getElementById('homepage-interests');
    const recommendationsContainer = document.getElementById('recommendations-container');

    let isActive = false;
    recommendationsSubmitBtn.addEventListener('click', async () => {
        if (isActive) return 
        isActive = true

        const userInterests = interestsInput.value.trim()

        const userId = sessionStorage.getItem('userId')

        recommendationsContainer.innerHTML = '<p>Loading recommendations...</p>'

        const recs = await getCourseRecommendations(userId, userInterests)
        if (!recs) {
            recommendationsContainer.innerHTML = '<p>Failed to fetch recommendations</p>'
            isActive = false
            return 
        }

        recommendationsContainer.innerHTML = ''
        recs.recommended_courses.forEach(course => {
                    const courseDiv = document.createElement('div');
                    courseDiv.className = 'homepage-recommendation'; 

                    const courseTitle = document.createElement('h3');
                    courseTitle.textContent = course.course_name;

                    const courseReasoning = document.createElement('p');
                    courseReasoning.textContent = course.reasoning;

                    courseDiv.appendChild(courseTitle);
                    courseDiv.appendChild(courseReasoning);
                    recommendationsContainer.appendChild(courseDiv);
        });
        isActive = false
    })
}


// method for getting course recommendations
async function getCourseRecommendations (userId, userInterests) {
    // userId = INT 
    // userInterests = STRING
    try {
        const res = await fetch('/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                userInterests,
            }),
        })

        if (!res || !res.ok) return null
        const data = await res.json()
        if (!data.success) return null

        return JSON.parse(data.response)
    } catch (err) {
        console.error(err)
    } 
}
