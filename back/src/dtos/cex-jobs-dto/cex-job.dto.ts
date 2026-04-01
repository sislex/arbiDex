export class CexJobDto {
  id?: number;
  jobType: string;
  description?: string;
  cex_pool_id: number;

  extraSettings?: string;
}
