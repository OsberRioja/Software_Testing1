import Homework from "./homework.js"
import Course from "./Course.js";
import * as errorCode from './errorCodes'
const CourseNotFound=1
const HomeworkNotFound=2;

class Courses{
    constructor()
    {
        this.courses={}
    }
    
    createHomework(name, dateInit, dateFin, courseName, hoursNeeded, id) {
        if (!this.courses[courseName]) {
            return {
                status: errorCode.CourseNotFound
            };
        }
        
        let task = new Homework(name, dateInit, dateFin, courseName, hoursNeeded, id);
        this.courses[courseName].addHomework(task);
        
        return {
            status: errorCode.OK,
            homework: task.getHomeworkObj()
        };
    }
    getCourseNames()
    {
        return Object.keys(this.courses)
    }
    getCourseHomeworks(courseName)
    {
        if(this.courses[courseName])
        {
            return this.courses[courseName].getHomeworkArray()
        }
        return CourseNotFound
    }
    getHomeworkBasedOnId(id) {
        for (const courseName in this.courses) {
            let CourseHomeworks = this.courses[courseName].getHomeworkArray();
            for (const homework of CourseHomeworks) {
                if (homework.getId() == id)
                    return homework;
            }
        }
        return HomeworkNotFound;
    }    
    clearCourseHomeworks(courseName)
    { 
        let status=CourseNotFound
        if(this.courses[courseName])
        {
            this.courses[courseName].clearHomeworks()
            status=0
        }
        return status
    }
    createCourse(Initials,Name,TeachersName)
    {
        let course=new Course(Initials,Name,TeachersName);
        this.courses[Name]=course
        return course.getCourseObj()
    }
    modifyHomework(id,name,dateInit,dateFin,CourseName)
    {
        let answer=CourseNotFound;
        if(this.courses[CourseName])
        {
            answer=this.courses[CourseName].modifyHomework(id,name,dateInit,dateFin);
        }
        return answer;
    }
    markHmwkAsDone(id)
    {
        let hmwk=this.getHomeworkBasedOnId(id)
        hmwk.addToCompleted()
    }
    addFeedbackToAhmwk(feedback,hmwkId){
        this.getHomeworkBasedOnId(hmwkId).addFeedback(feedback);
        console.log(this.getHomeworkBasedOnId(hmwkId))
    }

    getCourseByName(course)
    {
        for (const courseName in this.courses) {
            let courseDetails = this.courses[courseName].getCourseObj()
            if(courseDetails["teachersName"] == course)
            {
                return courseDetails["name"]
            }
        }
        return CourseNotFound
    }

    deleteHomework(courseName, homeworkId){
        let status=errorCode.CourseNotFound;
       if(this.courses[courseName]){
        status=this.courses[courseName].deleteHomework(homeworkId);
       }
       return status;
    }
    getHoursToComplete(sameDateHomeworks)
    {
        let hoursNeeded=0
        sameDateHomeworks.forEach((Homework)=>{
            hoursNeeded+=Homework.getHoursPerDay()
        })
        return hoursNeeded;
    }

}
export {Courses}