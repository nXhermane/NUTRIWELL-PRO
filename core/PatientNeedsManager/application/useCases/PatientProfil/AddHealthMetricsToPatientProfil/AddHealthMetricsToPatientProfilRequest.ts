import { CreateHealthMetricProps } from "@/core/PatientNeedsManager/domain/value-objects/types";
import { AggregateID } from "@/core/shared";

export type AddHealthMetricsToPatientProfilRequest = {
   patientProfilIdOrPatientId: AggregateID;
   healthMetrics: CreateHealthMetricProps[];
};
