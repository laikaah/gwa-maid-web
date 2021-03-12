export interface Subject {
    id: number
    name: string,
    weight: number,
    assessment_classes_names: string[],
    predicted_grade: number
}

export interface AssessmentClass {
    id: number
    name: string,
    subject_id: number,
    weight: number,
    assessments_names: string[],
    predicted_grade: number
}

export interface Assessment {
    id: number,
    name: string,
    assessment_class_id: number,
    grade: number
}