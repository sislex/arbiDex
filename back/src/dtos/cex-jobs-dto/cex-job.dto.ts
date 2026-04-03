export class CexJobDto {
  id?: number;
  job_type: string;
  description?: string;
  cex_pair_id: number;

  extraSettings?: string;
}
