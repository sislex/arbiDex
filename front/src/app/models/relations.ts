import {API} from './api';
import { IJobs, IPairs, IQuotes } from './db-config';

export interface IQuoteRelationsAPI extends API {
  response: IQuoteRelations[];
}
export interface IQuoteRelations {
  pairQuoteRelationId: number;
  pair: IPairs;
  quote: IQuotes;
}
export interface IQuoteRelationsCreate {
  pairQuoteRelationsId?: number;
  pairId: number;
  quoteId: number;
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
