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

    document.querySelector('.task-overlay').style.display = 'none';
    })
}

const menuItems= document.querySelectorAll('.sub-head');
const itemTitle= document.getElementById('current-title')

menuItems.forEach(item =>{
    item.addEventListener('click', () =>{
        const textElement= item.querySelector('.sub-text');
        if (textElement){
            itemTitle.innerText=textElement.innerText
        }
    });
});