import { AggregateID } from "@/core/shared"

export type RemoveMedicalAnalyseMeasureFromPatientProfilRequest = {
    patientProfilIdOrPatientId: AggregateID
    medicalAnalyseMeasureCode: string[]
}