
const currentDate = document.getElementById('date')
const day = document.getElementById('currentDay')
const monthAndNum = document.getElementById('month-numberDate')
const newTask = document.querySelector('.fa-plus')
const closeTask = document.querySelector('.fa-xmark')
const inputEl = document.getElementById('input-el')
const ulEl = document.getElementById('list')
const inputBtn = document.querySelector('.fa-angles-right')

let tasksfromLocalStorage = JSON.parse(localStorage.getItem("myTasks")) //converts it to a javascript object
let myTasks = []
let trashCan =''





/*****************GET DATE*************/
const monthName = ["Jan.", "February", "March", "April", "May", "June", "July", "Aug.", 
"Sept.", "Oct.", "Nov.", "Dec."]

const dayName = ["Sunday,", "Monday,", "Tuesday,", "Wednesday,", "Thursday, ", "Friday,", "Saturday,"]


function getDate(){
    let today = new Date() /*this gives me all the information, but too much information*/
    let month = monthName[today.getMonth()]  /*Feb*/
    let date = today.getDate() /*18*/
    date = ordinalNumbers(date)

    let currentDay = dayName[today.getDay()]  /*sat.*/
    let todayDate = `${currentDay}`
    let monthNum = `${month} ${date}`

    day.innerHTML = todayDate
    monthAndNum.innerHTML = monthNum

    setTimeout(function(){
        getDate()
    }, 3000)
}
getDate()

function ordinalNumbers(d){
    if (d === 1 || d === 21 || d === 31){
        return d + "st"
    }else if (d === 2 || d === 22){
        return d + "nd"
    } else if (d === 3 || d === 23){
        return d + "rd"
    } else {
        return d + "th"
    }
}





/**********RENDER*************/
/*
if (tasksfromLocalStorage){
    myTasks = tasksfromLocalStorage
    render(myTasks)

    
} 



inputBtn.addEventListener("click", function(){ //clicking enter button to add item to list

    if (inputEl.value == '' ){
        inputEl.placeholder = "Text Required"
        document.querySelector('input[type=text]').style.setProperty("--c", "#ff6666")
        
    } else{
        myTasks.push(inputEl.value)
        inputEl.value = '';
        localStorage.setItem("myTasks", JSON.stringify(myTasks))
        render(myTasks)
        closeForm()
    }
      
})


inputEl.onkeydown = function(event){ //pressing enter key instead of clicking button
    if(inputEl.value == '' && event.which == 13){ //the number 13 means you pressed the enter key
        inputEl.placeholder = "Text Required"
        document.querySelector('input[type=text]').style.setProperty("--c", "#ff6666")

    } else if (event.which == 13){
        myTasks.push(inputEl.value)
        inputEl.value = '';
        localStorage.setItem("myTasks", JSON.stringify(myTasks))
        render(myTasks)
        closeForm()
    }
}
*/



function render(tasks){
    let listItems = "";
    checkboxCount = 1;
    for (let i = 0; i < tasks.length; i++){
        trashCan = `<i class="fa-regular fa-trash-can"></i>`
        listItems += 
            `<li class="items"><input type="checkbox" class="regular-checkbox" name="checkbox"> <label><span id="text"> ${tasks[i]}</span></label>${trashCan}</li>`
           
            
           /*It clears the listItem and then shows you the different changes to what
           listItems is*/  
    } 
   
    /*when you console log listItem here, now you get what listItem is with the
    step by step changes*/

    ulEl.innerHTML = listItems
    taskCounter(tasks)
    setID(checkboxCount)
    deleteItem()
   
}


/**************Add ID attribute to List ***********/

function setID(count){
    let inputCheckbox = document.querySelectorAll('input[type=checkbox]') //NodeList of checkboxes
    let checkboxArr = Array.from(inputCheckbox) //convert it to an array
    checkboxArr.forEach(function(checkboxx){ //each input list item has an id number
        let checkNum = count++ 
        checkboxx.setAttribute("id", checkNum) 
        
        checkbox()
    })

    inputCheckbox.forEach(function(checkbox){
        let checkboxId = checkbox.id
        localStorage.setItem(checkboxId, checkbox.checked) //It must have a key-value pair..
        //for the second item, I get a boolean value of whether or not the checkbox is checked
        //it will storge the id number and a boolean value
    })
   
}


/******************CHECKBOX ****************/
function checkbox(){ //checks for updates to the checkbox and stores the changes in localStorage
    let inputCheckbox = document.querySelectorAll('input[type=checkbox]')

    inputCheckbox.forEach(function(checkbox){
        checkbox.addEventListener('click', function(){
            let checkboxId = checkbox.id
            localStorage.setItem(checkboxId, checkbox.checked)
        })
    })
    
/*checked attribute is a boolean attribute
The below code is checking the checked status of all the
checkboxes. If there was no clicks, their state is set to false for all
permantantly until a click is made. Then, it will update the state.*/

 
    inputCheckbox.forEach(function(checkbox){
        let checkboxId = checkbox.id;
        let checkboxState = localStorage.getItem(checkboxId)
        if (checkboxState === 'true'){
            checkbox.checked = true;
        } else{
            checkbox.checked = false;
        }
    })
}


/*************DELETE*****************/
function deleteItem(){
    let inputCheckbox = document.querySelectorAll('input[type=checkbox]')
    const trashIcons = document.querySelectorAll('.fa-trash-can')
    let trashArr = Array.from(trashIcons)
    

    for (let i = 0; i < trashArr.length; i++){
        trashArr[i].addEventListener('click', ()=>{
         myTasks.splice(i, 1)

         let checkboxState = localStorage.getItem(inputCheckbox[i].id)
         let checkboxState2 = localStorage.getItem(inputCheckbox[i + 1]?.id) /*I used optional chaining operator (?)
         this is what fixed the undefined error*/
            
         
         if(checkboxState === 'true'){
            inputCheckbox[i].checked = false
            localStorage.setItem(inputCheckbox[i].id, inputCheckbox[i].checked)
            
         } else if (checkboxState === 'false' && checkboxState2 === 'true'){
            inputCheckbox[i].checked = true
            inputCheckbox[i + 1].checked = false
            localStorage.setItem(inputCheckbox[i].id, inputCheckbox[i].checked)
            localStorage.setItem(inputCheckbox[i + 1].id, inputCheckbox[i + 1].checked)
           
         } 

        
        render(myTasks)
        localStorage.setItem("myTasks", JSON.stringify(myTasks))
             
        })
    }

}


/************TASK COUNT************/
function taskCounter(tasks){
    const textHolder = document.getElementById('count')
    let length = tasks.length
    textHolder.innerHTML = length
}



/***************PopUp box************/
newTask.addEventListener('click', openForm)
closeTask.addEventListener('click', closeForm)


function openForm(){
    document.getElementById('myForm').style.display = "block"
    inputEl.placeholder == "Task Name"
    document.querySelector('input[type=text]').style.setProperty("--c", "#9b8fca")

}


function closeForm(){
        document.getElementById('myForm').style.display = "none"
        inputEl.placeholder = "Task Name"
       
} 






/*****Left side container*******/
document.addEventListener('DOMContentLoaded', () =>{
    document.querySelector('.fa-circle-plus').addEventListener('click', addNewCategory)    

    //Call the function to display categories when the page loads
    displayCategories();

    //Form submission when adding a new event or task
    document.getElementById('add-to-calender-form').addEventListener('submit', submitForm )
})



let categories = [];

function addNewCategory() {
    //I need to capitalize the first letter of each value entered and give it a word limit

    let category = {
        id: Date.now(),
        name: document.getElementById('input-category').value
    }

    //If statement if users leave the form empty - It need to make the UI better
    //Maybe this comment should be placed above the inptu box
    if (category.name.trim() === ""){
        alert("Please enter a category name");
        return;
    }

    //push object to the categories array
    categories.push(category);  


     //reset the value box to blank                                           
    document.getElementById('input-category').value = "Add a Category"  
   
 
    //Saving array to localStorage
    localStorage.setItem('MyCategoryList', JSON.stringify(categories))
 

     //Call the function that will display the categories
     displayCategories()

    
}


const paragraphContainer = document.querySelector('.category-list-container')
const categorySection = document.querySelector('.categories')

function displayCategories(){

     const savedCategories = localStorage.getItem('MyCategoryList')
     
        if(savedCategories){
            categories = JSON.parse(savedCategories) //Turns it into an array of objects
            paragraphContainer.innerHTML = ""       //Remove anything that was previously there
        
            categories.forEach((category) => {
                paragraphContainer.innerHTML +=  `<p class="top-margin-menu new-category">${category.name}<i class="fa-solid fa-xmark categories-xmark-icon"></i></p>`
            })
            
          
            //Pass the xmark-icons to the deleteCategories function
            const categoriesCloseIcon = document.querySelectorAll('.categories-xmark-icon');
            deleteCategories(categoriesCloseIcon)
        }
}


function deleteCategories(closeIcons){
    const savedCategories = localStorage.getItem('MyCategoryList')
    let categories = JSON.parse(savedCategories)
    let iconArr = Array.from(closeIcons)
    
    //Use the index of iconArr array to find the index of the categories array 
    iconArr.forEach((item, i)=>{ 
        item.addEventListener('click', function(){
          
            //Remove selected i from the categories array when x-mark icon clicked, update localStorage, and update the UI
            categories.splice(i, 1)
            localStorage.setItem('MyCategoryList', JSON.stringify(categories))
            displayCategories()
            
        })
    })
}





// FORM SUBMISSION FOR NEW EVENT OR TASK //
let formDataArr = [];

function submitForm(ev){
    ev.preventDefault(); //to stop the form from submitting

    //Title 
    const title = getTitle()    

    //Due Date
    const date = handleAddTimeClick()

    //Description

    //Category

    //Location

    //Attachments

    //Images

    //Create an object that inputs all the information that will be transferrable to other areas of my code
    //Make sure it give it an ID 
    //It need to meet certain requirements or else an error message should be used.
    const formData = {
        id: Date.now(),
        title: title,
        type: typeOfTodo,
        date: date,

    }

     //If the title field is empty, a message will appear and nothing will be inserted in localStorage
     //This might go into its own function
     //The button has to stay disabled if something is missing but some of the options are not require
    if(formData.title.trim() === ""){
        alert("Please enter a title");
        return;
    }
    if (!typeOfTodo){
        alert('Please select Event or Task');
        return;
    }
    if(!date){
        alert('Please submit a due date')
        return;
    }
   
     //reset the value box to blank                                           
     //document.getElementById('title-input').value = "Add Title"
     typeOfTodo = "";  

     //Insert object to array
     formDataArr.push(formData)
 
     //Saving object to localStorage
     localStorage.setItem('FormData', JSON.stringify(formDataArr))
  
 
      //Call the function that will display the categories
      //It should display in the middle container
    // console.log(formData.title)
}

function getTitle(){
        const titleInput = document.getElementById("title-input")
        const titleValue = titleInput.value.trim()  

        //reset the value box to blank
        document.getElementById('title-input').value = "Add Title" 

        return titleValue
}

let typeOfTodo = '';
function toggleTaskEventHighlight(){
    const eventOption = document.getElementById('event-option')
    const taskOption = document.getElementById('task-option')
    const parentDiv = document.getElementById('top-section')

    parentDiv.addEventListener('click', function(e){
        let target = e.target

        if(target.id === 'event-option'){

            //Change color of the button
            eventOption.classList.add('clicked')
            taskOption.classList.remove('clicked')

            //Obtain the value
            const value = target.textContent.trim()
            typeOfTodo = value
            
        } else if (target.id === 'task-option'){

            //Change color of the button
            taskOption.classList.add('clicked')
            eventOption.classList.remove('clicked')

            //Obtain the value
            const value = target.textContent.trim()
            typeOfTodo = value
            
        }
    }) 
}
toggleTaskEventHighlight()


function formCurrentDate(){
    //Input the current month, date, and year 
    const formDate = document.getElementById('form-Due-date')
    let today = new Date()
    let monthNum = today.getMonth() + 1 //zero 
    let month = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    let date = today.getDate() 
    let year = today.getFullYear()

    let fullDate = `${year}-${month}-${date}`
    formDate.value = fullDate
   
}
formCurrentDate();
setInterval(formCurrentDate, 24 * 60 * 60 * 1000);

function handleAddTimeClick(){
    const formDate = document.getElementById('form-Due-date').value;
    
    //Convert thed ate to a Date object
    const dateObject = new Date(`${formDate}T00:00:00`);

    //Extract individual date components
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to make it 1-indexed
    const day = dateObject.getDate().toString().padStart(2, '0');
    const year = dateObject.getFullYear();

    //Format the date as mm-dd-yyyy
    const formattedDate = `${month}-${day}-${year}`;

    return formattedDate

}
const addTimeBtn = document.getElementById('submit-date')
addTimeBtn.addEventListener('click', handleAddTimeClick)













