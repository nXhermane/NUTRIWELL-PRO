import { NutritionFormular } from "../../../domain/entities/NutritionFormular";

export interface NutritionFormularRepository {
    getByIdOrName(idOrName:string,trx?:any):Promise<NutritionFormular>
    save(nutritionFormular:NutritionFormular):Promise<void>
    delete(id: string,trx?:any):Promise<void>
    getAll(): Promise<NutritionFormular[]>
}




