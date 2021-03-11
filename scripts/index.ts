import * as query from './query.js'

let token: string = localStorage.getItem('token')

if (token != null){
    // check if token is valid

    token = query.login()
}