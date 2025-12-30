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
  response: IJobRelation[];
}
export interface IJobRelation {
  quoteJobRelationId: number;
  job: IJobs;
  quote: IQuotes;
}
export interface IJobRelationCreate {
  quoteJobRelationId?: number;
  jobId: number;
  quoteId: number;
}
