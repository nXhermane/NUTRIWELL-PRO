import { PatientProfilRepository } from "../../infrastructure";
import { PatientNeedsModel } from "../entities/PatientNeedsModel";
import { IPatientNeedsModelValidationService } from "./interfaces/PatientNeedsModelValidationService";
// TODO: je dois remplacer cette implementation plus tard pour prendre en charge les defaults params a la place de simuler un default patient Profile 
export class PatientNeedsModelValidationService implements IPatientNeedsModelValidationService {

  constructor(private patientProfilRepo: PatientProfilRepository) { }
  async validate(patientNeedsModel: PatientNeedsModel): Promise<boolean> {
    try {
      if (patientNeedsModel.isValidModel) return true
      const patientProfil = await this.patientProfilRepo.getById("default-patient") // ATTENTION: je dois remplacer cette implementation plus tard pour prendre en charge les defaults params a la place de simuler 


      return true
    } catch (error) {
      return false
    }
  }
}