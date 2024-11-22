import { AggregateID, ArgumentOutOfRangeException, ExceptionBase, Result, ValueObject } from "@shared";
export interface ICurrentGoal {
   goalId: AggregateID;
   goalRules: string[]; // TODO: les regles doit etre modeliser avec soins plus tart : Les regles doit etre des instances de recommandation 
}
export class CurrentGoal extends ValueObject<ICurrentGoal> {
   protected validate(props: ICurrentGoal): void {
      if (props.goalRules.length < 1) throw new ArgumentOutOfRangeException("l'objectif doit avoir au moins une règle");
   }
   static create(props: ICurrentGoal): Result<CurrentGoal> {
      try {
         const goal = new CurrentGoal(props);
         return Result.ok<CurrentGoal>(goal);
      } catch (error) {
         return error instanceof ExceptionBase
            ? Result.fail<CurrentGoal>(`[${error.code}]:${error.message}`)
            : Result.fail<CurrentGoal>(`Erreur inattendue. ${CurrentGoal?.constructor.name}`);
      }
   }
}
