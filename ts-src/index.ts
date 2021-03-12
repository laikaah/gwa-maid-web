import * as query from './query'

// if user has an existing token, verify it
// if it's valid, redirect to home.html

let token: string = localStorage.getItem('token')

if (query.verify_token(token)){
    window.location.replace(window.location.origin + '/home.html')
}

document.addEventListener('DOMContentLoaded', () => {
    const form: HTMLElement = document.getElementById('login-form');

    form.onsubmit = () => {
        const username: string = (<HTMLInputElement> document.getElementById('username')).value

        const password: string = (<HTMLInputElement> document.getElementById('password')).value

        let response: string | null = query.login(username, password);

        if (response != null){
            localStorage.setItem('token', token);
            window.location.replace(window.location.origin + '/home.html')
        } else {
            alert('Incorrect credentials.')
            window.location.reload();
        }
    }
})