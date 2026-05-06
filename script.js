let allTasksData = [];
let loggedInUser = "";
window.onload = () => {
    document.querySelector('.login-overlay').style.display = 'flex';
    document.querySelector('.task-overlay').style.display = 'none';
};
const submitBtn=document.getElementById('submit-btn');
if (submitBtn) {
    submitBtn.addEventListener('click', async()=>{
        const user=document.querySelector('.username input').value;
        const pass=document.querySelector('.password input').value;
        const response=await fetch('https://PsychoShinigamii.pythonanywhere.com/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: user, password: pass})
        });

        const result=await response.json();
        if (result.status==='success'){
            loggedInUser=user
            allTasksData = result.tasks || [];
            itemTitle.innerText = "Sticky Wall";
            showFilteredTasks("Sticky Wall");
            document.querySelector('.login-overlay').style.display='none';
        } else{
            alert(result.message);
        }
        }   
    )};

const regBtn = document.getElementById('register-btn');
if (regBtn) {
    regBtn.addEventListener('click', async() => {
        const user = document.querySelector('.username input').value;
        const key1 = document.querySelector('.password input').value;
        const key2 = document.querySelectorAll('.password input')[1].value;
        
        if (key1==="" || key2===""){
                alert("The Death Key cannot be empty!");
                return;
        } else if (key1!==key2){
                alert("The Death Keys do not match!");
                return;
        } else if (key1.length<8){
                alert("The Death Key must be at least 8 characters long!");
                return;
        } else if (user===""){
                alert("Username cannot be empty!");
                return;
        }
        
        const response = await fetch('https://PsychoShinigamii.pythonanywhere.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: key1 })
        });
        
        const result=await response.json();
        alert(result.message);
        if (result.status==='success'){
            window.location.href='/'
        }

        });
}

const addBtn = document.querySelector('.add-btn');

if (addBtn) {
    addBtn.addEventListener('click', () => {
        if (loggedInUser !== "") {
            document.querySelector('.task-overlay').style.display = 'flex';
        } else {
            alert("You must enter the Realm first!");
        }
    });
}

const saveBtn= document.getElementById('save-btn');
if (saveBtn){
    saveBtn.addEventListener('click', async() =>{
        const taskName= document.querySelector('.task-name input').value;
        const taskDesc= document.querySelector('.task-desc input').value;
        const taskDate= document.querySelector('.date input').value;

        if (taskName.trim() === "") {
            alert("A task must have a name, Mortal!");
            return; 
        }
        if (taskDate.trim() === "") {
            alert("When shall this be executed? Enter a date.");
            return;
        }

        const response= await fetch('https://PsychoShinigamii.pythonanywhere.com/add_task', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: loggedInUser,
                task_name: taskName,
                task_description: taskDesc,
                date: taskDate
            })
        });

        const result = await response.json();
        if (result.status === 'success') {
            const newTask = {
                Tname: taskName,
                Tdescription: taskDesc,
                Tdate: taskDate,
                completed: false
            };
            allTasksData.push(newTask); 
            itemTitle.innerText = "Sticky Wall";
            showFilteredTasks(itemTitle.innerText);
            document.querySelector('.task-overlay').style.display = 'none';
            document.querySelectorAll('.task-box input').forEach(i => i.value = "");
            }
        });
}

const menuItems= document.querySelectorAll('.sub-head');
const itemTitle= document.getElementById('current-title')

menuItems.forEach(item =>{
    item.addEventListener('click', () =>{
        const textElement= item.querySelector('.sub-text');
        if (textElement) {
            const filterName = textElement.innerText;
            itemTitle.innerText = filterName;
            showFilteredTasks(filterName);
        }
    });
});

function renderTask(name, desc, date, isCompleted = false) {
    /* Took the help of AI for the function renderTask */
    const grid = document.querySelector('.grid');
    const addButton = document.querySelector('.task-add');
    
    const taskCard = document.createElement('div');
    taskCard.className = 'task-pattern';

    // 1. Force the initial visibility based on isCompleted
    const iconDisplay = isCompleted ? 'block' : 'none';
    const btnDisplay = isCompleted ? 'none' : 'block';
    const titleDecoration = isCompleted ? 'line-through' : 'none';

    taskCard.innerHTML = `
        <div class="task-content" style="padding: 15px; height: 100%; display: flex; flex-direction: column; position: relative;">
 
            <div class="status-icon" style="display: ${iconDisplay}; color: green; font-weight: bold;">✔</div>
            
            <h2 class="t-name" style="margin-bottom: 5px; text-decoration: ${titleDecoration}; text-transform: uppercase;">${name}</h2>
            <p class="t-desc" style="font-size: 14px; margin-bottom: 10px; flex-grow: 1;">${desc}</p>
            <p class="t-date" style="font-size: 12px; color: gray; margin-top: auto;">Date: ${date}</p>

            <button class="complete-trigger" style="display: ${btnDisplay}; margin-top: 10px; cursor: pointer;">Mark Done</button>
        </div>
    `;

    // 2. Set the background if already done
    if (isCompleted) {
        taskCard.style.opacity = '0.7';
        taskCard.style.backgroundColor = '#e8f5e9';
    }

    const doneIcon = taskCard.querySelector('.status-icon');
    const completeBtn = taskCard.querySelector('.complete-trigger');

    // 3. The Event Listener
    completeBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('https://PsychoShinigamii.pythonanywhere.com/complete_task', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: loggedInUser,
                    task_name: name
                })
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                // UI Updates
                doneIcon.style.display = 'block';
                completeBtn.style.display = 'none';
                taskCard.style.opacity = '0.7';
                taskCard.style.backgroundColor = '#e8f5e9';
                taskCard.querySelector('.t-name').style.textDecoration = 'line-through';
            } else {
                alert("Error from Realm: " + result.message);
            }
        } catch (err) {
            console.error("Fetch failed:", err);
            alert("Could not reach the server!");
        }
    });

    grid.insertBefore(taskCard, addButton);
}

function showFilteredTasks(filterType) {
    const grid = document.querySelector('.grid');
    const addBtn = document.querySelector('.task-add');
    
    grid.innerHTML = ''; 
    grid.appendChild(addBtn);

    const todayDate = new Date().toISOString().split('T')[0];

    allTasksData.forEach(task => {
        let shouldShow = false;

        if (filterType === "Sticky Wall" || filterType === "All Tasks") {
            shouldShow = true;
        } else if (filterType === "Completed") {
            shouldShow = task.completed === true;
        } else if (filterType === "Pending") {
            shouldShow = !task.completed;
        } else if (filterType === "Today") {
            shouldShow = task.Tdate === todayDate;
        } else if (filterType === "Upcoming") {
            shouldShow = task.Tdate.trim() > todayDate;
        }

        if (shouldShow) {
            renderTask(task.Tname, task.Tdescription, task.Tdate, task.completed || false);
        }
    });
}