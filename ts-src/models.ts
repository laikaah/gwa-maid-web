export interface Response {
    success: boolean,
    [key: string]: any
}

export interface Subject {
    id?: number
    name: string,
    weight: number,
    assessment_classes?: AssessmentClass[],
    predicted_grade: number
}

export interface AssessmentClass {
    id?: number
    name: string,
    subject: Subject,
    weight: number,
    assessments: Assessment[],
    predicted_grade: number
}

export interface Assessment {
    id?: number,
    name: string,
    assessment_class: AssessmentClass,
    grade: number
}

export type json = string | number | boolean | null | json[] | {
    [key: string]: json | undefined,
  };