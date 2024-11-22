import { Objective, IObjective } from "./../../domain";
import { Mapper, ObjectiveType, Timeframe, ITimeframe, ObjectiveStatus, CDate } from "@shared";
import { ObjectivePersistenceType } from "./../repositories/types";
import { ObjectiveDto } from "./../dtos/ObjectiveDto";
export class ObjectiveMapper implements Mapper<Objective, ObjectivePersistenceType, ObjectiveDto> {
   toPersistence(entity: Objective): ObjectivePersistenceType {
      return {
         id: entity.id,
         type: entity.type,
         timeframe: {
            start: entity.timeframe.start.toString(),
            end: entity.timeframe.end.toString(),
         },
         body: entity.isMeasure()
            ? {
                 measureTypeId: entity.measureTypeId,
                 value: entity.value,
                 description: entity.description,
              }
            : { description: entity.description },

         status: entity.status,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: ObjectivePersistenceType): Objective {
      const type = record.type as ObjectiveType;
      const timeframe = new Timeframe({ start: new CDate(record.timeframe.start), end: new CDate(record.timeframe.end) });
      const body = record.body;
      const status = record.status as ObjectiveStatus;
      const { id, createdAt, updatedAt } = record;
      return new Objective({
         id,
         createdAt,
         updatedAt,
         props: { type, timeframe, ...body, status } as IObjective,
      });
   }
   toResponse(entity: Objective): ObjectiveDto {
      return this.toPersistence(entity) as ObjectiveDto;
   }
}
