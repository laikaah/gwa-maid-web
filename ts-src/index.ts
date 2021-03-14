import * as api from './api_interface.js'
import * as helpers from './helpers.js'

// check for localStorage support
if (!helpers.verifyLocalStorage()) {
    alert(
        'We\'re sorry, but your browser does not support local storage. Our site will not work for you.'
    )
    window.close()
}

if (!window.navigator.onLine) {
    alert(
        'It seems that you\'re offline. Your changes won\'t be saved to our servers.'
    )
}

const token: string = localStorage.getItem('token')

// if user has an existing token, verify it
// if it's valid, redirect to home.html

api.verifyToken(token).then((is_valid) => {
    if (is_valid) {
        let redirect = confirm('You\'re already logged in. Do you want to go to the home page?')

        if (redirect)
            window.location.replace(window.location.origin + '/htdocs/home.html')
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    const form: HTMLFormElement = <HTMLFormElement>document.getElementById('login-form');


    form.onsubmit = async (e) => {
        e.preventDefault()
        const username: string = (<HTMLInputElement>form.elements.namedItem('username')).value

        const password: string = (<HTMLInputElement>form.elements.namedItem('password')).value

        let response_token: string | null = await api.login(username, password)

        api.login(username, password).then((response_token) => {
            if (response_token != null){
                localStorage.setItem('token', response_token);
                window.location.replace(window.location.origin + '/htdocs/home.html')
            } else {
                alert('Incorrect credentials.')
            }
        })
    }
})