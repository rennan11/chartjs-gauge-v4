import { ArcElement, Chart } from 'chart.js';

import GaugeController from './controllers/controller.gauge';

export * from './controllers/controller.gauge';

Chart.register(GaugeController);
Chart.register(ArcElement);
