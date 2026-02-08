import {API} from './api';
import { IJobs } from './db-config';

export interface IQuoteRelationsAPI extends API {
  response: IQuoteRelations[];
}
export interface IQuoteRelations {
  pairQuoteRelationId: number;
  pairId: number;
  quoteId?: number;
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
  quote: IQuoteRelations;
}

export interface IJobRelationCreate {
  quoteJobRelationId?: number;
  jobId: number;
  quoteRelationId: number;
}
