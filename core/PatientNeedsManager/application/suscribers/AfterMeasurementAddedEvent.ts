import { MeasurementAddedEvent } from "@/core/MedicalRecordManager/domain/events";
import { DomainEvents, IHandler, UseCase } from "@/core/shared";
import {
   AddAnthropometricMeasureToPatientProfilRequest,
   AddAnthropometricMeasureToPatientProfilResponse,
} from "../useCases/PatientProfil/AddAnthropometricMeasureToPatientProfil";
import {
   AddBodyCompositionToPatientProfilRequest,
   AddBodyCompositionToPatientProfilResponse,
} from "../useCases/PatientProfil/AddBodyCompositionToPatientProfil";
import {
   AddMedicalAnalyseToPatientProfilRequest,
   AddMedicalAnalyseToPatientProfilResponse,
} from "../useCases/PatientProfil/AddMedicalAnalyseToPatientProfil";
// TODO: Implement the handler logic here to handle the MeasurementAddedEvent. For example, save the measurement data to patientProfil or perform any necessary calculations .
export class AfterMeasurementAddedEvent implements IHandler<MeasurementAddedEvent> {
   constructor(
      private addAnthropometricMeasureUC: UseCase<AddAnthropometricMeasureToPatientProfilRequest, AddAnthropometricMeasureToPatientProfilResponse>,
      private addBodycompositionMeasureUC: UseCase<AddBodyCompositionToPatientProfilRequest, AddBodyCompositionToPatientProfilResponse>,
      private addMedicalAnalysisResultUC: UseCase<AddMedicalAnalyseToPatientProfilRequest, AddMedicalAnalyseToPatientProfilResponse>,
   ) {
      this.setupSubscriptions();
   }
   setupSubscriptions(): void {
      DomainEvents.register(this.onMeasurementAddedEvent.bind(this), MeasurementAddedEvent.name);
   }
   onMeasurementAddedEvent(event: MeasurementAddedEvent): void {}
}
