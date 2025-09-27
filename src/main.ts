import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import hbs from 'hbs';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // укажем путь к /public (если понадобятся стили/иконки)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerHelper('formatBase18', (v: any) =>
    (Number(v ?? 0) / 1e18).toFixed(4),
  );
  hbs.registerHelper('ms', (v: any) => `${v ?? ''} ms`);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
