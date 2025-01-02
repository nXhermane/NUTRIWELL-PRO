import { MeasurementAddedEvent } from "@/core/MedicalRecordManager/domain/events";
import { DomainEvents, ExceptionBase, IHandler, Message, NutritionData, PatientMeasurementCategory, UseCase } from "@/core/shared";
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
// TODO: Je dois REvoir l'implementation et l'execution des handlers souscripts pour mes domains events
// TODO: Refactoriser ce handler , il n'est pas au top le code peut fonctionner 
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
   onMeasurementAddedEvent(event: MeasurementAddedEvent): void {
      const anthropometricCreationProps = [];
      const bodyCompositionCreationProps = [];
      const medicalAnalyseCreationProps = [];

      for (const measurement of event.data.measurements) {
         NutritionData.getInstance().then((instance) => {
            instance.measurement.getMeasureType({ idOrCode: measurement.measureTypeId }).then((measureTypeData) => {
               if (measureTypeData instanceof Message) throw new Error(measureTypeData.content);

               const creationProps = {
                  name: measureTypeData.data.name,
                  code: measureTypeData.data.code,
                  value: measurement.value,
                  unit: measurement.unit,
               };
               switch (measureTypeData.data.measurementCategory) {
                  case PatientMeasurementCategory.Anthropometry:
                     (
                        this.addAnthropometricMeasureUC.execute({
                           patientProfilIdOrPatientId: event.data.patientId,
                           anthropometricMeasures: [creationProps],
                        }) as Promise<AddAnthropometricMeasureToPatientProfilResponse>
                     )
                        .then(() => {})
                        .catch((e) => console.error("Error"))
                     break;
                  case PatientMeasurementCategory.BodyComposition:
                     (
                        this.addBodycompositionMeasureUC.execute({
                           patientProfilIdOrPatientId: event.data.patientId,
                           bodyCompositions: [creationProps],
                        }) as Promise<AddBodyCompositionToPatientProfilResponse>
                     )
                        .then(() => {})
                        .catch(() => {});
                     break;
                  case PatientMeasurementCategory.MedicalAnalysis:
                     (
                        this.addMedicalAnalysisResultUC.execute({
                           patientProfilIdOrPatientId: event.data.patientId,
                           medicalAnalyses: [creationProps],
                        }) as Promise<AddMedicalAnalyseToPatientProfilResponse>
                     )
                        .then(() => {})
                        .catch(() => {});
                     break;
                  default:
                     throw new Error("Invalid Measure Category");
               }
            });
         });
      }
      // const measurementsCreationProps = event.data.measurements.reduce(async (value) => {
      //    const measurementTypeData = await (await NutritionData.getInstance()).measurement.getMeasureType({ idOrCode: value.measureTypeId });
      //    if (measurementTypeData instanceof Message) throw new Error(measurementTypeData.content);
      //    return { name: measurementTypeData.data.name, code: measurementTypeData.data.code, value: value.value, unit: value.unit };
      // });
   }
}
