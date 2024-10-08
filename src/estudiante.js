
class Student{
    
    constructor(Name)
    {
        this.name=Name;
        this.coursesStudent = new Set();
        this.completedHomeworkIds = new Set();
        this.hoursFeedback= Object.create(null);
        this.stressFeedback= Object.create(null);
    }
    addCoursesToStudent(course)
    {
        this.coursesStudent.add(course)
    }
    addStressLevel(stress,hmwkId){
        console.log("Setting Stress level");
        this.stressFeedback[hmwkId]=stress;
    }
    getStressLevel(id){
        return this.stressFeedback[id];
    }
    addFeedback(hours,hmwkId){
        console.log("saving feedback");
        this.hoursFeedback[hmwkId]=hours;
    }
    getFeedBackhours(id){
        return this.hoursFeedback[id];
    }
    getCoursesStudent()
    {
        return this.coursesStudent;
    }

    showAllEnrolledCourses()
    {
        let materias = "";
        this.coursesStudent.forEach(course=>{
            materias +=course+", "
        })
        return materias.substring(0,materias.length-2)
    }

    completeHomework(id)
    {
        this.completedHomeworkIds.add(id)
    }

    getIfIdCompleted(id)
    {
        return this.completedHomeworkIds.has(id)
    }

    getName()
    {
        return this.name
    }
}

export default Student;