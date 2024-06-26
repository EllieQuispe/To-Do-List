
document.addEventListener('DOMContentLoaded', () =>{
    
    //New category submission
    document.querySelector('.fa-circle-plus').addEventListener('click', addNewCategory)    
    //Call the function to display categories when the page loads
    displayCreatedCategories();
    //Delete categories
    displayCategoryDeleteBtn()



     //Open form 
     document.querySelector('.add-new-item').addEventListener('click', openForm )
     //Close to-do list form
     document.querySelector('.exit-form').addEventListener('click', closeForm)

    //Form submission when adding a new event or task
    document.getElementById('todo-form').setAttribute('novalidate', 'true')
    document.getElementById('todo-form').addEventListener('submit', submitForm)
    //Clear form
    document.querySelector('.clear-btn').addEventListener('click', clearForm)



    //Initializing formDataArr as an "empty array" if nothing saved to localStorage
    initializeFormDataArray()

    //Close fullview container
    document.querySelector('.exit-full-view').addEventListener('click', closeFullViewContainer)

    //Date feature initilization
    initializeDateHeader();

    //User Profile settings button
    document.querySelector('.settings-container').addEventListener('click', function(event){
        UserProfileMenuBtn(event)
    })

    //Today button
    document.querySelector('.today-btn').addEventListener('click', todayBtn)

    //Upcoming button
    document.querySelector('.upcoming-btn').addEventListener('click', openUpcomingContainer)

    //Past Due button
    document.querySelector('.pastDue-btn').addEventListener('click', openPastDueContainer)

    //Opens dropdown for view options
    document.querySelector('.view-options-container').addEventListener('click',function(event){
        viewOptions(event) //opens drop-down
    } ) 
    

})


let listViewOption = true; /*It starts as a list view */
let boardViewOption = false;

let currentDate = new Date()  //Gives me the current date (Used for boardViewDates function, todayBtn function)
let datesForBoardView;        //date+week array (used in the todayBtn function - makes the array a global variable)


////////// Open/Close form to add To-do item or edit ///////////
const todoNewEntryForm = document.querySelector('.new-todo-item-container') //Form outer container
/*const todoListDisplay = document.querySelector('.middle-container')*/         //Where the to-do items will display


function openForm(){
    let midContainer = document.querySelector('.view-container')    //Contains the board and list view option divs
    todoNewEntryForm.classList.add('display')                       //Form opens
   /*todoListDisplay.classList.add('screen-size-40')*/                 //Display width changes (gets narrower to make room for the form)
    editEntryCurrentID = '';                                        //Remove id# from edit container (when edits take place)
   
    clearForm()                                                     //Remove any entries from form

    //If list detail container is open
        listDetailContainer.classList.remove('display-list-detail-container') //Remove Detailed view of To-do items (not sure how this is working if it wasn't declare first)
        // midContainer.classList.add('formOpen') //Change padding for boardview (I need to fix it)

    //If I open the form, I should fix the middle container
}

function closeForm(){
    let midContainer = document.querySelector('.view-container')    //Contains the board and list view option divs
    todoNewEntryForm.classList.remove('display')                    //Close form
    /*todoListDisplay.classList.remove('screen-size-40')*/           //Display width changes (gets wider)
    editEntryCurrentID = '';                                        //Remove id# from edit container (when edits take place)
    
    clearForm()                                                     //Remove any entries from fom
     
    //midContainer.classList.remove('formOpen') //Change padding for boardview (I need to fix it)
}





////////// Dropdown User Profile settings ////////
function UserProfileMenuBtn(event){
    const container = document.querySelector('.settings-container');
    const downArrow = container.querySelector('.drop-down-menu-icon')//arrow icons
    const upArrow = container.querySelector('.up-arrow-icon')//arrow icon
    const dropDownContainer = document.querySelector('.drop-down-container')

    function openSettings(downArrow, upArrow){
        dropDownContainer.classList.add('display')//displaying the dropdown container
        downArrow.classList.remove('active')
        upArrow.classList.add('active')
    }
    function closeSettings(upArrow, downArrow){
        dropDownContainer.classList.remove('display')
        downArrow.classList.add('active') 
        upArrow.classList.remove('active')   
    }


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
}



///////// Event & Task Counter //////////
const taskCountContainer=document.querySelector('.taskCount')
const eventCountContainer=document.querySelector('.eventCount')

//Set values to zero
function setTaskEventToZero(tasknum, eventnum){
    taskCountContainer.innerHTML = tasknum //zero
    eventCountContainer.innerHTML = eventnum //zero
}

//It is called when initializing the app and during updates
function eventsTasksCounter(){
    let taskCount = 0;
    let eventCount = 0;

    //If there are no todo items, set both to zero
    if(formDataArr == [] || formDataArr == null){
        setTaskEventToZero(taskCount, eventCount) 
        return;
    } 

    //Both values should start at zero
    setTaskEventToZero(taskCount, eventCount)
    
        //Updating the count based on what's in the formDataArr
        formDataArr.map((dataEntry)=>{
            if(dataEntry.type == "Task"){
                taskCount++ //0 + 1 = 1...
                taskCountContainer.innerHTML = taskCount

            } else if (dataEntry.type == "Event"){
                eventCount++ //0 + 1 = 1...
                eventCountContainer.innerHTML = eventCount
            }
        })
}



///// Tracking if checkboxes were clicked /////
function trackCheckboxStatus(){
    if(listViewOption){ 
        //todoList = document.querySelector('.todo-List')
        //List view option
        document.querySelectorAll('.container input').forEach(checkbox => {
          
            checkbox.addEventListener('change', function (){
                localStorage.setItem(this.id, this.checked);
                let mySound = new Audio('public/sound/clickSound.mp3')

                mySound.play()
                upComingTodoItems() //Update
                pastDueTodoItems()  //Upddate
            });

            //If nothing clicked, retrieve the checked state from local storage on page load
            const isChecked = localStorage.getItem(checkbox.id) === 'true';
            checkbox.checked = isChecked;
        });

    } else{
        //Broad view option
        dateContainer = document.querySelector('.date-container')

        dateContainer.querySelectorAll('.container input').forEach(checkbox =>{
            checkbox.addEventListener('change', function(){
                localStorage.setItem(this.id, this.checked);
                let mySound = new Audio('public/sound/clickSound.mp3')

                mySound.play()
                upComingTodoItems() //Update
                pastDueTodoItems()  //Update
            })

            // Retrieve the checked state from local storage on page load
            const isChecked = localStorage.getItem(checkbox.id) === 'true';
            checkbox.checked = isChecked;

        })
    }
 }






//////////// Board-View: Generates Three Dates //////////
function boardViewDates(){
    //Display the dates;
    todoList.innerHTML = "" //This is the list view option
  

    //Get three dates
    let ThreeDatesHeading = []; //This array starts blank

    function getOrdinalSuffix (number){
        const ones = number % 10;
        const tens = Math.floor(number / 10) % 10;
        
        if (tens !== 1) {
            switch (ones) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
            }
        } else{
            // Special case for numbers between 11 and 13
            return 'th';
        }
    }

    // Function to format the date with weekday, month, and ordinal indicator (st, nd, rd, th)
    function formatDateWithDetails(date) {
        const day = date.getDate();
        const ordinal = getOrdinalSuffix(day)
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }); // Get full weekday name (e.g., Monday)
        //const month = date.toLocaleDateString('en-US', { month: 'long' }); // Get full month name (e.g., March)
        return `${weekday}, ${day}${ordinal}`;
    }


    //Start HERE!!!
    const date = currentDate; //It is referencing the date outside this function, but not always
    const tomorrow = new Date(date.getTime() + (1000 * 60 * 60 * 24)); // Add one day
    const dateAfterTomorrow = new Date(tomorrow.getTime() + (1000 * 60 * 60 * 24)); // Add another day

    // Format the next two dates with weekday, month, and ordinal indicators
    const formattedDate1 = formatDateWithDetails(date);
    const formattedDate2 = formatDateWithDetails(tomorrow);
    const formattedDate3 = formatDateWithDetails(dateAfterTomorrow);
    
    ThreeDatesHeading.push(formattedDate1,formattedDate2,formattedDate3)
    
    return ThreeDatesHeading
}



/////////// TODAY BUTTON ////////////
function todayBtn(){

    if(listViewOption){

        let currentDateForTodayButton = new Date() //Brings user back to the current date

        const options = { //Format of date
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        };

        compareDates(currentDateForTodayButton)//compare localStorage object dates with current date and display it
        currentDate = currentDateForTodayButton; //update currenDate back to the actual current date if user clicked previousDate() or nextDate()

        //Display full day to the UI
        document.getElementById('currentDate').textContent = currentDateForTodayButton.toLocaleDateString('en-US',options)
        //Display week day to UI
        document.getElementById('day-of-the-week').textContent = currentDateForTodayButton.toLocaleDateString('en-US', {weekday: "long"})

    } else{

        //For board view option
        let currentDateForTodayButton = new Date()

        const options = { //Format of date
                year: 'numeric',
                month: 'long',
        };

        currentDate = currentDateForTodayButton; //update currentDate

        //Display current Month and Year
        document.getElementById('currentDate').innerHTML = `<div class="board-view-date">
                                                                    <p class="heading-month">${currentDate.toLocaleDateString('en-US',{month: "long"})}</p>
                                                                    <p class="heading-year">${currentDate.toLocaleDateString('en-US',{year: "numeric"})}</p>
                                                            </div>`
        datesForBoardView = boardViewDates()//Call function and store value in global variable 
        compareDates(currentDateForTodayButton)//back to current date 
    }      
}






/////////////// VIEW OPTIONS (List or board) ///////////////
///Open drop-down of View button
function viewOptions(event){
    const viewBtn = document.querySelector('.view-options-innerDiv')
    const viewDropdownContainer = document.querySelector('.view-dropdown')

    if(event.target.classList.contains('partag-view') || event.target.classList.contains('view-option-image')){
        viewDropdownContainer.classList.add('active')
    } 

    viewDropdownContainer.addEventListener('mouseleave', function(event){
      
            viewDropdownContainer.classList.remove('active')        
    })
}

////// Change Value of CurrentView and listViewOption /////
let currentView = 'list'
function changeView(newView){

    if(newView !== 'list'){
        currentView = newView; //currentView is now board
        listViewOption = newView === 'list'; //listViewOption is false
    }else{
        listViewOption = newView === 'list' //listViewOption is true
    }
    initializeDateHeader() 
}

///List and Board colors when clicked///
function viewOptionsBtn(){
    const boardBtn = document.querySelector('.board-btn')
    const listBtn = document.querySelector('.list-btn')
    const listView = document.querySelector('.todo-List')
    const dateContainer = document.querySelector('.date-container')
    const midContainer = document.querySelector('.view-container')
    
    

    //Change background color on click
    if(currentView == 'board'){
        
        //all these things are actually for board
        listBtn.classList.remove('active')
        boardBtn.classList.add('active') //background color orange 

        //Add or remove boardview or listview
        listView.classList.add('active') //remove listview
        dateContainer.classList.add('active') //add boardview
        midContainer.classList.add('boardView')

    } else{
        listBtn.classList.add('active')
        boardBtn.classList.remove('active')

         //Add or remove boardview or listview
        listView.classList.remove('active') //add back listview
        dateContainer.classList.remove('active')//remove boardview
        midContainer.classList.remove('boardView')
    }

}
//EventListeners for List and Board view buttons//
document.querySelector('.list-btn').addEventListener('click', () => {
    currentView = 'list'
    viewOptionsBtn() //change color
    changeView('list')
});

document.querySelector('.board-btn').addEventListener('click', () => {
    currentView = 'board'
    viewOptionsBtn() //change color
    changeView('board')
});



////Arrow buttons to change dates (List and Board View)////
function previousDate(){
    if(listViewOption){
        currentDate.setDate(currentDate.getDate() - 1) //changes currenDate to past date
        initializeDateHeader()
    } else{
        currentDate.setDate(currentDate.getDate() - 3)
        initializeDateHeader()
    }
}
function nextDate(){
    if(listViewOption){
        currentDate.setDate(currentDate.getDate() + 1) //changes currenDate to future date
        initializeDateHeader()
    } else{
        currentDate.setDate(currentDate.getDate() + 3)
        initializeDateHeader()
    } 
}
//Listenting for a click on the arrow buttons
document.getElementById('previousBtn').addEventListener('click', previousDate)
document.getElementById('nextBtn').addEventListener('click', nextDate)




///////////////////CURRENT DATE/////////////////////////
function initializeDateHeader(){

        //Display main date in list view
        function displayListViewDate(){
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            };

            //Display full day to the UI (currentDate is a global variable)
            document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('en-US',options) 
            //Display week day to UI
            document.getElementById('day-of-the-week').textContent = currentDate.toLocaleDateString('en-US', {weekday: "long"})
           
            compareDates(currentDate)//compare localStorage object dates with current date to display listview  
        }

        //Display main date in board view 
        function boardViewDateDisplay(){
            const options = {
                year: 'numeric',
                month: 'long',
            };
        
            //Display month and date 
            document.getElementById('currentDate').innerHTML = `<div class="board-view-date">
                                                                    <p class="heading-month">${currentDate.toLocaleDateString('en-US',{month: "long"})}</p>
                                                                    <p class="heading-year">${currentDate.toLocaleDateString('en-US',{year: "numeric"})}</p>
                                                                </div>`
        } 

        //Start Here!
        if(listViewOption){
            displayListViewDate()
           
        } else{
            //Display board view date
            document.getElementById('currentDate').textContent = ''
            document.getElementById('day-of-the-week').textContent= '' 

            //Update main Date heading
            boardViewDateDisplay()

            //Array with three dates based on the variable currenDate
            //currentDate could be today's date or another date if the arrow icon was clicked
            datesForBoardView = boardViewDates() 
            
            //Display boardview dates
            compareDates(currentDate) //Display Board
        }
}



///////////////////////////////////////////// CATEGORY SECTION /////////////////////////////////////////
//Hovering over the category x-icon (Animation)
function displayCategoryDeleteBtn(){
    let paragraphEnclosingIcons = document.querySelectorAll('.new-category') //Created in here
    let xIcons = document.querySelectorAll('.categories-xmark-icon')

    let paragraphEnclosingIconArr = Array.from(paragraphEnclosingIcons)
    let xIconsArr = Array.from(xIcons)

    //Animation when user hovers over categories
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

//Display category options for New Entry Form (this works)
function displayCategoryOptions(catArr){ //catArr is a list of category names
    const categoryOption = document.getElementById('categories-option')
    categoryOption.innerHTML = ""

    
    catArr.map((category)=>{
        categoryOption.innerHTML += `<option class="category-option" value="${category}">${category}</option>`
    }) 
}

//The category picker gets removed if no categories were created
function deleteCategoryPickerContainer(catg){
    const categoryContainer = document.querySelector('.select-category-container')
    if(catg == '' || catg == [{}]){ 
       categoryContainer.classList.add('hideCategoryBox')
    } else{
        categoryContainer.classList.remove('hideCategoryBox')
    }
}

////////////////Deleting a category///////////////
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
///////////////// Display category in sidebar ///////////////
function displayCreatedCategories(){
     const savedCategories = localStorage.getItem('MyCategoryList') //Array of objects

     document.querySelector('.category-list-container').innerHTML = ""  
     let categoryNamesArr = [];
    
   if(!savedCategories || savedCategories === '[]'){  //true false('[]') - checks if it's empty
        categories = JSON.parse(savedCategories) 

       
       if(!categories){ //[] equals true
            categories = [] //original array that hold the object of categories

            console.log('I am here')
         }

   } else{ //false false
         categories = JSON.parse(savedCategories) //An array of objects

         categories.map((category)=>{
            document.querySelector('.category-list-container').innerHTML +=  `<p class="top-margin-menu new-category">${category.name}<i class="fa-solid fa-xmark categories-xmark-icon"></i></p>`
            categoryNamesArr.push(category.name) //push names here to go to forms
         })           
           
        //Option to delete created category is now available
        deleteCategories()
   }

   
   displayCategoryOptions(categoryNamesArr) //synching the category names with the category options available in the new entry form (this one)
   deleteCategoryPickerContainer(categories) //Remove the categories option when no category created
   displayCategoryDeleteBtn() //Display X icon
}




////////////// ADDING A CATEGORY /////////////////
// Displaying Error Message 
function categoryErrorMessage(message){
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerHTML = message; 
}
//Remove error message when user starts typing
document.getElementById('input-category').addEventListener('input', function(){
    categoryErrorMessage("")
})

//Validate entry
function validateInput(name){
    //Check if the input is blank
    if (name === "" || name === "Add a Category"){
        categoryErrorMessage("Enter a category name")
        return false;
    } 
        categoryErrorMessage("")//No error message
        return true;
}

///Capitalize the first letter of a string
function capitalizeFirstLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
        //charAt(0) = Extracts the character at index 0 of the string str
        //.toUpperCase() = Converts the extracted character to uppercase
        //str.slice(1) = Retrieves the entire word starting from index 1
        // +  = Acts as a string concatenation operator to put it all back together
}

/////////// Starting Point //////////
let categories = []; //List of category objects
function addNewCategory() {
    
    let inputCategory = document.getElementById('input-category')
    let categoryName = inputCategory.value.trim(); //obtain the value in the input tag

    if(validateInput(categoryName)){ //true or false (this works)
        categoryName = capitalizeFirstLetter(categoryName);//Make the first letter capital

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



/////////////////////////////////////// EDIT To-do ITEMS ///////////////////////////////////
let typeOfTodo = '';
let editEntryCurrentID;

function editEntry(itemID){
    
    editEntryCurrentID = itemID //EditEntryCurrentID is global - currentListID comes from edit button


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
            let hour = parseInt(time.slice(0, 2))
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
            
            
            let militaryTime = `${newHourFormat}:${minute}`
            document.querySelector('.time-container').value = militaryTime 

        } else{
            document.querySelector('.time-container').value = ''
        }


        /////Description////
        if(description){
            document.getElementById('input-description').value = description
        }


        //////Subtasks/////
        //Open the input boxes and insert the values    
        const subtasksHTML = document.getElementById('subtasks') //empty <div>
        subTasks.forEach(()=>{
            displaySubtasks(subtasksHTML) //created html <div>

            const subtaskInputTag = Array.from(document.querySelectorAll('.input-subtask'))
            subtaskInputTag.forEach((inputTag,i)=>{
                inputTag.value = subTasks[i].name
                
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

        
        /////Category /////
        const categoriesOptionsContainer = Array.from(document.querySelectorAll('option'))
        const categoriesOption = document.getElementById('categories-option')


         //Insert all categories options inside an array
        let previouslyAddedCategories = categoriesOptionsContainer.map((innerDiv)=>{
            //console.log(innerDiv.innerHTML)
            return innerDiv.innerHTML
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

    formDataArr.filter((dataEntry) =>{
        if(dataEntry.id == itemID){
            reEnterEntryToForm(dataEntry.id, dataEntry.title, dataEntry.type, dataEntry.date, dataEntry.time, dataEntry.description, dataEntry.subtasks, dataEntry.category, dataEntry.color, dataEntry.location)
        }
    })
}


/////////////////////////////////// FULL VIEW OF TODO LIST ////////////////////////////////
const listDetailContainer = document.querySelector('.list-detail-container') //For Full View Container
function openFullViewContainer(){
    listDetailContainer.classList.add('display-list-detail-container')
   /* todoListDisplay.classList.add('screen-size-40') //not remove a window, just making it smaller */

    //If form is open, we do the below code
    todoNewEntryForm.classList.remove('display')
    clearForm()
}
function closeFullViewContainer(){
   /* todoListDisplay.classList.remove('screen-size-40')//full screen */
    listDetailContainer.classList.remove('display-list-detail-container')
}


////// Delete entry 
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
                editEntryCurrentID = '';

                //delete 
                formDataArr.splice(i, 1)
                localStorage.setItem('FormData', JSON.stringify(formDataArr))

                //Update the UI
                compareDates(currentDate)

                //Remove selected checkbox by id 
                dataEntry.subtasks.forEach((task, i)=>{
                        localStorage.removeItem(dataEntry.subtasks[i].id)
                })
                
                localStorage.removeItem(currentListID) 

                //Reset counter
                eventsTasksCounter() 

                //Update upcoming items
                upComingTodoItems()
             
            } 
        }) 
   
}

//////// View All Details of Todo Item ////////
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


//// View details of todo items
let fullListView = document.getElementById('full-list-view')
function getList(){

    //List-view: Opening full view of todo-items
    let list = document.querySelectorAll('.list-item')
    let listArr = Array.from(document.querySelectorAll('.list-item'))

    
    listArr.map((item, j)=>{
        item.addEventListener('click', function(event){

     
            if(!(event.target.classList.contains('main-checkbox') || event.target.classList.contains('secondary-checkbox') || event.target.classList.contains('item-delete-Btn') || event.target.classList.contains('edit-Btn'))){
                
                
                let currentListID = Number(list[j].id) //Turn ID to number
                editEntryCurrentID = ''; //Remove saved ID# if it's not being re-saved.
                
                fullListView.innerHTML= ""
                formDataArr.filter((dataEntry)=>{
                    if(dataEntry.id == currentListID ){
                        fullViewID = dataEntry.id //Used when deleting the todo-item

                        /////FULL VIEW OF TODO LIST/////
                        viewFullDetailsOfTodoItem(dataEntry.title,dataEntry.date, dataEntry.time, dataEntry.type, dataEntry.description, dataEntry.subtasks, dataEntry.category, dataEntry.color, dataEntry.location, dataEntry.id) 
                                
                        }  
                    })
                }               
            })
    })

    //Board-View: Opening full view of todo-items
    let boardTodoItems = document.querySelectorAll('li.list-item-board')
    let boardListArr = Array.from(document.querySelectorAll('li.list-item-board'))

    boardListArr.map((item, i)=>{
        item.addEventListener('click', function(event){

          
            if(!(event.target.classList.contains('main-checkbox') || event.target.classList.contains('secondary-checkbox') || event.target.classList.contains('item-delete-Btn') || event.target.classList.contains('edit-Btn') || event.target.classList.contains('fa-ellipsis-vertical'))){

                //responsive layout
                let dt = document.querySelector('.date-container')
                dt.classList.add('sidebar-form-active')


                let currentListID = Number(boardTodoItems[i].id) //Turn ID to number
                editEntryCurrentID = ''; //Remove saved ID# if it's not being re-saved.

                fullListView.innerHTML= ""
                formDataArr.filter((dataEntry)=>{
                    if(dataEntry.id == currentListID ){
                        fullViewID = dataEntry.id //Used when deleting the todo-item

                        /////FULL VIEW OF TODO LIST/////
                        viewFullDetailsOfTodoItem(dataEntry.title,dataEntry.date, dataEntry.time, dataEntry.type, dataEntry.description, dataEntry.subtasks, dataEntry.category, dataEntry.color, dataEntry.location, dataEntry.id) 
                                
                        }  
                    })
            }
        })
    })
 }



////////////////////////// UPCOMING ///////////////////////
const upcomingContainer = document.querySelector('.upcoming-container')
const upcomingXmark = document.querySelector('.exit-upcoming-container')
const upcomingUlTag = document.getElementById('upcoming-items')

//Remove upcoming popup box
function removeUpcomingContainer(){
    upcomingContainer.classList.remove('active')
    editEntryCurrentID = '';
}
upcomingXmark.addEventListener('click', function(){
    removeUpcomingContainer()
})


//Display Upcoming Items
function upComingTodoItems(){
  
    //Obtaining the current date
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for month
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for day
      
        return `${month}/${day}/${year}`;
    }
    //Today's date
    let date = new Date();
    let upcomingCurrentDate = formatDate(date)

    //Tomorrow's date
    const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
    let upcomingTomorrow = formatDate(tomorrow)

    //Day after tomorrow
    let nextDay = formatDate(new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000));

    //Array used to display to-do items and html tag
    let dataEntryArr = []; 
    upcomingUlTag.innerHTML = ""

    //Push only the necessary objects into the dataEntryArr
    formDataArr.filter((dataEntry) =>{
        if(dataEntry.date == upcomingCurrentDate || dataEntry.date == upcomingTomorrow || dataEntry.date == nextDay){
           dataEntryArr.push(dataEntry) //push only present and future dates to array
        }
    })

    // Before sorting, ensure consistent time representation:
    dataEntryArr.forEach(entry => {
        if (entry.time === "NaN: PM" || !entry.time || entry.time.trim() === "") {
            entry.time = ""; // Replace NaN:PM with an empty string (or your desired value)
        } 
    });

    //Sort dataEntryArr by date and time
    dataEntryArr.sort((a, b) => {
        // Parse dates
        const dateA = new Date(Date.parse(a.date.replace(/\//g, "-")));
        const dateB = new Date(Date.parse(b.date.replace(/\//g, "-")));
    
        // Compare dates by timestamp (earlier date comes first)
        const dateComparison = dateA.getTime() - dateB.getTime();

        // If dates are different, return the comparison result
        if (dateComparison !== 0) {
            return dateComparison;
        }
    
        // Prioritize entries with time first
        return (a.time || b.time) ? (a.time ? -1 : 1) : 0; // Time before no time, same time order preserved
    
    });
   
    //Loop through dataEntryArr to gray out to-do items already completed
    dataEntryArr.forEach((data)=>{
        let checked = localStorage.getItem(data.id) === 'true'
        if(checked){
            data['checkStatus'] = checked //Add property 'checkStatus' and value 'true'
        } else{
            data['checkStatus'] = checked //Add property 'checkStatus' and value 'false'
        }
    })

   //Display To-do items - if array is empty, it will display another message
   if(dataEntryArr.length === 0){
        //No upcoming events or tasks present at this time
        let imageUrl = "public/images/Empty-bro.svg";  
        const message = "No upcoming events or tasks present at this time."
        upcomingUlTag.innerHTML = `<li class="upcoming-message">
                                        <div class="upcoming-inner-container">
                                        <p class="message">${message}</p>
                                        <img src="${imageUrl}" alt="Lady finding nothing in box" class="upcoming-empty-message">
                                        <a href="https://storyset.com/work" class="image-link">Work illustrations by Storyset</a>
                                        </div>
                                    </li>`
        
   } else{
        dataEntryArr.forEach((dataEntry)=>{

        function displayUpcomingTodoItems(id, title, type, date, time, category, subtasks, color, checkStatus){
            let timeDisplay = ''
            if(time === 'NaN: PM' || !time){
                timeDisplay  
            } else {
                timeDisplay = `| ${time}`
            }
            
            //Add subtasks if required
            let subtasksPresent = subtasks.filter(subtask => subtask.name); //true or false
            let innerUl = ''
            let innerli = '- Subtasks present'
               
            if(subtasksPresent.length === 0){
                innerUl =  `<ul class="innerUl hidden"></ul>`; //No subtask will display
            } else{
                innerUl = `<ul class="upcoming-innerUl">${innerli}<i class="fa-solid fa-diagram-successor"></i></ul>`; //Message will display
            }
               
            upcomingUlTag.innerHTML += ` 
                                    <li class="upcoming-list-item" id="${id}">
                                    <div class="layer ${checkStatus}"></div> 
                                    <div class="row-list">
                                        <div class="upcoming-input-container">
                                            ${title}
                                        </div>
                                        <div>
                                            <button type="button" class="view-Btn">View</button> <button type="button" class="edit-upcoming-Btn">Edit</button> 
                                        </div>
                                    </div>
            
                                    <p class="list-details">${date} ${timeDisplay} | ${type} | ${category}<span class="color-box" style="background-color:${color};"></span></p>
                                     ${innerUl} 
                                    </li>`
        }
        
        //Display Upcoming items
        displayUpcomingTodoItems(dataEntry.id, dataEntry.title, dataEntry.type, dataEntry.date, dataEntry.time,dataEntry.category, dataEntry.subtasks, dataEntry.color, dataEntry.checkStatus)


        //Edit Eventlistener
        const editBtns = document.querySelectorAll('.edit-upcoming-Btn')
        editBtns.forEach((btn, i)=>{
            btn.addEventListener('click', function(){
                openForm()
                
                let currentID = Number(dataEntryArr[i].id)
                editEntry(currentID) //Calling the edit function
            })
        })

        //Fullview eventListener
        const viewBtns = document.querySelectorAll('.view-Btn')
        viewBtns.forEach((btn, i)=>{
            btn.addEventListener('click', function(){     
                let currentID = Number(dataEntryArr[i].id)
                 
                dataEntryArr.filter((entry)=>{
                    if(entry.id == currentID){       
                        /////FULL VIEW OF TODO LIST/////
                        viewFullDetailsOfTodoItem(entry.title, entry.date, entry.time, entry.type, entry.description, entry.subtasks, entry.category, entry.color, entry.location, entry.id) 
                        }
                    })
                })
        })
    })
  }
}

///Obtain upcoming items and display it
function openUpcomingContainer(){
    upcomingContainer.classList.add('active')
    editEntryCurrentID = '';
    upComingTodoItems()

    //Close Past Due Container
    removePastDueContainer()
}



//////////////////////// OUTSTANDING tasks & events ///////////////////////////

//when button is clicked, it will open the window
const pastDueContainer = document.querySelector('.pastDue-container')
const exitBtn = document.querySelector('.exit-pastDue-container')
const pastDueUlTag = document.getElementById('pastDue-items')

//Close container
function removePastDueContainer(){
    pastDueContainer.classList.remove('active')
    editEntryCurrentID = '';
}

exitBtn.addEventListener('click', function(){
    removePastDueContainer()
})

function pastDueTodoItems(){
    //Obtaining the current date
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for month
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for day
    
        return `${month}/${day}/${year}`;
    }
    //Today's date
    let date = new Date();
    let currentDate = formatDate(date)

    let pastDueArr = []
    pastDueUlTag.innerHTML = "";
    
    //Push only past dates to array
    const pastDateObjects = formDataArr.filter(obj => {
        const objDate = new Date(obj.date);
        const objDateWithoutTime = new Date(objDate.getFullYear(), objDate.getMonth(), objDate.getDate());
        return objDateWithoutTime < new Date(currentDate);
    });
    //console.log(pastDateObjects)

    //Add property and value (checkbox) /Some will be true and other false            
    pastDateObjects.forEach((data)=>{
        let checked = localStorage.getItem(data.id) === 'true'
            if(checked){ //true means done!
                data['checkStatus'] = checked //creating a new object (true = completed)
            } else{
                data['checkStatus'] = checked //creating a new object (false)
                pastDueArr.push(data) //Add all false todo items in another way to be displayed
            }
            
    }) 
 
    // Before sorting, ensure consistent time representation:
    pastDueArr.forEach(entry => {
        if (entry.time === "NaN: PM" || !entry.time || entry.time.trim() === "") {
            entry.time = ""; // Replace NaN:PM with an empty string (or your desired value)
        } 
    });

    //Sort dataEntryArr by date and time
    pastDueArr.sort((a, b) => {
        // Parse dates
        const dateA = new Date(Date.parse(a.date.replace(/\//g, "-")));
        const dateB = new Date(Date.parse(b.date.replace(/\//g, "-")));
    
        // Compare dates by timestamp (earlier date comes first)
        const dateComparison = dateA.getTime() - dateB.getTime();

        // If dates are different, return the comparison result
        if (dateComparison !== 0) {
            return dateComparison;
        }
    
        // Prioritize entries with time first
        return (a.time || b.time) ? (a.time ? -1 : 1) : 0; // Time before no time, same time order preserved
    
    });
    
    function displayPastDueTodoItems(id, title, type, date, time, category, subtasks, color, checkStatus){
        let timeDisplay = ''
            if(time === 'NaN: PM' || !time){
                    timeDisplay  
            } else {
                    timeDisplay = `| ${time}`
            }
                
        //Add subtasks if required
        let subtasksPresent = subtasks.filter(subtask => subtask.name); //true or false        
        let innerUl = ''
        let innerli = '- Subtasks present'
                   
            if(subtasksPresent.length === 0){
                innerUl =  `<ul class="innerUl hidden"></ul>`; //No subtask will display
            } else{
                innerUl = `<ul class="pastDue-innerUl">${innerli}<i class="fa-solid fa-diagram-successor"></i></ul>`;
            }
                   
            pastDueUlTag.innerHTML += ` 
                            <li class="pastDue-list-item" id="${id}">
                            <div class="layer ${checkStatus}"></div> 
                            <div class="row-list">
                                <div class="pastDue-input-container">
                                    ${title}
                                </div>
                                <div>
                                    <button type="button" class="view-pastDue-Btn">View</button> <button type="button" class="edit-pastDue-Btn" >Edit</button> 
                                </div>
                            </div>
                            <p class="list-details">${date} ${timeDisplay} | ${type} | ${category}<span class="color-box" style="background-color:${color};"></span></p>
                                ${innerUl} 
                            </li>`

        //Edit eventlistener
        const editBtns = document.querySelectorAll('.edit-pastDue-Btn')
        editBtns.forEach((btn, i)=>{
            btn.addEventListener('click', function(){
            //Open form
            openForm()
            
            let currentID = Number(pastDueArr[i].id)
            editEntry(currentID) //Calling the edit function
            })
        })

        //Fullview eventListener
        const viewBtns = document.querySelectorAll('.view-pastDue-Btn')
        viewBtns.forEach((btn, i)=>{
            btn.addEventListener('click', function(){
                let currentID = Number(pastDueArr[i].id)
                pastDueArr.filter((entry)=>{
                    if(entry.id == currentID){
                    
                    /////FULL VIEW OF TODO LIST/////
                    viewFullDetailsOfTodoItem(entry.title, entry.date, entry.time, entry.type, entry.description, entry.subtasks, entry.category, entry.color, entry.location, entry.id) 
                    }
                })
            })
        })

    }

    //Display Message to UI depending on array status
    if(pastDateObjects.length === 0){
        let imageUrl = "public/images/Empty-bro.svg";  
        const message = "Looks like you don't have any past due tasks or events. Why not add some new ones to your to-do list?"
        pastDueUlTag.innerHTML = `<li class="upcoming-message">
                            <div class="upcoming-inner-container">
                            <p class="message">${message}</p>
                            <img src="${imageUrl}" alt="Lady finding nothing in box" class="upcoming-empty-message">
                            <a href="https://storyset.com/work" class="image-link">Work illustrations by Storyset</a>
                            </div>
                        </li>`


    } else if(pastDueArr.length === 0){
          //No upcoming events or tasks present at this time
          let imageUrl = "public/images/Done-rafiki.svg";  
          const message = "Great job! You've accomplished everything on your list."
          pastDueUlTag.innerHTML = `<li class="upcoming-message">
                              <div class="upcoming-inner-container">
                              <p class="message">${message}</p>
                              <img src="${imageUrl}" alt="Lady finding nothing in box" class="upcoming-empty-message">
                              <a href="https://storyset.com/work" class="image-link">Work illustrations by Storyset</a>
                              </div>
                          </li>`
    } else {
        pastDueArr.forEach((data)=>{

            displayPastDueTodoItems(data.id, data.title, data.type, data.date, data.time, data.category, data.subtasks, data.color, data.checkStatus)
        })
    }        
}

//Open container
function openPastDueContainer(){
    pastDueContainer.classList.add('active')
    editEntryCurrentID = '';

    //Close Upcoming
    removeUpcomingContainer()

    pastDueTodoItems()
} 




/////////////////////////// Display Board-view ////////////////////////
let dateContainer = document.querySelector('.date-container')


function displayWeek(dateToCompare, selectedEntries, currentThreeDates) {
    const columns = []; // Array to store the formatted columns
    let innerUl = ''
    let innerli = ''
    let timeDisplay = ''

    
    function todoListTime(time){
        if(time === 'NaN: PM' || !time){
            timeDisplay  
        } else {
            timeDisplay = `${time} |`
        }
    }

    function subTask(subtasks){
        if(subtasks.length === 0){
            innerUl =  `<ul class="innerUl hidden"></ul>`
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
        innerli = " "
    }
 

    // Loop through each date and corresponding entry (if any)
    for (let i = 0; i < 3; i++) {
       let columnContent = `
        <div class="date-heading">
          <p class="date-week">${dateToCompare[i]}</p>
        </div>
      `;
  
      const matchingEntry = selectedEntries.filter(
        (data) => data.date === currentThreeDates[i] //three match 03/12/24 [{},{},{}]
      );
        
     // let subtasksPresent = subtasks.filter(subtask => subtask.name); 
      if(matchingEntry.length > 0){
            for(const entry of matchingEntry){
                subTask(entry.subtasks) //this works for one but not more than one [ ]
                todoListTime(entry.time)
            
            

                columnContent += `
                        <li class="list-item-board" id="${entry.id}">
                                <div class="row-list">
                                    <div class="input-container">
                                        <label class="container"><input type="checkbox" id="${entry.id}" class="checkbox main-checkbox"><span class="checkmark main-checkbox"></span></label> ${entry.title}
                                    </div>
                                    <div class="menu-container">
                                      <i class="fa-solid fa-ellipsis-vertical"></i>
                                      <div class="btn-board-container">
                                        <button type="button" class="edit-Btn edit-boardview-btn">Edit</button> <button type="button" class="item-delete-Btn delete-boardview-btn">Delete</button> 
                                      </div>
                                    </div>

                                </div>

                                <p class="list-details">${timeDisplay} ${entry.type} | ${entry.category}<span class="color-box" style="background-color:${entry.color};"></span></p>
                                    ${innerUl} 
                            </li>`;           
            }
        }
        columns.push(columnContent);
    }

   

        columns.forEach((item, i)=>{
            dateContainer.innerHTML += `<div class="date-innerContainer">
                ${item}
            </div>
            `
        })
         

        getList() //display fullview

        trackCheckboxStatus()//Track checkboxes


        //Edit and Delete button hover affect
        let list = document.querySelectorAll('.date-innerContainer')
        let buttonContainers = document.querySelectorAll('.btn-board-container')
        let menuIcons = document.querySelectorAll('.fa-ellipsis-vertical')

        menuIcons.forEach((icon, i)=>{
                icon.addEventListener('click', function(){
                    buttonContainers[i].classList.add('visible')

                })
                
        })
        buttonContainers.forEach((container, i)=>{
            container.addEventListener('mouseleave', function(){
                buttonContainers[i].classList.remove('visible')
            })
        })


        //Delete to-do items
        let boardViewItems = dateContainer.querySelectorAll('li.list-item-board')
        let deleteBtns = dateContainer.querySelectorAll('.item-delete-Btn')

        deleteBtns.forEach((btn, i)=>{
                btn.addEventListener('click', function(){
                    let currentListId = Number(boardViewItems[i].id)
                    
                    deleteEntry(currentListId)
                })
        })

        //Edit to-do items
        let midContainer = document.querySelector('.view-container')
        let editBtns = dateContainer.querySelectorAll('.edit-Btn')
        editBtns.forEach((btn, i)=>{
            btn.addEventListener('click', function(){
                openForm()
             
                //call function to make todo list layout responsive
                //responsiveDateLayoutWithFormOpen()   

                let currentListId = Number(boardViewItems[i].id)
                editEntry(currentListId)
            })
        })

       // responsiveDateLayout() //responsive three date box layout
  }



///////////////////// Display List-view //////////////////
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
   
    const listItem = document.createElement('li');
    listItem.innerHTML = ` 
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
    //todoList.innerHTML += 
    todoList.appendChild(listItem)
    
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

    //Edit option
    let editBtns = Array.from(todoList.querySelectorAll('.edit-Btn'))
    editBtns.forEach((btn, i)=>{
        btn.addEventListener('click', function(){
            
            //Open form
            openForm()

            //Form needs to be filled with current todo item
            let currentListID = Number(list[i].id)
        
            editEntry(currentListID)
        })
    })


    //Hover over the delete and edit buttons
    todoList = document.querySelector('.todo-List') //This is the list view option
    const listItems = document.querySelectorAll('li.list-item')

    const viewDeleteBtns = todoList.querySelectorAll('.item-delete-Btn');
    const viewEditBtns = todoList.querySelectorAll('.edit-Btn');

    let listArr = Array.from(listItems)//turn to array

    listArr.forEach((list, i)=>{
        list.addEventListener('mouseenter', function(){
            viewDeleteBtns[i].classList.add('visible')
            viewEditBtns[i].classList.add('visible')
        })
        list.addEventListener('mouseleave', function(){
            viewDeleteBtns[i].classList.remove('visible')
            viewEditBtns[i].classList.remove('visible')
        })

    })

    
} 


//// Open/Display leftside-container ///////
//For ipad and mobile
function responsiveDateLayout(){

    const sidebarIcon = document.querySelector('.sidebar-container')         //Icon
    const leftsideContainer = document.querySelector('.leftside-container')  //Side-bar menu
    const mobileShadow = document.querySelector('.mobile-background')        //Background shadow for mobile version
    let dateContainerResponsive = document.querySelector('.date-container')  //Adjust width of date alignment for boardview
    let viewContainer = document.querySelector('.view-container')            //Boardview container adjustment
    
    //If forms are clicked then do this
    const addNewFormBtn = document.querySelector('.add-new-item')
    const closeForm = document.querySelector('.exit-form')
    const closeFullviewForm = document.querySelector('.exit-full-view')


    sidebarIcon.addEventListener('click', function(){
        leftsideContainer.classList.toggle('leftside-container-display')
        mobileShadow.classList.toggle('mobile-background-shadow') //background-shadow
        viewContainer.classList.toggle('sidebar-active')          //Adjust boardview container when sidebar present
        dateContainerResponsive.classList.toggle('sidebar-active') //three dates box flex direction changes when sidebar present
           
    })
    mobileShadow.addEventListener('click', function(){
        leftsideContainer.classList.toggle('leftside-container-display')
        mobileShadow.classList.toggle('mobile-background-shadow')
    })



    //When new and edit forms are open with sidebar also open
    addNewFormBtn.addEventListener('click', function(){  //new form
        dateContainerResponsive.classList.add('sidebar-form-active')
        
    })
    document.addEventListener('click', function(event){
        if(event.target.classList.contains('edit-boardview-btn')){ //edit form
            dateContainerResponsive.classList.add('sidebar-form-active')
        }
    })
    closeForm.addEventListener('click', function(){  //close new and edit form
        dateContainerResponsive.classList.remove('sidebar-form-active')
    })
    closeFullviewForm.addEventListener('click', function(){ //close fullview form
        dateContainerResponsive.classList.remove('sidebar-form-active')
    })

  

}
responsiveDateLayout()


    


//Only displaying tasks or events that match the current date///
//let todoList = document.getElementById('todo-List')
let todoList = document.querySelector('.todo-List')
function compareDates(dateToCompare){
  
   if(listViewOption){

        const options={
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }
        //Changed date format to ##/##/####
        let dateFormat = dateToCompare.toLocaleDateString('en-US', options) 
        //Clear the list view UI
        todoList.innerHTML = " "

        formDataArr.filter((dataEntry)=>{
            if(dataEntry.date == dateFormat){    

                displayPreviewOfTodoList(dataEntry.id, dataEntry.title, dataEntry.type, dataEntry.date, dataEntry.time,dataEntry.category, dataEntry.subtasks, dataEntry.color)
            } 
        })

   } else{

        ////Board-view///
        let currentThreeDates = [] //Created here
        dateContainer.innerHTML = " " 

        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for month
            const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for day
        
            return `${month}/${day}/${year}`;
        }
        //Today's date
        let date = dateToCompare;
        let today = formatDate(date)
        

        //Tomorrow's date
        const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
        let boardViewTomorrow = formatDate(tomorrow)

        //Day after tomorrow
        let nextDay = formatDate(new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000));

        //Push to array
        currentThreeDates.push(today, boardViewTomorrow, nextDay)



        let selectedEntries = formDataArr.filter((dataEntry, i)=>{
            if(dataEntry.date == currentThreeDates[0] || dataEntry.date == currentThreeDates[1] || dataEntry.date == currentThreeDates[2]){
                return dataEntry         
            } 
        })
        

        displayWeek(datesForBoardView, selectedEntries, currentThreeDates)
      
   }
   
}

////Used when localStorage key is deleted manually////
function initializeFormDataArray(){
    const savedFormItems = localStorage.getItem('FormData')
    formDataArr = JSON.parse(savedFormItems)

    eventsTasksCounter()//To update counter
    
    if(!formDataArr){ //null is falsy
        formDataArr = []
    }
}



/////////////////// Validate Form ///////////////////
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


/////// Reset/Clear form //////
function clearForm(){
    //clear title
    document.getElementById('title-input').value = ""
    document.getElementById('title-input').placeholder = "Add Title"
    titleErrorMessage("")
       

    //clear type (event or task)
    const eventOption = document.getElementById('event-option')
    const taskOption = document.getElementById('task-option')
    typeErrorMessage("")
    eventOption.classList.remove('clicked')
    taskOption.classList.remove('clicked')
    typeOfTodo = ""; //Event or task
    categoryErrorMessage("") //clear error message on category input field


    //clear description
    document.getElementById('input-description').value = ""
    document.getElementById('input-description').placeholder = "Add Description"

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
              editEntryCurrentID = '';
            } else{
                formDataArr.push(formData) //New entry
            }
          } else{
            formDataArr.push(formData) //New entry
          }
          
        //Update upcoming items
        upComingTodoItems()
        //Update past due items
        pastDueTodoItems()

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
    const textareaId = document.getElementById('input-description')
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







        
   
    
   
         


