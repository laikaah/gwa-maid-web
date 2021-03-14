import { Response, Subject, AssessmentClass, Assessment, json } from './models'

const BASE_URL: string = 'http://127.0.0.1:5000'

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

    let response = await request(url, json_parameters, 'GET')
 
    if (!response.success) return null;

    return response.subjects.map((subject: Subject) => {
        return {
            id: subject.id,
            name: subject.name,
            weight: subject.weight,
            assessment_classes_names: subject.assessment_classes_names,
            predicted_grade: subject.predicted_grade
        }
    });
}

export async function addSubject(token: string, subject_name: string, weight: number): Promise<boolean> {
    const url: string = BASE_URL + '/subject/add';

    let json_parameters = {
        token: token,
        subject_name: subject_name
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

export async function addAssessmentClass(token: string, subject_id: number, assessment_class_name: string): Promise<boolean> {
    const url: string = BASE_URL + '/subjects/assessment_classes/add';

    let json_parameters = {
        token: token,
        subject_id: subject_id,
        assessment_class_name: assessment_class_name
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

export async function addAssessment(token: string, subject_name: string, assessment_class_name: string, assessment_name: string): Promise<boolean> {
    const url: string = BASE_URL + '/subjects/assessment_classes/assessments/add';

    let json_parameters = {
        token: token,
        subject_name: subject_name,
        assessment_class_name: assessment_class_name,
        assessment_name: assessment_name
    };

    let response = await request(url, json_parameters, 'POST')

    return response.success;
}