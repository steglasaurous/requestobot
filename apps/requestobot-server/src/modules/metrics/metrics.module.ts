import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PrometheusModule.register({ customMetricPrefix: 'requestobot' })],
  exports: [PrometheusModule],
})
export class MetricsModule {}
