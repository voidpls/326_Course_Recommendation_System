document.addEventListener("DOMContentLoaded", async () => {
    const cs_bs_2023_flowchart = await fetch('Components/course_progress_chart/cs_bs_2023_flowchart.html')
    const html = await cs_bs_2023_flowchart.text()
    const parent = document.getElementById('course-flowchart-container')

    parent.innerHTML = html
});