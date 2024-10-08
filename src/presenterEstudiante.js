import { CoursesControllerSingleton } from "./coursesController";
import { getStudentName, seeIfStudentExist } from "./studentList.js";
let coursesController=CoursesControllerSingleton.getInstance()

const hoursToConsiderDayOverloaded=3

const BtnToEnrollCourse=document.querySelector("#BtnToEnrollCourse");
const enrollCourse=document.querySelector("#enrollCourse");
const coursesList = document.querySelector("#coursesList");
const homeworkDays = document.querySelector("#daysWithHomework");
const actualHomework = document.querySelector("#actualHomework");
const estudiantesPage = document.querySelector("#estudiantesPage");
const courseBox = document.querySelector("#courseBox")
let student

estudiantesPage.addEventListener("click", (event) => {
  event.preventDefault();
  try
  {
    loadBaseStatus()
  }
  catch(err)
  {
    console.log(err);
  }
});

function loadBaseStatus()
{
  student = seeIfStudentExist(getStudentName())
  console.log(student)
  actualHomework.innerHTML=""
  enrollCourse.value=""
  loadCourses()
  loadListByDates()
  reloadCourseBox()
}

BtnToEnrollCourse.addEventListener("click", (event) => {
  event.preventDefault();
  const courseName = enrollCourse.value;
  const course = coursesController.getCourseHomeworks(courseName)
  if(course!= 1)
  {
    alert("te inscribiste a " +courseName+ " con exito");
    student.addCoursesToStudent(courseName)
    addItemToCourseBox(courseName,courseName)
    loadCourses();
    loadListByDates();
  }
  else{
    alert("no te lograste inscribir a la materia");
  }
});
function addItemToCourseBox(item,value)
{
  let newOption = document.createElement("option");
  newOption.text = item;
  newOption.value = value;
  courseBox.appendChild(newOption);
}
function removeAllChildNodes(parent) 
{
  while (parent.firstChild) 
  {
      parent.removeChild(parent.firstChild);
  }
}
function reloadCourseBox()
{
  removeAllChildNodes(courseBox);
  let studentCourses=student.getCoursesStudent();
  addItemToCourseBox("All","All");
  studentCourses.forEach(course=>{
    addItemToCourseBox(course,course)
  })

}

function loadCourses()
{
  coursesList.innerHTML = student.showAllEnrolledCourses()
}

function loadListByDates()
{  
  homeworkDays.innerHTML=""
  removeAllChildNodes(homeworkDays);
  let HomeworkDatesObj=coursesController.getStudentHomeworksByDate(student.getCoursesStudent())
  let dates=Object.keys(HomeworkDatesObj) 
  dates.sort((a, b) => a.localeCompare(b));
  reloadCourseBox();
  for (let date of dates) {
    addElementsToFather(homeworkDays, loadDateContainer(HomeworkDatesObj[date], date));
  }
  

}
courseBox.addEventListener('change', (event) => {
  if(event.target.value!="All")
    loadSelectedCourse(courseBox.value)
  else
    loadListByDates();
});

function loadSelectedCourse(course) {
  homeworkDays.innerHTML = "";
  removeAllChildNodes(homeworkDays);
  let HomeworkDatesObj = coursesController.getStudentHomeworkByClass(course);
  let dates = Object.keys(HomeworkDatesObj);
  dates.sort((a, b) => a.localeCompare(b));
  
  for (const date of dates) {
    addElementsToFather(homeworkDays, loadDateContainer(HomeworkDatesObj[date], date));
  }
}

function addListenerForfurtherinfo(homworkDiv,homework){
  homworkDiv.addEventListener('click', function handleClick(event){
    showFurtherInformation(homework);
  });
}

function showFurtherInformation(homework){
 actualHomework.innerHTML= `Homework : ${homework.name} started on ${homework.dateInit} and you must complete it by ${homework.dateFin}`+", Horas necesarias:  "+homework.hoursNeeded+", Horas por dia:  "+homework.getHoursPerDay();
}
function addElementsToFather(Father, ...children) {
  for (const child of children) {
    Father.appendChild(child);
  }
}

function addPropsToElement(element,props,...innerHTML)
{
  if(innerHTML[0]!=undefined)
    element.innerHTML=innerHTML[0];
  for (let property in props) {
    element.setAttribute(`${property}`,`${props[property]}`);
  }
}
function homeworkMarkButtonListener(element,hmwkId)
{
  element.addEventListener('click', function handleClick(event){
    element.disabled=true;
    element.style.backgroundColor="#00FF00"
    element.style.color="white"
    element.innerHTML="Done"
    student.completeHomework(hmwkId);
    coursesController.markHmwkAsDone(hmwkId);
    homeworkDone(hmwkId);
  });
}
function InitializeMarkButton(Button,homeworkId)
{
  let disabled=student.getIfIdCompleted(homeworkId)
  Button.disabled=disabled
  if(disabled)
  {
    addPropsToElement(Button,{"id":"hmwkBtn"+homeworkId,"class":"HomeworkBtn"}, "Done")
    Button.style.backgroundColor="#00FF00"
    Button.style.color="white"
  }
  else
  {
    addPropsToElement(Button,{"id":"hmwkBtn"+homeworkId,"class":"HomeworkBtn"}, "Mark done");
    homeworkMarkButtonListener(Button,homeworkId);
  }

}
function initializeStressLevel(input,button){
    input.stylemarginLeft=".2rem"
    input.style.borderRadius ="40px";
    input.style.height = "50px";
    input.style.fontWeight = "900";
    input.style.paddingLeft = "10px";
    input.style.outlineColor = "#32a87f";
    button.style.backgroundColor="#32a87f";
    button.style.textTransform="uppercase";
    button.style.marginLeft =".2rem";
    button.style.borderRadius ="40px";
}
function feedbackBtnListener(element,hmwkId){
  element.style.backgroundColor="#3293a8";
  element.style.textTransform="uppercase";
  element.style.marginLeft ="1rem";
  element.style.borderRadius ="40px";
  element.addEventListener('click', function handleClick(event){
    element.disabled=true;
    let hoursInput =document.querySelector("#hoursinput"+hmwkId);
    let hoursBtn =document.querySelector("#hourssubmit"+hmwkId);
    hoursInput.style.marginLeft=".2rem"
    hoursInput.style.borderRadius ="40px";
    hoursInput.style.outlineColor = "#3293a8"
    hoursBtn.style.backgroundColor="#3293a8";
    hoursBtn.style.textTransform="uppercase";
    hoursBtn.style.marginLeft =".2rem";
    hoursBtn.style.borderRadius ="40px";
    hoursInput.style.display = "block";
    hoursBtn.style.display="block";
    sendFeedBackListener(hmwkId);
  });
}
function sendFeedBackListener(hmwkId){
  let hoursInput =document.querySelector("#hoursinput"+hmwkId);
  let hoursBtn =document.querySelector("#hourssubmit"+hmwkId);
  let feedbackbtn = document.querySelector("#feedbackbtn"+hmwkId);
  hoursBtn.addEventListener('click', function handleClick(event){
    student.addFeedback(hoursInput.value,hmwkId);
    coursesController.addFeedbackToAhmwk(hoursInput.value,hmwkId);
    hoursInput.style.display="none";
    hoursBtn.style.display="none";
    feedbackbtn.style.display="none";
    alert("Gracias por brindarnos la informacion");

  });
}
function sendStresslevelListener(element,hmwkId){
  element.addEventListener('click', function handleClick(event){
    element.disabled=true;
    alert("Gracias por dejarnos saber.");
  })
}
function homeworkDone(homeworkId){
  let feedbackbtn = document.querySelector("#feedbackbtn"+homeworkId);
  let disabled=student.getIfIdCompleted(homeworkId)
  if(disabled){
    feedbackbtn.style.display = "block";
    feedbackBtnListener(feedbackbtn,homeworkId);
  }else{
    feedbackbtn.style.display = "none";
  }
}
function InitializeFeedBackButton(Button){
  Button.style.display = "none"
}
function InitializeHoursFeedback(input,button){
  input.style.display= "none";
  button.style.display="none";

}
function loadDateContainer(homeworksArray, date) {
  let dateContainer = document.createElement('div');
  let dateTitleDiv = document.createElement('h3');
  
  addPropsToElement(dateContainer, { "id": "divFecha" + date });
  addPropsToElement(dateTitleDiv, { "id": "divFechaTitle" + date }, date + "==>");
  
  addElementsToFather(dateContainer, dateTitleDiv);
  
  for (const homework of homeworksArray) {
    addElementsToFather(dateContainer, createHomeworkItem(homework));
  }
  
  if (coursesController.getHoursToComplete(homeworksArray) > hoursToConsiderDayOverloaded) {
    dateTitleDiv.style.color = "red";
  }
  
  return dateContainer;
}


function createHomeworkItem(homework)
{
  let homeworkContainer=document.createElement("div");
  let nameContainer= document.createElement('div');
  let homeworkMarkButton= document.createElement('button');
  let feedBackButton=document.createElement('button');
  let hoursInput=document.createElement('input');
  hoursInput.setAttribute("type", "number");
  hoursInput.setAttribute("placeholder", "Enter time spent on this assignment");
  let hoursSubmit=document.createElement('button');
  let stressInput=document.createElement('input');
  stressInput.setAttribute("type", "number");
  stressInput.setAttribute("min", "0");
  stressInput.setAttribute("max", "10");
  stressInput.setAttribute("maxLength", "2");
  let newlabel = document. createElement("Label");
  newlabel.setAttribute("for",stressInput);
  newlabel.innerHTML = "How stressed do you feel about this assignment 1-10?";
  newlabel.style.marginLeft ="1rem";
  let stressSubmit= document.createElement('button');
  addPropsToElement(stressInput,{"id": "stressinput"+homework.id,"class":"stressInput"})
  addPropsToElement(stressSubmit,{"id":"stresssubmit"+homework.id,"class":"stressSubmit"}, "Submit")
  addPropsToElement(hoursInput,{"id":"hoursinput"+homework.id,"class":"hoursInput"})
  addPropsToElement(hoursSubmit,{"id":"hourssubmit"+homework.id,"class":"hoursSubmit"}, "Submit")
  addPropsToElement(feedBackButton,{"id":"feedbackbtn"+homework.id,"class":"feedBackButton"}, "Add Feedback");
  addPropsToElement(homeworkContainer,{"id":"hmwkCont"+homework.id,"class":"HomeworkContainer"})
  addPropsToElement(nameContainer,{"id":"hmwkName"+homework.id,"class":"HomeworkText"}, homework.name)
  addElementsToFather(homeworkContainer,nameContainer,homeworkMarkButton,feedBackButton,hoursInput,hoursSubmit,newlabel,stressInput,stressSubmit);
  addListenerForfurtherinfo(nameContainer,homework);
  InitializeMarkButton(homeworkMarkButton,homework.id)
  InitializeFeedBackButton(feedBackButton);
  InitializeHoursFeedback(hoursInput,hoursSubmit);
  initializeStressLevel(stressInput,stressSubmit);
  sendStresslevelListener(stressSubmit,homework.id);
  return homeworkContainer
}