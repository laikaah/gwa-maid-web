import * as api from './api_interface'
import { Subject } from './models'

export function verifyLocalStorage(): boolean {
    if (Storage !== void (0)) {
        return true;
    }
    return false;
}

export function parseQuery(queryString: string): { [key: string]: any } {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

export function writeSubjectsToTable(table: HTMLTableElement, subjects: Subject[]) {
    // create a new tbody
    let tbody_of_subjects = document.createElement('tbody');

    subjects.forEach((subject, index) => {
        let row = tbody_of_subjects.insertRow(index);
        row.insertCell(0).innerHTML = subject.name;
        row.insertCell(1).innerHTML = subject.last_updated;
        row.insertCell(2).innerHTML = subject.weight.toString() + '%';
        row.insertCell(3).innerHTML = subject.predicted_grade.toString();
    })

    // replace the old tbody with the new tbody
    let old_tbody_of_subjects = table.tBodies[0];

    table.replaceChild(tbody_of_subjects, old_tbody_of_subjects)
}