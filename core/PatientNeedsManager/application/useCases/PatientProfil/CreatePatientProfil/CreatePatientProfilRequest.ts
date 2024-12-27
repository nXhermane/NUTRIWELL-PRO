import { CreatePatientProfilProps } from "../../../../domain";

export type CreatePatientProfilRequest = Omit<CreatePatientProfilProps, "patientNeedsModelId">;
