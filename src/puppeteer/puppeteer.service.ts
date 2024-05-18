import { Injectable, OnModuleInit } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PuppeteerService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}
  async onModuleInit() {
    await this.scrapperPuppeteer();
  }

  async scrapperPuppeteer() {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        // '--disable-web-security',
        '--no-sandbox',
        // '--disable-web-security',
        // '--aggressive-cache-discard',
        // '--disable-cache',
        // '--disable-application-cache',
        // '--disable-offline-load-stale-cache',
        // '--disk-cache-size=0',
        // '--disable-background-networking',
        // '--disable-default-apps',
        // '--disable-extensions',
        // '--disable-sync',
        // '--disable-translate',
        // '--hide-scrollbars',
        // '--metrics-recording-only',
        // '--mute-audio',
        // '--no-first-run',
        // // '--safebrowsing-disable-auto-update',
        // '--ignore-certificate-errors',
        // '--ignore-ssl-errors',
        // '--ignore-certificate-errors-spki-list',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await page.goto('https://historicosblaze.com/blaze/doubles');

    let lastDataId = 0; // Armazena o último data-id que foi raspado

    while (true) {
      //   await page.waitForSelector(nextDivSelector);
      // Extraia os dados
      const data = await page.evaluate(() => {
        const divs = Array.from(document.querySelectorAll('div[data-id]'));
        return divs.map((div) => {
          const colorSpan = div.querySelector('.color-table');
          const numberSpan = div.querySelector('.number-table');
          const playersSpan = div.querySelector('.players-table');
          const minuteSpan = div.querySelector('.minute-table');
          const dateSpan = div.querySelector('.date-table');
          const redbetsSpan = div.querySelector('.redbets-table');
          const whitebetsSpan = div.querySelector('.whitebets-table');
          const blackbetsSpan = div.querySelector('.blackbets-table');
          const seedSpan = div.querySelector('.seed-table');

          return {
            id: div.getAttribute('data-id'),
            color: colorSpan ? colorSpan.textContent : null,
            number: numberSpan ? numberSpan.textContent : null,
            players: playersSpan ? playersSpan.textContent : null,
            minute: minuteSpan ? minuteSpan.textContent : null,
            date: dateSpan ? dateSpan.textContent : null,
            redbets: redbetsSpan ? redbetsSpan.textContent : null,
            whitebets: whitebetsSpan ? whitebetsSpan.textContent : null,
            blackbets: blackbetsSpan ? blackbetsSpan.textContent : null,
            seed: seedSpan ? seedSpan.textContent : null,
          };
        });
      });

      // Filtra os dados para incluir apenas as novas divs que foram adicionadas
      const newData = data.filter((item) => Number(item.id) > lastDataId);

      // Atualiza o último data-id raspado
      if (newData.length > 0) {
        lastDataId = Math.max(...newData.map((item) => Number(item.id)));
      }

      // Aqui você pode escrever o código para armazenar 'newData' no seu banco de dados

      console.log(newData);

      for (const item of newData) {
        const consultar = await this.prisma.historico.findUnique({
          where: {
            id: Number(item.id),
          },
        });
        if (!consultar) {
          await this.prisma.historico.create({
            data: {
              id: Number(item.id),
              cor: item.color,
              numero: Number(item.number),
              horaMinuto: item.minute,
              dia: item.date,
              apostasnoVermelho: item.redbets,
              apostasnoBranco: item.whitebets,
              apostanoPreto: item.blackbets,
            },
          });
        }
      }

      // Aguarde 30 segundos antes de raspar novamente

      await new Promise((resolve) => setTimeout(resolve, 5000));

      //   await page.close();
      //   await browser.close();
    }
  }
}
