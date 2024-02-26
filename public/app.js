
document.addEventListener('DOMContentLoaded', () =>{
    //New category submission
    document.querySelector('.fa-circle-plus').addEventListener('click', addNewCategory)    
    //Call the function to display categories when the page loads
    displayCreatedCategories();
    //Delete categories
    displayCategoryDeleteBtn()

     //Open form for new list entry
     document.querySelector('.add-new-item').addEventListener('click', openForm )
     //Close to-do list form
     document.querySelector('.exit-form').addEventListener('click', closeForm)

    //Form submission when adding a new event or task
    document.getElementById('todo-form').setAttribute('novalidate', '')
    document.getElementById('todo-form').addEventListener('submit', submitForm )
    //Clear form
    document.querySelector('.clear-btn').addEventListener('click', clearForm)
    //Call the function to display the data from the form when the page loads
    savingDataInArr()

    //Close full view container
    document.querySelector('.exit-full-view').addEventListener('click', closeFullViewContainer)

    //Date feature initilization
    initializeDateFeature();
    
})

///Current date for Today button///
let currentDate = new Date()
document.querySelector('.today').addEventListener('click', function(){
    let currentDateForTodayButton = new Date()

        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        //Display full day to the UI
        document.getElementById('currentDate').textContent = currentDateForTodayButton.toLocaleDateString('en-US',options)
        //Display week day to UI
        document.getElementById('day-of-the-week').textContent = currentDateForTodayButton.toLocaleDateString('en-US', {weekday: "long"})
        
        compareDates(currentDateForTodayButton)//compare localStorage object dates with current date
        currentDate = currentDateForTodayButton;
})


////Dropdown profile settings////
const container = document.querySelector('.settings-container');
const dropDownContainer = document.querySelector('.drop-down-container')

function openSettings(downArrow, upArrow){
    dropDownContainer.classList.add('display') //displaying the dropdown container
    downArrow.classList.remove('active')
    upArrow.classList.add('active')
}
function closeSettings(upArrow, downArrow){
    dropDownContainer.classList.remove('display')
    downArrow.classList.add('active') 
    upArrow.classList.remove('active')   
}

container.addEventListener('click', function(event){
    const downArrow = container.querySelector('.drop-down-menu-icon')
    const upArrow = container.querySelector('.up-arrow-icon')

    if(event.target.classList.contains('drop-down-menu-icon')){
        openSettings(downArrow, upArrow)

    } else if(event.target.classList.contains('up-arrow-icon')){
        closeSettings(upArrow, downArrow)
    } 
    //Close menu if user clicks outside of menu container
    document.addEventListener('click', function(event){
        if(!dropDownContainer.contains(event.target) && !downArrow.contains(event.target)){
           closeSettings(upArrow, downArrow)
        }
    })
})


///////////////////CURRENT DATE///////////////////////////////
function initializeDateFeature(){

    function updateDateDisplay(){
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        //Display full day to the UI
        document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('en-US',options)
        //Display week day to UI
        document.getElementById('day-of-the-week').textContent = currentDate.toLocaleDateString('en-US', {weekday: "long"})
       
        compareDates(currentDate)//compare localStorage object dates with current date
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


////////////////////////ADDING A CATEGORY/////////////////////////////Might move it to the form sections
let categories = [];
function addNewCategory() {
    
    let inputCategory = document.getElementById('input-category')
    let categoryName = inputCategory.value.trim();

    if(validateInput(categoryName)){
        categoryName = capitalizeFirstLetter(categoryName);

        let category = {
            id: Date.now(),
            name: categoryName
        };

        //push object to the categories array
        categories.push(category); 

         //reset the value box to blank   
        inputCategory.value = ""                                       
        inputCategory.placeholder = "Add a Category" 

         //Saving array to localStorage
        localStorage.setItem('MyCategoryList', JSON.stringify(categories))

         //Call the function that will display the categories
        displayCreatedCategories()  
    } 
}

////Validating the category input box////
function validateInput(name){
    //Check if the input is blank
    if (name === "" || name === "Add a Category"){
        categoryErrorMessage("Enter a category name")
        return false;
    } 
        categoryErrorMessage("")
        return true;
}
function categoryErrorMessage(message){
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerHTML = message;
}

document.getElementById('input-category').addEventListener('input', function(){
    categoryErrorMessage("")
})

function capitalizeFirstLetter(str){
    //Capitalize the first letter of a string
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/////Display category/////
let paragraphContainer = document.querySelector('.category-list-container') //<div>

function displayCreatedCategories(){
     const savedCategories = localStorage.getItem('MyCategoryList') //Array of objects
     paragraphContainer.innerHTML = ""  
     let categoryNamesArr = [];
    
   if(!savedCategories || savedCategories === '[]'){  //true false('[]')  
        categories = JSON.parse(savedCategories) 
       
        if(!categories){ //null is falsy 
            categories = []
        }

   } else{ //false false
         categories = JSON.parse(savedCategories) //An array of objects

         categories.map((category)=>{
            paragraphContainer.innerHTML +=  `<p class="top-margin-menu new-category">${category.name}<i class="fa-solid fa-xmark categories-xmark-icon"></i></p>`
            categoryNamesArr.push(category.name)
         })           
           
        //Option to delete created category is now available
        deleteCategories()
   }

   displayCategoryOptions(categoryNamesArr) //synching the category names with the category options available in the new entry form
   deleteCategoryPickerContainer(categories) //Remove the categories option when no category created
   displayCategoryDeleteBtn()
}

///Hovering over the category x-icon////
function displayCategoryDeleteBtn(){
    let paragraphEnclosingIcons = document.querySelectorAll('.new-category')
    let xIcons = document.querySelectorAll('.categories-xmark-icon')

    let paragraphEnclosingIconArr = Array.from(paragraphEnclosingIcons)
    let xIconsArr = Array.from(xIcons)

    paragraphEnclosingIconArr.map((category,i)=>{
        category.addEventListener("mouseenter", function(){
            xIconsArr[i].classList.add('visible')
        })
        category.addEventListener("mouseleave", function() {
            // Remove the class from the xMarkCategory when the mouse leaves the newCategory
            xIconsArr[i].classList.remove('visible')
        })
    }) 
}

///Deleting a category////
function deleteCategories(){
    const savedCategories = localStorage.getItem('MyCategoryList')
    categories = JSON.parse(savedCategories)

    const xIcons = document.querySelectorAll('.categories-xmark-icon');
    let iconArr = Array.from(xIcons)
    
    //Use the index of iconArr array to find the index of the categories array 
    iconArr.map((icon, i)=>{ 
        icon.addEventListener('click', function(){
          
            //Remove selected i from the categories array when x-mark icon clicked, update localStorage, and update the UI
            categories.splice(i, 1)
            localStorage.setItem('MyCategoryList', JSON.stringify(categories))
            
            displayCreatedCategories()
        })
    })
}



//////////////////////////// EDIT To-do ITEM //////////////////////////////
let typeOfTodo = '';
let editEntryCurrentID;

function editEntry(currentListID){
    
    editEntryCurrentID = currentListID //make the id global

    function reEnterEntryToForm(id, title, type, date, time, description, subTasks, category, color, location){
        /////Title/////
        document.getElementById('title-input').value = title

        /////Type/////
        if(type == 'Task'){
            document.getElementById('task-option').classList.add('clicked')
            typeOfTodo = 'Task'
        } else if (type == 'Event'){
            document.getElementById('event-option').classList.add('clicked')
            typeOfTodo = 'Event'
        }

        /////Date/////
        const todoDate = date
        const dateArr = todoDate.split('/')
        let newDateFormat = `${dateArr[2]}-${dateArr[0]}-${dateArr[1]}`
        document.getElementById('form-Due-date').value = newDateFormat

        /////Time/////
        if(!(time === 'NaN: PM' || time === 'NaN: AM')){
            //Adding an extra zero if less than 10
            let hour = parseInt(time.slice(0, 2) )
            let newHourFormat = hour < 10 ? `0${hour}` : `${hour}`;

            let minute = time.slice(3, 5)
            let period = time.slice(6, 8)
            
            //Changing the hour to military time 
            if(period == 'AM'){
                if(newHourFormat == 12){
                    newHourFormat = '00'
                } 
            
            } else if(period == 'PM') {
                 if (newHourFormat < 12){
                    newHourFormat = parseInt(newHourFormat)
                    newHourFormat += 12
                    newHourFormat = newHourFormat.toString()
                }
            }
            
            //console.log(newHourFormat, minute )
            let militaryTime = `${newHourFormat}:${minute}`
            document.querySelector('.time-container').value = militaryTime   
        } else{
            document.querySelector('.time-container').value = ''
        }

        /////Description////
        if(description){
            document.getElementById('input-dedscription').value = description
        }

        //////Subtasks/////
        //Open the input boxes and insert the values    
        const subtasksHTML = document.getElementById('subtasks') //empty <div>
        subTasks.forEach(()=>{
            displaySubtasks(subtasksHTML) //created html <div>

            const subtaskInputTag = Array.from(document.querySelectorAll('.input-subtask'))
            subtaskInputTag.forEach((inputTag,i)=>{
                inputTag.value = subTasks[i].name
                //console.log(subtasks[i].name)
            })
         })
            //Insert the flags
            let flagIconContainer = Array.from(document.querySelectorAll('.select-selected'))
            let flagIconArr = []
            subTasks.forEach((obj, i)=>{
                    
                //Changing flag icons
                flagIconContainer.forEach((container, j)=>{
                    container.innerHTML = subTasks[j].priority
                })

                //Push the div containing the icons to an new array
                flagIconArr.push(flagIconContainer[i])    
            })
            //Change color of icons
            flagIconArr.map((box, i)=>{
                box.querySelectorAll('i').forEach(iTag =>{
                    iTag.style.color = 'white';
                })
            })

        
        /////Category/////
        const categoriesOptionsContainer = Array.from(document.querySelectorAll('option'))
        const categoriesOption = document.getElementById('categories-option')

         //Insert all categories options inside an array
        let previouslyAddedCategories = categoriesOptionsContainer.map((innerDiv)=>{
            return innerDiv.value
        })
        
        //Check if category for selected todo list item is not present in the array
        if (!previouslyAddedCategories.includes(category)){
            let message = `The category "${category}" was previously deleted, you can add it back here.`
            categoryErrorMessage(message)
            
        } else{
            //Change selected category to the todo list item
            categoriesOption.value = category
        }
        

         /////Color/////
         const displayColorContainer = document.getElementById('current-color')
         displayColorContainer.style.backgroundColor = color;


         /////Location/////
         if(location){
            document.getElementById('addressInput').value = location
         }
         
    }

    formDataArr.filter((dataEntry, i) =>{
        if(dataEntry.id == currentListID){
            
            //console.log(dataEntry, i)
            reEnterEntryToForm(dataEntry.id, dataEntry.title, dataEntry.type, dataEntry.date, dataEntry.time, dataEntry.description, dataEntry.subtasks, dataEntry.category, dataEntry.color, dataEntry.location)
        }
    })
}




/////////////////////////////////// FULL VIEW OF TODO LIST ////////////////////////////////
const listDetailContainer = document.querySelector('.list-detail-container') //For Full View Container
function openFullViewContainer(){
    listDetailContainer.classList.add('display-list-detail-container')
    todoListDisplay.classList.add('screen-size-40') //not remove a window, just making it smaller

    //If form is open, we do the below code
    todoNewEntryForm.classList.remove('display')
    clearForm()
}
function closeFullViewContainer(){
    todoListDisplay.classList.remove('screen-size-40')//full screen
    listDetailContainer.classList.remove('display-list-detail-container')
}

////// Delete entry /////
let fullViewID;
function deleteEntry(currentListID){
      
        formDataArr.filter((dataEntry, i) =>{
            if(dataEntry.id == currentListID){
               
                //Delete form or fullView container only if it's the current ID being deleted
                
                if(currentListID == fullViewID){
                    closeForm()
                    closeFullViewContainer()
                } 
                //Remove id# assigned in editEntry function
                let editEntryCurrentID;

                //delete 
                
                formDataArr.splice(i, 1)
                localStorage.setItem('FormData', JSON.stringify(formDataArr))

                compareDates(currentDate)

                //Remove selected checkbox by id 
                dataEntry.subtasks.forEach((task, i)=>{
                        localStorage.removeItem(dataEntry.subtasks[i].id)
                })
                
                localStorage.removeItem(currentListID) 

                //Reset counter
                eventsTasksCounter() 
                
            } 
        }) 
   
}

/////View All Details of Todo Item//////
function viewFullDetailsOfTodoItem(title, date, time, type, description, subtasks, category, color, location, currentID){
    let timeDisplay = ''
    if(time === 'NaN: PM' || !time){
        timeDisplay  
    } else {
        timeDisplay = `| ${time}`
    }
    

    ///Add Subtask///
    let subtaskDisplay;
    if (subtasks.length > 0){
        let ilTag = ''
        subtasks.forEach((subtask)=>{
            ilTag += `<li class="todo-subtask">${subtask.name}<span class="todo-pritority">${subtask.priority}</span></li>`
        })
        subtaskDisplay  = `<ul class="ulSubtask">${ilTag}</ul>`
        
    } else{
        subtaskDisplay = `<p class="no-subtasks"></p>`
    }
    
    ///UI interface///
    fullListView.innerHTML = `<li id='todo-entry'>
                                <div>
                                <p id="type-of-List">${type}</p>
                                <p class="entry-date-category-color">${date} ${timeDisplay} | ${category} <span class="color-box" style="background-color:${color};"></span></p>
                                <h2 id="entry-title">${title}</h2>
                                <p id="entry-description">${description}</p>
                                <div class="subtask-container">
                                    <p id="entry-subtasks">Subtask</p>
                                    ${subtaskDisplay}
                                </div>

                                <p id="entry-location">Location<span class="location">${location}</span></p>
                                
                                </div>
                                <div class="delete-edit-btn-container">
                                    <button type="button" class="delete-btn">Delete</button>
                                    <button type="button" class="main-edit-btn">Edit</button>
                                </div>
                            </li>`

    openFullViewContainer() 

    //delete option
    let deleteBtn = fullListView.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', function(){
        deleteEntry(currentID)
    })

    //Edit option
    let mainEditBtn = fullListView.querySelector('.main-edit-btn')

    mainEditBtn.addEventListener('click', function(){
        openForm()
        editEntry(currentID)
    })
   
}
// <button type="button" class="edit-btn">Edit</button> (might add it back to the above function)


let fullListView = document.getElementById('full-list-view')
function getList(){
    //todoList = document.getElementById('todo-List') //list of item(s) displayed for selected date
    let list = document.querySelectorAll('.list-item')
    let listArr = Array.from(document.querySelectorAll('.list-item'))

    
    listArr.map((item, j)=>{
        item.addEventListener('click', function(event){

     
            if(!(event.target.classList.contains('main-checkbox') || event.target.classList.contains('secondary-checkbox') || event.target.classList.contains('item-delete-Btn') || event.target.classList.contains('edit-Btn'))){

                let currentListID = Number(list[j].id) //Turn ID to number
                let editEntryCurrentID; //Remove saved ID# if it's not being re-saved.
                
                fullListView.innerHTML= ""
                formDataArr.filter((dataEntry)=>{
                    if(dataEntry.id == currentListID ){
                        fullViewID = dataEntry.id
                        /////FULL VIEW OF TODO LIST/////
                        viewFullDetailsOfTodoItem(dataEntry.title,dataEntry.date, dataEntry.time, dataEntry.type, dataEntry.description, dataEntry.subtasks, dataEntry.category, dataEntry.color, dataEntry.location, currentListID) 
                                
                        }  
                    })
                        //resetEntry(currentListID) //The option to reset entry is now available
                }               
        })
    }) 
 
 }





////////////////////// PREVIEW of To-do List, based on Selected Date //////////////////////

///Tracking if checkboxes were clicked and saving it to localStorage for preview section///
function trackCheckboxStatus(){
    todoList = document.getElementById('todo-List') //updated UL element

    //Add an event listener to the checkboxes
    document.querySelectorAll('.container input').forEach(checkbox => {

        checkbox.addEventListener('change', function () {
            localStorage.setItem(this.id, this.checked);
            let mySound = new Audio('public/sound/clickSound.mp3')
            mySound.play()
        });

    // Retrieve the checked state from local storage on page load
    const isChecked = localStorage.getItem(checkbox.id) === 'true';
    checkbox.checked = isChecked;
    });
}

//Edit and Delete btns on hover for the preview section//
function displayButtonsOnHover(listItems){
    let listArr = Array.from(listItems)
    const deleteBtns = Array.from(document.querySelectorAll('.item-delete-Btn')) 
    const editBtns = Array.from(document.querySelectorAll('.edit-Btn'))
    
    listArr.map((listItem, i)=>{
        listItem.addEventListener('mouseenter', function(){
            deleteBtns[i].classList.add('visible')
            editBtns[i].classList.add('visible')
        })
        listItem.addEventListener('mouseleave', function(){
            deleteBtns[i].classList.remove('visible')
            editBtns[i].classList.remove('visible')
        })
    })

}


function displayPreviewOfTodoList(id, title, type, date, time, category, subtasks, color){
    let timeDisplay = ''
    if(time === 'NaN: PM' || !time){
        timeDisplay  
    } else {
        timeDisplay = `| ${time}`
    }

    //Add subtasks if required
    let subtasksPresent = subtasks.filter(subtask => subtask.name); //true or false
   
    let innerUl = ''
    let innerli = ''
    let subName = ''
    let subId = ''
    let subPriority = ''

   
    if(subtasksPresent.length === 0){
        innerUl =  `<ul class="innerUl hidden"></ul>`;
    } else{
        subtasks.forEach((subtask)=>{
            if (subtask.name !== ''){
                subName = subtask.name
                subPriority = subtask.priority
                subId = subtask.id
             
                innerli += `<li class="innerList">
                            <label class="container">
                            <input type="checkbox" id="${subId}" class="checkbox secondary-checkbox">
                            <span class="subtask-checkmark secondary-checkbox"></span>
                            </label>
                            <p class="subtask-name">${subName} <span class="priority-selected">${subPriority}</span> </p>
                          </li>`
            }
        });
        innerUl = `<ul class="innerUl">${innerli}</ul>`;
    }
   
    
    todoList.innerHTML += ` 
                        <li class="list-item" id="${id}">

                        <div class="row-list">
                            <div class="input-container">
                                <label class="container"><input type="checkbox" id="${id}" class="checkbox main-checkbox"><span class="checkmark main-checkbox"></span></label> ${title}
                            </div>
                            <div>
                                <button type="button" class="edit-Btn">Edit</button> <button type="button" class="item-delete-Btn">Delete</button> 
                            </div>
                        </div>

                        <p class="list-details">${date} ${timeDisplay} | ${type} | ${category}<span class="color-box" style="background-color:${color};"></span></p>
                        ${innerUl}  
                        </li>`
    
    //Add eventlistener to have access to full view of the todo list item
    getList()

    //Checkbox
    trackCheckboxStatus()

    //Delete option
    let list = todoList.querySelectorAll('li.list-item')
    let deleteBtns = Array.from(todoList.querySelectorAll('.item-delete-Btn'))
    deleteBtns.forEach((btn, i)=>{
        btn.addEventListener('click', function(){
            let currentListID = Number(list[i].id)
            deleteEntry(currentListID)
        })
    })

    //display btns when hover
    displayButtonsOnHover(list)


    //Edit option
    let editBtns = Array.from(todoList.querySelectorAll('.edit-Btn'))
    editBtns.forEach((btn, i)=>{
        btn.addEventListener('click', function(){
            
            //Open form
            openForm()

            //Form needs to be filled with current todo item
            let currentListID = Number(list[i].id)
            //console.log(formDataArr)
            //console.log(currentListID)
            editEntry(currentListID)
        })
    })
} 


//Only displaying tasks or events that match the current date///
let todoList = document.getElementById('todo-List')
function compareDates(dateToCompare){
  
    const options={
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }
   //Changed date format to ##/##/####
   let dateFormat = dateToCompare.toLocaleDateString('en-US', options) 
   
   todoList.innerHTML =""

   formDataArr.filter((dataEntry, i)=>{
    
        if(dataEntry.date == dateFormat){    
            displayPreviewOfTodoList(dataEntry.id, dataEntry.title, dataEntry.type, dataEntry.date, dataEntry.time,dataEntry.category, dataEntry.subtasks, dataEntry.color)
        } 
    })
}


/// Event & Task Counter ///
const taskCountContainer=document.querySelector('.taskCount')
const eventCountContainer=document.querySelector('.eventCount')

function setTaskEventToZero(tasknum, eventnum){
    taskCountContainer.innerHTML = tasknum
    eventCountContainer.innerHTML = eventnum
}
function eventsTasksCounter(){
    let taskCount = 0;
    let eventCount = 0;

    if(formDataArr == [] || formDataArr == null){
        setTaskEventToZero(taskCount, eventCount)
        return;
    } 


    //Both values should start at zero
    setTaskEventToZero(taskCount, eventCount)
    
    formDataArr.map((dataEntry)=>{
        if(dataEntry.type == "Task"){
            taskCount++
            taskCountContainer.innerHTML = taskCount

        } else if (dataEntry.type == "Event"){
            eventCount++
            eventCountContainer.innerHTML = eventCount
        }
    })
}


////Used when localStorage key is deleted manually////
function savingDataInArr(){
    const savedFormItems = localStorage.getItem('FormData')
    formDataArr = JSON.parse(savedFormItems)

    eventsTasksCounter()//To update counter
    
    if(!formDataArr){ //null is falsy
        formDataArr = []
    }
}



////////////////////////////////// NEW ENTRY FORM //////////////////////////////////
/*const listDetailContainer = document.querySelector('.list-detail-container') //For Full View Container */

const todoNewEntryForm = document.querySelector('.new-todo-item-container')
const todoListDisplay = document.querySelector('.middle-container')

function openForm(){
    todoListDisplay.classList.add('screen-size-40') //middle container change size
    todoNewEntryForm.classList.add('display')

    let editEntryCurrentID;  //Remove id# from edit container
    clearForm()

    //If list detail container is open
    listDetailContainer.classList.remove('display-list-detail-container')
}

/* Move it to fullview section
function reOpenFormForEdit(){ //I might need this for the edit button inside fullview container
    listDetailContainer.classList.remove('display-list-detail-container')
    todoListDisplay.classList.add('screen-size-40')
    todoNewEntryForm.classList.add('display')
} */

function closeForm(){
    todoListDisplay.classList.remove('screen-size-40')
    todoNewEntryForm.classList.remove('display')
    let editEntryCurrentID;  //Remove id# from edit container
    
    clearForm()
}


//// Validate Form ////
function titleErrorMessage(message){
    const titleErrorMessage = document.querySelector('.titleErrorMessage')
    titleErrorMessage.innerHTML = message
}
document.getElementById("title-input").addEventListener('input', function(){
    titleErrorMessage("")
})

function typeErrorMessage(message){
    const typeErrorMessage = document.querySelector('.typeErrorMessage')
    typeErrorMessage.innerHTML = message
}

function validateForm(title, typeOfTodo){

    const validations = [
        { condition: title.trim() === "" || title.trim() == "Add Title", message: "Please Enter a Title"},
        { condition: !typeOfTodo, message: "Select a Task or Event"},
        { condition: categories == '' ||  categories == [{}], message:"Create a category name to submit your entry"}
    ]
    
        if(validations[0].condition){
            titleErrorMessage(validations[0].message)
            return false;
        }
        if(validations[1].condition){
            typeErrorMessage(validations[1].message)
            return false;
        }
        if(validations[2].condition){
            categoryErrorMessage(validations[2].message)
            return false;
        }


       //Remove Error message when user corrects error
        titleErrorMessage("")
        typeErrorMessage("")
        categoryErrorMessage("")

        return true;
}



//// Reset/Clear form ////
function clearForm(){
    //clear title
    document.getElementById('title-input').value = ""
    document.getElementById('title-input').placeholder = "Add Title"
    titleErrorMessage("")
       

    //clear type
    const eventOption = document.getElementById('event-option')
    const taskOption = document.getElementById('task-option')
    typeErrorMessage("")
    eventOption.classList.remove('clicked')
    taskOption.classList.remove('clicked')
    typeOfTodo = ""; //Event or task
    categoryErrorMessage("") //clear error message on category input field


    //clear description
    document.getElementById('input-dedscription').value = ""
    document.getElementById('input-dedscription').placeholder = "Add Description"

    //Clear subtasks
    finalSubtasks = []; 
    const subtasks = document.getElementById('subtasks')
    while (subtasks.firstChild){ //remove input tags
        subtasks.removeChild(subtasks.firstChild)
    }

    //reset date
    formCurrentDate() //Date

    //reset time
    document.querySelector('.time-container').value = ''

    //Remove Map - Remove display block for the map once the user clicks the save btn
     mapID.style.display = 'none' 

    //Clear location
    document.getElementById('addressInput').value = ""
    document.getElementById('addressInput').placeholder = "Add Location"

}




///////////// INFORMATION NEEDED FOR TODO LIST FORM SUBMISSION ////////////////
function getTitle(){
        const titleInput = document.getElementById("title-input")
        const titleValue = titleInput.value.trim()  
        return titleValue
}




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
            typeErrorMessage("")

            //Obtain the value
            const value = target.textContent.trim()
            typeOfTodo = value
            
        } else if (target.id === 'task-option'){

            //Change color of the button
            taskOption.classList.add('clicked')
            eventOption.classList.remove('clicked')
            typeErrorMessage("")

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
    let dateNum = today.getDate() 
    let date = dateNum < 10 ? `0${dateNum}` : `${dateNum}`
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

    //Format the date as mm/dd/yyyy
    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate
}


function getTime(){
    const timeEntered = document.querySelector('.time-container').value
   
    let hour = parseInt(timeEntered.slice(0, 2), 10);
    let minute = timeEntered.slice(3);

    let period = (hour < 12) ? 'AM' : 'PM';

    if (hour === 0) {
        hour = 12;
    } else if (hour > 12) {
        hour -= 12; 
        hour = hour < 10 ? `0${hour}`: `${hour}` 
    } else {
        hour = hour < 10 ? `0${hour}`: `${hour}` 
    }

    let setTime = `${hour}:${minute} ${period}`;
    return setTime
}


//Obtain the value entered in the textarea element
function textareaValue(){
    const textareaId = document.getElementById('input-dedscription')
    const description = textareaId.value.trim()
    return description
}


//Subtasks section
function subtaskInputValue(){
    const subTaskInputArr = Array.from(document.querySelectorAll('.input-subtask'))
    const mainbtnArr = Array.from(document.querySelectorAll('.select-selected')) //array
    let finalSubtasks = [];
   
    subTaskInputArr.forEach((input, i)=>{
        if(subTaskInputArr[i].value !== ''){

            //Change color to black for flag icons
            mainbtnArr[i].querySelectorAll('i').forEach(iTag =>{
                iTag.style.color = 'rgb(102,102,102)';
                iTag.style.fontSize ='12px';
            })

            let template = mainbtnArr[i].innerHTML

            // Generate unique random number:
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * 500) + 1;
            } while (finalSubtasks.some(subtask => subtask.id === randomNumber)); // Check for duplicates

            //Object for subtask
            let inputObject = {
                id: randomNumber,
                name: subTaskInputArr[i].value,
                priority: `${template}`
            }
            finalSubtasks.push(inputObject)

        }
        
    }) 
  
    return finalSubtasks 
}

//Delete input field of subtasks //
function deleteInputField(subtasks){
    function removeSubtaskFromForm(selectedSubtask){
        if (subtasks.contains(selectedSubtask)) {
            subtasks.removeChild(selectedSubtask);
           // obtainPriorityPicked(subtasks) 
        }
    }
    
    //Remove input box
    subtasks.addEventListener('click', (event)=>{
        const target = event.target;
        if(target.classList.contains('remove-subtask-btn')){
            removeSubtaskFromForm(target.parentElement)
        }
    })  
}

function addSubtaskInputField(){
    const addSubtask = document.querySelector('.subtask-label') //from html
    const subtasks = document.getElementById('subtasks')
   
    //Add input box
    addSubtask.addEventListener('click', ()=>{       
        displaySubtasks(subtasks)
    })
}
addSubtaskInputField()



function displayPriorityOptions(subtasks){
    const flagIconBtn = Array.from(subtasks.querySelectorAll('.select-selected'))
    const dropdowns = Array.from(subtasks.querySelectorAll('.select-items'))

    flagIconBtn.forEach((btn, i )=>{
        btn.addEventListener('click', function(event){
            event.stopPropagation();
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'))
            dropdowns[i].classList.add('active')
        })

        document.addEventListener('click', function(event){
            if(!flagIconBtn.some(element => element.contains(event.target))){
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'))
            }
        });
    })
    

}
//let flagIconsArr = []

function updateMainFlagIconBtn(){
   // Get all flag icons
   const flagIcons = document.querySelectorAll('.priority');

   // Add event listener to each flag icon
   flagIcons.forEach(flagIcon => {
       flagIcon.addEventListener('click', () => {
           // Get the selected flag icon's HTML content
           const selectedIcon = flagIcon.innerHTML;
           
           // Find the flag icon/button within the same input container
           const flagIconButton = flagIcon.closest('.input-container').querySelector('.select-selected');
    
          //Change color of the selected flag icon/s
           flagIconButton.querySelectorAll('i').forEach(iTag =>{
            iTag.style.color = 'white';
           })

           // Replace the inner HTML of the flag icon/button with the selected icon's content
           flagIconButton.innerHTML = selectedIcon;   
       });
   });

}

function displaySubtasks(subtasks){
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML =  
    `<div class="input-container">
        <i class="fa-solid fa-circle-minus remove-subtask-btn"></i>
        <input type="text" class="input-subtask" name="subtask-value">
               
        <div class="priority-container custom-select">
            <div class="select-selected">
                <i class="fa-regular fa-font-awesome flag-icon"></i>
            </div>
            <div class="select-items">
                <div title="Low Priority" class="high-prioriy priority">
                    <i class="fa-regular fa-font-awesome flag-priority"></i>
                </div>
                <div title="Medium Priority" class="high-prioriy priority">
                    <i class="fa-regular fa-font-awesome flag-priority"></i> 
                    <i class="fa-regular fa-font-awesome flag-priority"></i>
                </div>
                <div title="High Priority" class="high-prioriy priority">
                    <i class="fa-regular fa-font-awesome flag-priority"></i>
                    <i class="fa-regular fa-font-awesome flag-priority"></i>
                    <i class="fa-regular fa-font-awesome flag-priority"></i>
                </div>
            </div>
        </div>

    </div>`
        
    subtasks.appendChild(tempDiv.firstChild); //I had to create a 'div' becuase it doesn't accept a string, it needs DOM node as an argument
    displayPriorityOptions(subtasks)  //Display drowpn of priority list on click
    deleteInputField(subtasks)
    updateMainFlagIconBtn(subtasks)
    //obtainPriorityPicked(subtasks) 
}



/////////////Display category options///////////
function displayCategoryOptions(catArr){
    const categoryOption = document.getElementById('categories-option')
    categoryOption.innerHTML = ""
    
    catArr.map((category)=>{
        categoryOption.innerHTML += `<option class="category-option" value=${category}>${category}</option>`
    }) 

}

function deleteCategoryPickerContainer(catg){
    const categoryContainer = document.querySelector('.select-category-container')
    if(catg == '' || catg == [{}]){  //if
       categoryContainer.classList.add('hideCategoryBox')
    } else{
        categoryContainer.classList.remove('hideCategoryBox')
    }
}

//Category value that user selects from drop-down list
const categoriesOption = document.getElementById('categories-option')
categoriesOption.addEventListener('change', categorySelected)
function categorySelected(){
   const selectedOption = categoriesOption.options[categoriesOption.selectedIndex];
 
   if(!selectedOption){
       categoryErrorMessage("Create a category name to submit your entry")
        return;
   }
   const categoryName = selectedOption.textContent;
    return categoryName
}


////Obtain the color picker value
let colorPicked = '#BA3246'

function colorPicker(){
   // const colorPickerMainBox = document.querySelector('color-picker-container')
    const colorPickerBtn = document.getElementById('color-picker-btn');
    const colorPickerContainer = document.getElementById('color-picker-popup-box')
    const displayColorContainer = document.getElementById('current-color')


    const colorOptions = ['#BA3246', '#DD8997', '#86BCC0','#71358A', '#F6C15C', '#606C38', '#4340BB', '#74D154', '#99582A', '#DD885E' ]

    function colorSelected(colorOption){
      colorOption.addEventListener('click', function(e){
        colorPickerContainer.querySelectorAll('.color-option').forEach(option =>{
            option.classList.remove('color-checkmark')
        })

       colorOption.classList.add('color-checkmark')
       
       //Change UI color to the one selected
        let target = e.target
        colorPicked = target.id
        displayColorContainer.style.backgroundColor = colorPicked;
        colorPickerContainer.style.display = 'none'
      })
    }

    function createColorOptions(color){

        const colorOption = document.createElement('p')
        colorOption.className = "color-option";
        colorOption.id = color;
        colorOption.style.backgroundColor = color;
        colorPickerContainer.style.display = 'none';

        colorPickerContainer.appendChild(colorOption);
        colorSelected(colorOption)
    }

    colorOptions.forEach(createColorOptions);
    colorPickerBtn.addEventListener('click', ()=>{
        colorPickerContainer.style.display = 'flex'       
    })

    //Remove color picker div
    document.addEventListener('click', function(event){
        if(!colorPickerBtn.contains(event.target)){
            colorPickerContainer.style.display = 'none'
        }
    })
}
colorPicker()



///// FINDING LOCATION /////
function clientAddress(){
    const addressInput = document.getElementById('addressInput')
    const address = addressInput.value.trim()

    return address
}

/*
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



////////////////// FORM SUBMISSION FOR NEW EVENT OR TASK ////////////////
const mapID = document.getElementById('map')
let formDataArr = [];

function submitForm(ev){
    ev.preventDefault(); //to stop the form from submitting



    //Title 
    let title = getTitle()    
    //Due Date
    const date = getSelectedDate()
    //Time
    const time = getTime()
    //Description
    const description = textareaValue()
    //Subtask
    const subtasks = subtaskInputValue()
   
    //Category
    const category = categorySelected()
    //Color
    const color = colorPicked;
    //Location
    const location = clientAddress()

    

    
    if(validateForm(title, typeOfTodo, subtasks)){
        title = capitalizeFirstLetter(title)


        const formData = {
        id: Date.now(),
        title: title,
        type: typeOfTodo,
        date: date,
        time: time,
        description: description,
        subtasks: subtasks,
        category: category,
        color: color,
        location: location,
        }


        //Insert object to array
        if(editEntryCurrentID) {
            const index = formDataArr.findIndex(dataEntry => dataEntry.id === editEntryCurrentID);
            if (index !== -1) {
              formDataArr.splice(index, 1, formData); // Replace object at the found index
              let editEntryCurrentID;
            } else{
                formDataArr.push(formData) //New entry
            }
          } else{
            formDataArr.push(formData) //New entry
          }
          
        //Reset Values//
        clearForm() 

        //Saving object to localStorage
        localStorage.setItem('FormData', JSON.stringify(formDataArr))
 
        //Call the function that will display the categories
        compareDates(currentDate)
        closeForm()
        eventsTasksCounter()
    } 
    
    
}



        
   
    
   
         


