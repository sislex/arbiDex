export class CexJobDto {
  id?: number;
  jobType: string;
  description?: string;
  cex_pair_id: number;

  extraSettings?: string;
}
