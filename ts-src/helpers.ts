import * as api from './api_interface.js'
import { Subject } from './models.js'

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

        let subject_link = document.createElement('a');
        subject_link.setAttribute('href', api.BASE_URL + '/htdocs/subject.html' + new URLSearchParams({ subject: subject.name }));
        subject_link.innerHTML = subject.name;

        row.insertCell(0).appendChild(subject_link);
        row.insertCell(1).innerHTML = subject.last_updated;
        row.insertCell(2).innerHTML = subject.weight.toString() + '%';
        row.insertCell(3).innerHTML = subject.predicted_grade.toString();
    });

    // replace the old tbody with the new tbody
    let old_tbody_of_subjects = table.tBodies[0];

    table.replaceChild(tbody_of_subjects, old_tbody_of_subjects)
}

export function makeLink(content: string): string {
    return '<a>' + content + '</a>'
}