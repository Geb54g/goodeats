const form = document.querySelector('#create-account-form');
const usernameInput = document.querySelector('#username');
// const emailIput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');

form.addEventListener('submit',(event)=>{
    
    validateForm();
    
    if(isFormValid()==true){
        form.submit();
    }else{
        event.preventDefault();

    }

});
function isFormValid(){
    const inputContainers = form.querySelectorAll('.input-group');
    let result = true;
    inputContainers.forEach((container)=>{
        if(container.classList.contains('error')){
            result = false;
        }
    });
    return result;
}

function validateForm(){

    if(usernameInput.value.trim()==''){
        setError(usernameInput, 'Name can not be empty')
    }else if(usernameInput.value.trim().length <5 || usernameInput.value.trim().length >15){
        setError(usernameInput,'Name must be min 5 and max 15 characters');
    }else{
        setSuccess(usernameInput);
    }

    // if(emailIput.value.trim()==''){
    //     setError(emailIput, 'provide email address');
    // }else if(isEmailValid(emailIput.value)){
    //     setSuccess(emailIput);

    // }else{
    //     setError(emailIput, 'provide a valid email address');
    // }
    
    if(passwordInput.value.trim()==''){
        setError(passwordInput, 'Password can not be empty');
    }else if(passwordInput.value.trim().length <6 || passwordInput.value.trim().length >20){
        setError(passwordInput, 'Password min 6 max 20 charecters');
    }else {
        setSuccess(passwordInput);
    }
    
    if(confirmPasswordInput.value.trim()==''){
        setError(confirmPasswordInput, 'Password can not be empty');
    }else if(confirmPasswordInput.value !== passwordInput.value){
        setError(confirmPasswordInput, 'Password does not match');
    }else {
        setSuccess(confirmPasswordInput);
    }

}

function setError(element, errorMessage){
    const parent = element.parentElement;
    if(parent.classList.contains('success')){
        parent.classList.remove('success');
    }
    parent.classList.add('error');
    const paragraph =parent.querySelector('p');
    paragraph.textContent = errorMessage;
}

function setSuccess(element){
    const parent = element.parentElement;
    if(parent.classList.contains('error')){
        parent.classList.remove('error');
    }
    parent.classList.add('success');

}
// function isEmailValid(email){
//     function isEmailValid(email){
//         const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//         return reg.test(email);
//     } 

// }