import {API} from './api';
import { IJobs, IPairs } from './db-config';

export interface IQuoteRelationsAPI extends API {
  response: IPairRelations[];
}
export interface IQuoteRelation {
  jobBotsRelationsId: number;
  pair: IPairs;
  job: IJobs;
}
export interface IQuoteRelationCreate {
  jobBotsRelationsId: number;
  pairId: number;
  jobId: number;
}

export interface IJobRelationsAPI extends API {
  response: IPairRelations[];
}
export interface IPairRelations {
  jobBotsRelationsId: number;
  pair: IPairs;
  job: IJobs;
}
export interface IPairRelationsCreate {
  jobBotsRelationsId: number;
  pairId: number;
  jobId: number;
}
