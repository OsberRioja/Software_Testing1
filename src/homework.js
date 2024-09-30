class Homework{
    constructor(name,dateInit,dateFin,courseName,hoursNeeded, id)
    {
        this.name=name;
        this.dateInit=dateInit;
        this.dateFin=dateFin;
        this.courseName=courseName;
        this.hoursNeeded=hoursNeeded;
        this.id = id;
        this.timesCompleted=0;
        this.homeworkFeedbacks=[];
    }
    addFeedback(feedback){
        this.homeworkFeedbacks.push(feedback);
    }
    getFeedback()
    {
        return this.homeworkFeedbacks;
    }
    sumFeedback() {
        let total = 0;
        let homeworkFeedback = this.homeworkFeedbacks;
        for (const feedback of homeworkFeedback) {
            total += parseInt(feedback);
        }
        return total / this.homeworkFeedbacks.length;
    }    
    getHomeworkObj() {
        this.timesCompleted = 0;
        return {
            name: this.name,
            id: this.id,
            dateInit: this.dateInit,
            dateFin: this.dateFin,
            courseName: this.courseName,
            timesCompleted: this.timesCompleted
        };
    }
    
    getId()
    {
        return this.id
    }
    getDateFin()
    {
        return this.dateFin
    }
    modifyAtts(name,dateInit,dateFin)
    {
        this.name=name;
        this.dateInit=dateInit;
        this.dateFin=dateFin;
    }
    getHoursPerDay()
    {
        let d1=new Date(this.dateFin)
        let d2=new Date(this.dateInit)
        let DaysDiff=Math.floor(Math.abs(d1-d2)/(24 * 60 * 60 * 1000))
        return (this.hoursNeeded)/(DaysDiff)
    }
    addToCompleted()
    {
        this.timesCompleted+=1;
    }
    getTimesCompleted()
    {
        return this.timesCompleted;
    }

}
export default Homework;