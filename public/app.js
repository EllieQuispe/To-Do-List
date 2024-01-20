

//const currentDate = document.getElementById('date')
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
/*
const monthName = ["Jan.", "February", "March", "April", "May", "June", "July", "Aug.", 
"Sept.", "Oct.", "Nov.", "Dec."]

const dayName = ["Sunday,", "Monday,", "Tuesday,", "Wednesday,", "Thursday, ", "Friday,", "Saturday,"]


function getDate(){
    let today = new Date() /*this gives me all the information, but too much information*/
/*    let month = monthName[today.getMonth()]  /*Feb*/
/*    let date = today.getDate() /*18*/
/*    date = ordinalNumbers(date)

    let currentDay = dayName[today.getDay()]  /*sat.*/
/*    let todayDate = `${currentDay}`
    let monthNum = `${month} ${date}`

    day.innerHTML = todayDate
    monthAndNum.innerHTML = monthNum

    setTimeout(function(){
        getDate() */
 /*   }, 3000) 
} */
//getDate() 
/*
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
*/





//Render Tasks and Event 


/**********RENDER*************/
/*
if (tasksfromLocalStorage){
    myTasks = tasksfromLocalStorage
    render(myTasks)

} 
//I dont' need the addEventListener for this btn
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
      
}) //Delete


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
} Delete
*/ 


/*
function render(tasks){
    let listItems = "";
    checkboxCount = 1;
    for (let i = 0; i < tasks.length; i++){
        trashCan = `<i class="fa-regular fa-trash-can"></i>`
        listItems += 
            `<li class="items"><input type="checkbox" class="regular-checkbox" name="checkbox"> <label><span id="text"> ${tasks[i]}</span></label>${trashCan}</li>`
           
            
           /*It clears the listItem and then shows you the different changes to what
           listItems is*/  
 /*   } 
   
    /*when you console log listItem here, now you get what listItem is with the
    step by step changes*/
/*
    ulEl.innerHTML = listItems
    taskCounter(tasks)
    setID(checkboxCount)
    deleteItem()
   
} 
*/

//Display Months






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








/*********************** NEW FEATURES *************************/
document.addEventListener('DOMContentLoaded', () =>{
    //New category submission
    document.querySelector('.fa-circle-plus').addEventListener('click', addNewCategory)    
    //Call the function to display categories when the page loads
    displayCreatedCategories();

    //Form submission when adding a new event or task
    document.getElementById('todo-form').addEventListener('submit', submitForm )
    //Call the function to display the data from the form when the page loads
    savingDataInArr()

    //Date feature initilization
    initializeDateFeature();
})



let currentDate = new Date()

function initializeDateFeature(){

    function updateDateDisplay(){
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        //Display to the UI
        document.getElementById('day-of-the-week').textContent = currentDate.toLocaleDateString('en-US', {weekday: "long"})
        document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('en-US',options)

       // console.log(getSelectedDate()) 
        compareDates()
    }
    updateDateDisplay()


    //Arrow buttons to change dates
    function previousDate(){
        currentDate.setDate(currentDate.getDate() - 1)
        updateDateDisplay()
    }

    function nextDate(){
        currentDate.setDate(currentDate.getDate() + 1)
        updateDateDisplay()
    }

//Listenting for a click on the arrow buttons
document.getElementById('previousBtn').addEventListener('click', previousDate)
document.getElementById('nextBtn').addEventListener('click', nextDate)
}



let categories = [];

function addNewCategory() {
    //I need to capitalize the first letter of each value entered and give it a word limit

    let category = {
        id: Date.now(),
        name: document.getElementById('input-category').value
    }

    //If statement if users leave the form empty - It need to make the UI better
    //Maybe this comment should be placed above the inptu box
    if (category.name.trim() === "" || category.name.trim() == "Add a Category"){
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
     displayCreatedCategories()    
}


const paragraphContainer = document.querySelector('.category-list-container')
const categorySection = document.querySelector('.categories')

function displayCreatedCategories(){
     const savedCategories = localStorage.getItem('MyCategoryList')
     let categoriesArr = [];
     paragraphContainer.innerHTML = ""  

    
   if(!savedCategories || savedCategories === '[]'){  //false('[]')  true
        categories = JSON.parse(savedCategories) //Turns it into an object

        if(!categories){ //null is falsy (When localStorage key is deleted manually)
            categories = [ ]
        }

   } else{ //false false
         categories = JSON.parse(savedCategories) //Turns it into an array of objects

            categories.forEach((category) => {
                paragraphContainer.innerHTML +=  `<p class="top-margin-menu new-category">${category.name}<i class="fa-solid fa-xmark categories-xmark-icon"></i></p>`
                categoriesArr.push(category.name)
            })
           
            //Option to delete created category is now available
            deleteCategories()
   }

   displayCategoryOptions(categoriesArr) //categories created should be in sync with category options in the new entry form
   deleteCategoryPickerContainer(categories) //Remove the categories option when no category created
}


function deleteCategories(){
    const savedCategories = localStorage.getItem('MyCategoryList')
    categories = JSON.parse(savedCategories)

    const closeIcons = document.querySelectorAll('.categories-xmark-icon');
    let iconArr = Array.from(closeIcons)
    
    //Use the index of iconArr array to find the index of the categories array 
    iconArr.forEach((icon, i)=>{ 
        icon.addEventListener('click', function(){
          
            //Remove selected i from the categories array when x-mark icon clicked, update localStorage, and update the UI
            categories.splice(i, 1)
            localStorage.setItem('MyCategoryList', JSON.stringify(categories))
            displayCreatedCategories()
        })
    })
}






//******************* FORM SUBMISSION FOR NEW EVENT OR TASK ************************//
//Remove display block for the map once the user clicks btn
const mapID = document.getElementById('map')
let formDataArr = [];

function submitForm(ev){
    ev.preventDefault(); //to stop the form from submitting

    //Title 
    const title = getTitle()    

    //Due Date
    const date = getSelectedDate()
    //Description
    const description = textareaValue()
    //Category
    const category = categorySelected()
    //Color
    const color = colorPickerValue()
    //Location
    const location = clientAddress()

    
    //Object
    const formData = {
        id: Date.now(),
        title: title,
        type: typeOfTodo,
        date: date,
        description: description,
        category: category,
        color: color,
        location: location,

    }

    //Missing items before submission//
        //Add title input field
        if(formData.title.trim() === "" || formData.title.trim() == "Add Title"){
            alert("Please enter a title");
            return;
        }

        //Btn for event and task
        if (!typeOfTodo){
            alert('Please select Event or Task');
            return;
        }
        resetBtn()

        //Date submission
        if(!date){
            alert('Please submit a due date')
            return;
        }

    //Reset Values//                                         
        typeOfTodo = ""; //Event or task
        formCurrentDate() //Date
        //mapID.style.display = 'none' I will active this code later


     //Insert object to array
     formDataArr.push(formData)
 
     //Saving object to localStorage
     localStorage.setItem('FormData', JSON.stringify(formDataArr))
  
 
      //Call the function that will display the categories
      //It should display in the middle container
    // console.log(formData.title)
    compareDates()
}

function savingDataInArr(){
    const savedFormItems = localStorage.getItem('FormData')
    formDataArr = JSON.parse(savedFormItems)
    //console.log(formDataArr)
    if(!formDataArr){ //null is falsy (When localStorage key is deleted manually)
        formDataArr = []
    }
}

//function for deleting forms will go here
function deleteEntry(){
    //call localStorage and remove with the help of the X icon
    //reset localStorage
    //call compareDates

}
    


function compareDates(){
    const options={
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }

    let dateFormat = currentDate.toLocaleDateString('en-US', options) //##/##/####
    //console.log(dateFormat) //The date changes with the arrow and the format is now the same as how it's save but it's a string

   const todoList = document.getElementById('todo-List') //UL
   todoList.innerHTML =""
  
    formDataArr.forEach((dataEntry, i)=>{
        if(dataEntry.date == dateFormat){
            displayEntryForCurrentDay(dataEntry.title, dataEntry.type, dataEntry.date, dataEntry.description, dataEntry.category, dataEntry.color, dataEntry.location)
        } 
    })
}


const todoList = document.getElementById('todo-List') //UL

function displayEntryForCurrentDay(title, type, date, description, category, color, location){ 
    todoList.innerHTML += `<li class="list-item"> <input type="checkbox" class="checkbox"> ${title} <i class="fa-solid fa-chevron-right list-arrow"></i> </li><p class="list-details">${date} | ${type} | ${category} <span class="color-box" style="background-color:${color};"></span></p>` 
}  




//Form submission input fields//
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
    const parentDiv = document.querySelector('.top-section')

    parentDiv.addEventListener('click', function(e){
        let target = e.target
        console.log(target)

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

function resetBtn(){
    const eventOption = document.getElementById('event-option')
    const taskOption = document.getElementById('task-option')

    taskOption.classList.remove('clicked')
    eventOption.classList.remove('clicked')
}


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


function getSelectedDate(){
    const formDate = document.getElementById('form-Due-date').value;
    
    //Convert the date to a Date object
    const dateObject = new Date(`${formDate}T00:00:00`);

    //Extract individual date components
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to make it 1-indexed
    const day = dateObject.getDate().toString().padStart(2, '0');
    const year = dateObject.getFullYear();

    //Format the date as mm-dd-yyyy
    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate
}

function clientAddress(){
    const addressInput = document.getElementById('addressInput')
    const address = addressInput.value.trim()

    //Reset
    addressInput.value = "Add Location"

    return address
}
//Obtain the value entered in the textarea element
function textareaValue(){
    const textareaId = document.getElementById('input-dedscription')
    const description = textareaId.value.trim()

    //Reset
    textareaId.value = "Add Description"
    return description
}

function displayCategoryOptions(catArr){
    const categoryOption = document.getElementById('categories-option')
    categoryOption.innerHTML = ""
    
    catArr.forEach((category)=>{
        categoryOption.innerHTML += `<option class="category-option" value=${category}>${category}</option>`
    }) 
    categorySelected()
}


function deleteCategoryPickerContainer(catg){
    const categoryContainer = document.querySelector('.select-category-container')
    if(catg == ''){  //if
       categoryContainer.classList.add('hideCategoryBox')
    } else{
        categoryContainer.classList.remove('hideCategoryBox')
    }
}


//Obtain the category value that user selects from drop-down list
const categoriesOption = document.getElementById('categories-option')
categoriesOption.addEventListener('change', categorySelected)
function categorySelected(){
    const categoryName =document.getElementById('categories-option').value
    
    return categoryName
}


//Obtain the color picker value
const defaultColor = document.getElementById('color-options')
defaultColor.addEventListener('change', watchColorPicker, false)
let newColorValue =''

function watchColorPicker(event){
    newColorValue = event.target.value
    return newColorValue
}
function colorPickerValue(){
    if (defaultColor.value == '#7d5e8f'){
        return defaultColor.value
    } else{
        return newColorValue
    }  
}


//Address of user
function clientAddress(){
    const addressInput = document.getElementById('addressInput')
    const address = addressInput.value.trim()

    //reset
    addressInput.value = "Add Location"

    return address
}

/* The code below works but to not go past my request rate
//Map that will display the location
function initializeMap(){
    //Fetch the Mapbox API Token from server
    fetch('/getMapboxToken')
        .then(response=> response.json())
        .then(data => {
            if(data.success){
                mapboxgl.accessToken = data.token;
                const map = new mapboxgl.Map({
                    container: 'map', // container ID
                    style: 'mapbox://styles/mapbox/streets-v12', // style URL
                    center: [-74.5, 40], // starting position [lng, lat]
                    zoom: 9, // starting zoom
                });

                 //Add a marker
                const marker = new mapboxgl.Marker()
                .setLngLat([0, 0]) // Set initial marker position (it will be updated later)
                .addTo(map);


                //Even Listener to call the function findAddress()
                const mapBtn = document.querySelector('.map-btn')
                mapBtn.addEventListener('click', ()=> findAddress(map, marker));

            } else{
                console.log(data.error || 'Failed to fetch Mapbox token');
            }
        })
        .catch(error => console.error('Error:', error));     
}


function findAddress(map, marker){
    const addressInput = document.getElementById('addressInput').value  //You will need the value to store it in localStorage      

   //Display the map
    mapID.style.display = 'block'
 
    fetch('/geocode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Mapbox-Token': mapboxgl.accessToken,
        },
        body: JSON.stringify({addressInput}),
    })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                const location = data.location

                //Update the marker position and map's center
                marker.setLngLat(location);
                map.flyTo({
                  center: location,
                  zoom: 15,
                  speed: 1,
                  essential: true,
                });
            } else{
                alert(data.error || 'Location not found');
            }
        })
        .catch(error => console.error('Error:', error))
}
initializeMap()

*/





