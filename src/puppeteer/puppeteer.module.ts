import { Module } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PuppeteerService, PrismaService],
})
export class PuppeteerModule {}
