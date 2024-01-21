

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


/************TASK COUNT************/
function taskCounter(list){
    const textHolder = document.getElementById('count')
    let length = list.length
    textHolder.innerHTML = length
}



/*********************************** NEW FEATURES *******************************/
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

    //Open form for new list entry
    document.querySelector('.add-new-item').addEventListener('click', openNewForm )
    //Close to-do list form
    document.querySelector('.exit-form').addEventListener('click', closeForm)

     
    //Close full view container
    document.querySelector('.exit-full-view').addEventListener('click', closeFullViewContainer)
    
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


const listDetailContainer = document.querySelector('.list-detail-container') //For Full View Container
const todoNewEntryForm = document.querySelector('.new-todo-item-container')
const todoListDisplay = document.querySelector('.middle-container')
function openNewForm(){
    todoListDisplay.classList.add('screen-size-40')
    todoNewEntryForm.classList.add('display')
}
function reOpenFormToEdit(){
    listDetailContainer.classList.remove('display-list-detail-container')
    todoListDisplay.classList.add('screen-size-40')
    todoNewEntryForm.classList.add('display')
}
function closeForm(){
    todoListDisplay.classList.remove('screen-size-40')
    todoNewEntryForm.classList.remove('display')
    clearForm()
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
    clearForm(typeOfTodo)        


    //Insert object to array
     formDataArr.push(formData)
 
    //Saving object to localStorage
     localStorage.setItem('FormData', JSON.stringify(formDataArr))
  
 
    //Call the function that will display the categories
      compareDates()
      closeForm()
  
}

//Used when localStorage key is deleted manually
function savingDataInArr(){
    const savedFormItems = localStorage.getItem('FormData')
    formDataArr = JSON.parse(savedFormItems)

    if(!formDataArr){ //null is falsy
        formDataArr = []
    }
}


function clearForm(typeOfTodo){
    
    //title
    document.getElementById('title-input').value = ""
    document.getElementById('title-input').placeholder = "Add Title"

    typeOfTodo = ""; //Event or task

    //description
    document.getElementById('input-dedscription').value = ""
    document.getElementById('input-dedscription').placeholder = "Add Description"

    formCurrentDate() //Date

    //Map
    //mapID.style.display = 'none' I will active this code later - this is the map
}


//Manually enter information in form
function reEnterForm(id, title, type, date, description, category, color){
    reOpenFormToEdit()//reopen form container

    //enter all info in the form
    document.getElementById('title-input').value = title
    //Description
    document.getElementById('input-dedscription').value = description 
}

//Reset Entry
function resetEntry(listId){
    const editBtn = document.querySelector('.edit-btn')
    editBtn.addEventListener('click', function(){
        formDataArr.forEach((dataEntry, i)=>{
            if(dataEntry.id == listId){

                reEnterForm(dataEntry.id, dataEntry.title, dataEntry.type, dataEntry.date, dataEntry.description, dataEntry.category, dataEntry.color)
            }
        })

    })
}

//function for deleting forms will go here
function deleteEntry(currentListID){
    const deleteBtn = document.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', function(){

        formDataArr.forEach((dataEntry, i)=>{
            if(dataEntry.id == currentListID){
                //delete
                console.log('it matches', i)
                formDataArr.splice(i, 1)
                localStorage.setItem('FormData', JSON.stringify(formDataArr))

                closeFullViewContainer()
                compareDates()

                //Remove selected checkbox 
                localStorage.removeItem(currentListID)   
                
            } 
          })
    })
}


//HTML element where list will be inserted (UL)
let todoList = document.getElementById('todo-List')

function compareDates(){
    const options={
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }
   //Changed date format to ##/##/####, so that it matches the list item date format
   let dateFormat = currentDate.toLocaleDateString('en-US', options) 
   
  
   todoList.innerHTML =""
   formDataArr.forEach((dataEntry, i)=>{
        if(dataEntry.date == dateFormat){
            displayPreviewOfTodoList(dataEntry.id, dataEntry.title, dataEntry.type, dataEntry.date, dataEntry.category, dataEntry.color)
        } 
    })
}

function displayPreviewOfTodoList(id, title, type, date, category, color){
    todoList.innerHTML += `<li class="list-item" id="${id}"><label class="container"> <input type="checkbox" id="${id}" class="checkbox"><span class="checkmark"></span></label> ${title} <i class="fa-solid fa-chevron-right list-arrow"></i></li><p class="list-details">${date} | ${type} | ${category} <span class="color-box" style="background-color:${color};"></span></p>`
    
    //To add an eventlistener to arrow icons next to list item incase user wants to a full view
    getList()
    //checkbox
    trackCheckboxStatus()
}  

function trackCheckboxStatus(){
    todoList = document.getElementById('todo-List') //updated UL element
    // Add an event listener to the checkboxes
    document.querySelectorAll('.container input').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            localStorage.setItem(this.id, this.checked);
        });

    // Retrieve the checked state from local storage on page load
    const isChecked = localStorage.getItem(checkbox.id) === 'true';
    checkbox.checked = isChecked;
    });

}



function openFullViewContainer(){
    listDetailContainer.classList.add('display-list-detail-container')
    todoListDisplay.classList.add('screen-size-40') //not remove a window, just making it smaller
}
function closeFullViewContainer(){
    todoListDisplay.classList.remove('screen-size-40')
    listDetailContainer.classList.remove('display-list-detail-container')
}

let fullListView = document.getElementById('full-list-view')
function getList(){
    todoList = document.getElementById('todo-List') //list of item(s) displayed for selected date
    let arrowIcon = document.querySelectorAll('.list-arrow')
    let list = document.querySelectorAll('.list-item')

    arrowIcon.forEach((arrow, j)=>{
        arrow.addEventListener('click', function(){
           let currentListID = Number(list[j].id) //getting id of each list item and turning it into a number

           fullListView.innerHTML= ""
            formDataArr.forEach((dataEntry)=>{
                if(dataEntry.id == currentListID ){

                    /////FULL VIEW OF TODO LIST/////
                    viewFullDetailsOfTodoItem(dataEntry.title,dataEntry.date, dataEntry.type, dataEntry.description, dataEntry.category, dataEntry.color, dataEntry.location ) 
                    openFullViewContainer() //Div opens up on the right side
                }  
            })

            deleteEntry(currentListID) //The delete btn is now able to listen to clicks
            resetEntry(currentListID) //The option to reset entry is now available
        })
    })    
}


/////FULL VIEW OF TODO LIST/////
function viewFullDetailsOfTodoItem(title, date, type, description, category, color, location){
    fullListView.innerHTML = `<li id='todo-entry'>
                                <div>
                                <p id="type-of-List">${type}</p>
                                <p class="entry-date-category-color">${date} | ${category} <span class="color-box" style="background-color:${color};"></span></p>
                                <h2 id="entry-title">${title}</h2>
                                <p id="entry-description">${description}</p>
                                <p id="entry-location">Location: ${location}</p>
                                </div>
                                <div class="delete-edit-btn-container">
                                    <button type="button" class="delete-btn">Delete</button>
                                    <button type="button" class="edit-btn">Edit</button>
                                </div>
                            </li>`
}


////////////////INFORMATION NEEDED FOR TODO LIST FORM SUBMISSION/////////////////////
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





