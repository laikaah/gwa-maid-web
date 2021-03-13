import * as query from './query.js'
import * as helpers from './helpers.js'

console.log('index')

// check for localStorage support
if (!helpers.verify_local_storage()){
    alert('We\'re sorry, but your browser does not support local storage. Our site will not work for you.')
    window.close()
}

// if user has an existing token, verify it
// if it's valid, redirect to home.html

let token: string = localStorage.getItem('token')

query.verify_token(token).then((object) => {
    if (object){
        window.location.replace(window.location.origin + '/htdocs/home.html');
    } else {
        console.log("isn't valid")
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    const form: HTMLFormElement = <HTMLFormElement> document.getElementById('login-form');

    
    form.onsubmit = async () => {
        const username: string = (<HTMLInputElement> form.elements.namedItem('username')).value

        const password: string = (<HTMLInputElement> form.elements.namedItem('password')).value

        let response_token: string | null = await query.login(username, password)

        if (response_token != null){
            localStorage.setItem('token', token);
            window.location.replace(window.location.origin + '/htdocs/home.html')
        } else {
            alert('Incorrect credentials.')
            window.location.reload();
        }
    }
})