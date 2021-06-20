import { PluginCtx, PluginInterface, ExecutedOrder } from '@debut/types';
import { StatsInterface } from '@debut/plugin-stats';
// @ts-ignore
import log from 'log-beautify';

export function logPlugin(): PluginInterface {
    let ctx: PluginCtx;

    // Кастомные стили для логов
    // Цвета заливки
    log.setColors({
        headers_: '#ffffff',
    });
    // Цвета текста
    log.setTextColors({
        headers_: '#000000',
    });
    log.useSymbols = false;

    let stats: StatsInterface;
    let ordersCounter: number = 0;

    // Ширины колонок таблицы
    const cw = [6, 12, 10, 6, 12, 12, 16, 12, 12, 12, 10];

    let tableWidth: 0;
    cw.forEach((col) => {
        tableWidth += col;
    });

    return {
        name: 'log',

        onInit() {
            // @ts-ignore
            ctx = this;
            // @ts-ignore
            stats = this.findPlugin('stats');

            if (!stats) {
                throw `Debut Plugin Log: stats plugin is required!`;
            }
        },

        async onOpen(order) {
            printRow(order, 'Open');
        },

        async onClose(order, closing) {
            printRow(order, 'Close');
        },

        async onDispose() {
            // Вывод итогов
        },
    };

    function printRow(order: ExecutedOrder, direction: string) {
        ordersCounter++;
        if (ordersCounter % (process.stdout.rows - 1) === 1) {
            const headers =
                'NUM'.padStart(cw[0]) +
                'BOT'.padEnd(cw[1] - 1).padStart(cw[1] + 1) +
                'TICKER'.padEnd(cw[2]) +
                'TYPE'.padEnd(cw[3]) +
                'LOTS'.padStart(cw[4]) +
                'PRICE'.padStart(cw[5]) +
                'BALANCE'.padStart(cw[6]) +
                'PROFIT'.padStart(cw[7]) +
                'LOOSE'.padStart(cw[8]) +
                'COMMISSION'.padStart(cw[9]) +
                'STATUS'.padEnd(cw[10] - 1).padStart(cw[10] + 1);
            log.headers_(headers);
        }

        const report = stats.api.report();
        const commission = Math.round(order.commission.value * 100) / 100;

        const row =
            ordersCounter.toString().padStart(cw[0]) +
            ctx.debut.getName().padEnd(cw[1] - 1).padStart(cw[1] + 1) +
            order.ticker.padEnd(cw[2]) +
            order.type.padEnd(cw[3]) +
            order.lots.toString().padStart(cw[4]) +
            order.price.toString().padStart(cw[5]) +
            report.balance.toString().padStart(cw[6]) +
            report.profitProb.toString().padStart(cw[7]) +
            report.looseProb.toString().padStart(cw[8]) +
            commission.toString().padStart(cw[9]) +
            direction.padEnd(cw[10] - 1).padStart(cw[10] + 1);
        // ctx.debut.orders.length.toString().padStart(cw[8]);
        if (report.profitProb - order.commission.value >= report.looseProb) {
            log.success(row);
        } else {
            log.error(row);
        }
    }
}
