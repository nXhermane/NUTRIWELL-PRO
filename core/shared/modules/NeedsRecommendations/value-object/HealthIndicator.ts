import { EmptyStringError, ExceptionBase, Guard, NegativeValueError, Result, ValueObject } from "@/core/shared";


// Cette class n'est qu'une ébauche de ce qu'on veut reelement faire avec l'ajout des healthdicator donc 
// TODO : Remodelise this value object to satisfy the original idea 
export interface IHealthIndicator {
    name: string;             // Nom de l'indicateur (ex: "Poids", "Glycémie")
    code: string
    value: number;            // Valeur actuelle de l'indicateur
    unit: string;             // Unité de mesure (ex: "kg", "mg/dL")
    threshold?: number;       // Valeur seuil pour alerter (facultatif)
    actionOnThresholdBreach?: string[]; // Fonction à exécuter si le seuil est dépassé
}

export class HealthIndicator extends ValueObject<IHealthIndicator> {
    protected validate(props: IHealthIndicator): void {
        if (Guard.isEmpty(props.name).succeeded || Guard.isEmpty(props.code).succeeded) {
            throw new EmptyStringError("Le nom ou le code de l'indicateur de santé ne doit être vide.")
        }
        if (Guard.isNegative(props.value).succeeded) throw new NegativeValueError("La valeur actuelle de l'indicateur de santé ne doit être négative.")
    }
    static create(props: IHealthIndicator): Result<HealthIndicator> {
        try {
            const indicator = new HealthIndicator(props);
            return Result.ok<HealthIndicator>(indicator);
        } catch (error) {
            return error instanceof ExceptionBase
                ? Result.fail<HealthIndicator>(`[${error.code}]:${error.message}`)
                : Result.fail<HealthIndicator>(`Erreur inattendue. ${HealthIndicator?.constructor.name}`);
        }

    }
}