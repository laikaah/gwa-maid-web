import { Response, Subject, AssessmentClass, Assessment, json } from './models'

export const BASE_URL: string = 'http://127.0.0.1:5000'
export const DEFAULT_GRADE = 80;

/*
    Blood, sweat, and tears went into making this whole shamalalabingbing black magic to work. And not the popular Kpop album.
*/

export async function request(url: string, json_parameters: {[key: string]: any}, method: string): Promise<Response | null> {

    let init: RequestInit;

    if (method === 'POST') {
        init = <RequestInit>{
            url: url,
            method: method,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            mode: 'cors',
            cors: 'default',
            cache: <RequestCache>'default',
            body: JSON.stringify(json_parameters)
        };
    } else if (method === 'GET') {
        init = <RequestInit>{
            url: url,
            method: method,
            headers: new Headers({
                'Accept': 'application/json'
            }),
            mode: 'cors',
            cors: 'default',
            cache: <RequestCache>'default'
        };
        // if method is GET append the json parameters to 
        // the url as arguments
        url += new URLSearchParams(json_parameters).toString();
    } else return null

    let request = new Request(url, init);

    return fetch(request).then((response) => {
        return response.json();
    });
}

export async function verifyToken(token: string | null): Promise<boolean | null> {
    if (token == null) return false;

    const url: string = BASE_URL + '/verify_token';

    let json_parameters = {
        token: token
    };

    let response = await request(url, json_parameters, 'POST');

    return response.success;
}

export async function login(username: string, password: string): Promise<string | null> {
    const url: string = BASE_URL + '/login';

    let json_parameters = {
        username: username,
        password: password
    };

    let response = await request(url, json_parameters, 'POST');

    if (!response.success) return null;

    return response.token;
}

export async function register(username: string, password: string): Promise<string | null> {
    const url: string = BASE_URL + '/register'

    let json_parameters = {
        username: username,
        password: password
    };

    let response = await request(url, json_parameters, 'POST')

    if (!response.success) return null;

    return response.token;
}

export async function getSubjects(token: string): Promise<Subject[] | null> {
    const url: string = BASE_URL + '/subjects';

    let json_parameters = {
        token: token
    };

    let response = await request(url, json_parameters, 'POST')
 
    if (!response.success) return null;

    return response.subjects.map((subject: Subject) => {
        return {
            id: subject.id,
            name: subject.name,
            weight: subject.weight,
            assessment_classes: subject.assessment_classes,
            last_updated: subject.last_updated,
            predicted_grade: subject.predicted_grade
        }
    });
}

export async function addSubject(token: string, subject: Subject): Promise<boolean> {
    const url: string = BASE_URL + '/subjects/add';

    let json_parameters = {
        token: token,
        subject_name: subject.name,
        subject_weight: subject.weight,
        last_updated: new Date().toLocaleString('en-US'),
        predicted_grade: subject.predicted_grade
    };

    let response = await request(url, json_parameters, 'POST');

    return response.success;
}

// export async function get_assessment_classes(token: string, subject_name: string): Promise<AssessmentClass[] | null> {
//     const url: string = BASE_URL + '/subjects/assessment_classes';

//     let json_parameters = {
//         token: token,
//         subject_name: subject_name
//     };

//     let response = await request(url, json_parameters, 'GET')

//     if (!response.success) return null;

//     return response.assessment_classes.map((assessment_class: AssessmentClass) => {
//         return {
//             id: assessment_class.id,
//             name: assessment_class.name,
//             subject_id: assessment_class.subject_id,
//             weight: assessment_class.weight,
//             assessments: assessment_class.assessments,
//             predicted_grade: assessment_class.predicted_grade
//         };
//     });
// }

export async function addAssessmentClass(token: string, assessment_class: AssessmentClass): Promise<boolean> {
    const url: string = BASE_URL + '/subjects/assessment_classes/add';

    let json_parameters = {
        token: token,
        subject_name: assessment_class.subject.name,
        assessment_class_name: assessment_class.name,
        assessment_class_weight: assessment_class.weight,
        predicted_grade: assessment_class.predicted_grade,
        last_updated: new Date().toLocaleString('en-US')
    };

    let response = await request(url, json_parameters, 'POST')

    return response.success;
}

// export async function get_assessments(token: string, subject_name: string, assessment_class_name: string): Promise<Assessment[] | null> {
//     const url: string = BASE_URL + '/subjects/assessment_classes/assessments';

//     let json_parameters = {
//         token: token,
//         subject_name: subject_name,
//         assessment_class_name: assessment_class_name
//     };

//     let response = await request(url, json_parameters, 'GET')

//     if (!response.success) return null;

//     return response.assessments.map((assessment: Assessment) => {
//         return {
//             id: assessment.id,
//             name: assessment.name,
//             assessment_class_id: assessment.assessment_class_id,
//             grade: assessment.grade
//         }
//     });
// }

export async function addAssessment(token: string, assessment: Assessment): Promise<boolean> {
    const url: string = BASE_URL + '/subjects/assessment_classes/assessments/add';

    let json_parameters = {
        token: token,
        subject_name: assessment.assessment_class.subject.name,
        assessment_class_name: assessment.assessment_class.name,
        assessment_name: assessment.name,
        grade: assessment.grade,
        last_updated: new Date().toLocaleString('en-US')
    };

    let response = await request(url, json_parameters, 'POST')

    return response.success;
}