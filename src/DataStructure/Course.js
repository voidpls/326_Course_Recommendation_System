class Course {
  constructor(code, title, instructors, description, prerequisites, credits, semester) {
    this.code = code;
    this.title = title;
    this.instructors = Array.isArray(instructors) ? instructors : instructors.split(',').map(i => i.trim());
    this.description = description;
    this.prerequisites = prerequisites;
    this.credits = Number(credits) || 0;
    this.semester = semester;
  }

  addInstructor(instructor) {
    if (!this.instructors.includes(instructor)) this.instructors.push(instructor);
  }

  removeInstructor(instructor) {
    const index = this.instructors.indexOf(instructor);
    if (index !== -1) {
      this.instructors.splice(index, 1);
      return true;
    }
    return false;
  }

  updateCode(newCode) {
    this.code = newCode;
  }

  updateTitle(newTitle) {
    this.title = newTitle;
  }

  updateDescription(newDescription) {
    this.description = newDescription;
  }

  updatePrerequisites(newPrerequisites) {
    this.prerequisites = newPrerequisites;
  }

  updateCredits(newCredits) {
    this.credits = newCredits;
  }

  updateSemester(newSemester) { 
    this.semester = newSemester;
  }

  getCode() {
    return this.code;
  }

  getTitle() {
    return this.title;
  }

  getInstructors() {
    return this.instructors;
  }

  getDescription() {
    return this.description;
  }

  getPrerequisites() {
    return this.prerequisites;
  }

  getCredits() {
    return this.credits;
  }

  getSemester() {
    return this.semester;
  }

  getFullInfo() {
    return {
      code: this.code,
      title: this.title,
      instructors: this.instructors,
      description: this.description,
      prerequisites: this.prerequisites,
      credits: this.credits,
      semester: this.semester
    };
  }
}
export default Course;