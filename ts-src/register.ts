import * as query from './query.js'
import * as helpers from './helpers.js'

export {};

// check for localStorage support
if (!helpers.verify_local_storage()){
    alert('We\'re sorry, but your browser does not support local storage. Our site will not work for you.')
    window.close()
}


const token: string | null = localStorage.getItem('token')

// if user already has a valid token,
// ask if they want to go to home page

query.verify_token(token).then((is_valid) => {
    if (is_valid){
        let redirect = confirm('It seems that you\'re already logged in. Do you want to go to the home page?')

        if (redirect){
            window.location.replace(window.location.origin);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form: HTMLFormElement = <HTMLFormElement> document.getElementById('register')

    form.onsubmit = async () => {
        const username: string =( <HTMLInputElement> form.elements.namedItem('username')).value;

        const password: string =( <HTMLInputElement> form.elements.namedItem('password')).value;

        const confirm_password: string =( <HTMLInputElement> form.elements.namedItem('confirm_password')).value;

        if (password != confirm_password){
            alert('Passwords do not match.')
            window.location.reload()
        } else {
            const token: string | null = await query.register(username, password);

            if (token == null){
                alert('Registration failed.')
                window.location.reload()
            } else {
                localStorage.setItem('token', token);
            }
        }
        return false;
    }
})