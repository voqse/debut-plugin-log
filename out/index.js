"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPlugin = void 0;
// @ts-ignore
const log_beautify_1 = __importDefault(require("log-beautify"));
function logPlugin() {
    let ctx;
    // Кастомные стили для логов
    // Цвета заливки
    log_beautify_1.default.setColors({
        headers_: '#ffffff',
    });
    // Цвета текста
    log_beautify_1.default.setTextColors({
        headers_: '#000000',
    });
    log_beautify_1.default.useSymbols = false;
    let stats;
    let ordersCounter = 0;
    // Ширины колонок таблицы
    const cw = [6, 12, 10, 6, 12, 12, 16, 12, 12, 12, 10];
    let tableWidth;
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
    function printRow(order, direction) {
        ordersCounter++;
        if (ordersCounter % (process.stdout.rows - 1) === 1) {
            const headers = 'NUM'.padStart(cw[0]) +
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
            log_beautify_1.default.headers_(headers);
        }
        const report = stats.api.report();
        const row = ordersCounter.toString().padStart(cw[0]) +
            ctx.debut.getName().padEnd(cw[1] - 1).padStart(cw[1] + 1) +
            order.ticker.padEnd(cw[2]) +
            order.type.padEnd(cw[3]) +
            order.lots.toString().padStart(cw[4]) +
            order.price.toString().padStart(cw[5]) +
            report.balance.toString().padStart(cw[6]) +
            report.profitProb.toString().padStart(cw[7]) +
            report.looseProb.toString().padStart(cw[8]) +
            order.commission.value.toString().padStart(cw[9]) +
            direction.padEnd(cw[10] - 1).padStart(cw[10] + 1);
        // ctx.debut.orders.length.toString().padStart(cw[8]);
        if (report.profitProb - order.commission.value >= report.looseProb) {
            log_beautify_1.default.success(row);
        }
        else {
            log_beautify_1.default.error(row);
        }
    }
}
exports.logPlugin = logPlugin;
//# sourceMappingURL=index.js.map