import { AggregateRoot, EmptyStringError, ExceptionBase, Guard, INeedsRecommendation, ITimeframe, NeedsRecommendation, NegativeValueError, ObjectiveStatus, ObjectiveType, Result, Timeframe } from "@/core/shared";
import { CreateStandardObjectiveProps } from "../types";
import { ObjectiveRecommendationAddedEvent } from "../events/ObjectiveRecommendationAddedEvent";
import { ObjectiveRecommendationRemovedEvent } from "../events/ObjectiveRecommendationRemovedEvent";
/**
 *  Objectif Nutritionnel 
  * Type d'objectif: modification d'un indicateur de santé ou Objectif général 
  * Timeframe : Plage de temps dans laquelle on doit atteindre cet objectif
  * Description de l'objectif (optionnel)
  * Recommandations 
  * State de l'objectif : en cours..., ended, 
  * si c'est de type mesure ou indicateur de santé , on aura les propriétés suivantes:
          - code du mesure 
    - valeur a laquelle on veut ramener cet  indicateur de santé | ici on peut au lieu de donner juste la valeur a atteindre , on prends une intervalle avec au borne inferieur la valeur actuelle et au borne superieure la valeur a atteindre . cela va permettre d'utiliser la variable temps dans les recommandations de l'objectif 
    - measure unit : unité du mesure 
Ex: augmentation du poids dans une periode de deux semaines 
type : measure
timeframe: deux 
code de mesure : poids 
valeur: [50,54] 
unit: Kg

Analyse : 
    Cela veut dire qu'on doit augmenter le poids de 4kg en deux semaines .
    Augmentation journaliere de 4/14 = augmentation de 0.285kg tous les jours 
    Mais avec cette valeur journaliere on n'est pas sur d'atteindre cet objectif, ce qui necessite un check journalier de l'augmentation du poids et un recalcul automatique des appors alors a la fin du j0  

Ici nous sommes dans le cas des objectifs standard ou les parametres doivent etre modifier avant d'etre appliquer au patient cible 
 Donc les recommandations ici sont variables en fonction du timeframe , de la valeur de l'indicateur de santé 
 Les recommandations par formules speciales vont prendre leurs importances ici  
 */
export interface IStandardObjective {
    name: string;
    type: ObjectiveType
    defaultRecommendation: NeedsRecommendation[]
    timeframe: Timeframe;
    measureCode?: string;
    initialValue?: number // Valeur initiale standard
    targetValue?: number // Valeur a atteindre standard
    unit?: string;
    description: string;
}
export class StandardObjective extends AggregateRoot<IStandardObjective> {

    get name(): string {
        return this.props.name
    }
    set name(name: string) {
        this.props.name = name
        this.validate()
    }
    get type(): "Measure" | "General" {
        return this.props.type
    }
    set type(type: "Measure" | "General") {
        this.props.type = type as ObjectiveType
        this.validate()
    }
    get description(): string {
        return this.props.description
    }
    set description(desc: string) {
        this.props.description = desc
        this.validate()
    }

    get measureCode(): string {
        return this.props.measureCode as string
    }
    set measureCode(code: string) {
        this.props.measureCode = code
        this.validate()
    }

    get unit(): string {
        return this.props.unit as string
    }
    set unit(unit: string) {
        this.props.unit = unit
        this.validate()
    }
    get initialValue(): number {
        return this.props.initialValue as number
    }
    set initialValue(value: number) {
        this.props.initialValue = value
        this.validate()
    }
    get targetValue(): number {
        return this.props.targetValue as number
    }
    set targetValue(value: number) {
        this.props.targetValue = value
        this.validate()
    }
    get timeframe(): ITimeframe {
        return this.props.timeframe.unpack()
    }
    set timeframe(timeframe: Timeframe) {
        this.props.timeframe = timeframe
        this.validate()
    }
    get defaultRecommendations(): INeedsRecommendation<any>[] {
        return this.props.defaultRecommendation.map(recommendation=>recommendation.unpack())
    }
    
    getRecommendations(): NeedsRecommendation[] {
        return this.props.defaultRecommendation
    }
    addRecommendations(...recommendations: NeedsRecommendation[]): void {
        recommendations.forEach((value: NeedsRecommendation) => this.props.defaultRecommendation.push(value))
        this.validate()
        this.addDomainEvent(new ObjectiveRecommendationAddedEvent({
            objectiveId: this.id,
            recommendations: recommendations
        }))
    }
    removeRecommendation(...recommendations: NeedsRecommendation[]) {
        recommendations.forEach((recommendation: NeedsRecommendation) => {
            const index = this.props.defaultRecommendation.findIndex((val) => val.equals(recommendation));
            if (index !== -1) this.props.defaultRecommendation.splice(index, 1);
        });
        this.validate();
        this.addDomainEvent(new ObjectiveRecommendationRemovedEvent({
            objectiveId: this.id,
            recommendations: recommendations
        }))
    }

    public validate(): void {
        this._isValid = false
        if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("Le nom de l'objectif ne doit être vide.")
        if (this.props.type === ObjectiveType.Measure) {
            if (Guard.isEmpty(this.props.measureCode).succeeded) throw new EmptyStringError("Le code de mesure ne doit être vide.")
            if (Guard.isEmpty(this.props.unit).succeeded) throw new EmptyStringError("L'unié de la measure ne doit être vide .")
            if (!this.props.initialValue || Guard.isNegative(this.props.initialValue as number).succeeded) throw new NegativeValueError("La valeur initial standard ne doit être négative.")
            if (!this.props.targetValue || Guard.isNegative(this.props.targetValue as number).succeeded) throw new NegativeValueError("La valeur a atteindre standard ne doit être négative.")
        }
        this._isValid = true

    }
    static create(createStandardObjectiveProps: CreateStandardObjectiveProps): Result<StandardObjective> {
        try {
            const timeframe = Timeframe.create(createStandardObjectiveProps.timeframe)
            if (timeframe.isFailure) return Result.fail<StandardObjective>("Erreur de la creation de l'objectif standard du a l'intervalle de temps.")
            const standardObjective = new StandardObjective(
                {
                    props: {
                        name: createStandardObjectiveProps.name,
                        type: createStandardObjectiveProps.type as ObjectiveType,
                        defaultRecommendation: createStandardObjectiveProps.defaultRecommendation,
                        timeframe: timeframe.val,
                        measureCode: createStandardObjectiveProps.measureCode,
                        initialValue: createStandardObjectiveProps.initialValue
                        ,
                        targetValue: createStandardObjectiveProps.targetValue,
                        unit: createStandardObjectiveProps.unit,
                        description: createStandardObjectiveProps.description
                    }
                }
            )
            return Result.ok<StandardObjective>(standardObjective)
        } catch (error) {
            return error instanceof ExceptionBase
                ? Result.fail<StandardObjective>(`[${error.code}]:${error.message}`)
                : Result.fail<StandardObjective>(`Erreur inattendue. ${StandardObjective?.constructor.name}`);

        }

    }
}