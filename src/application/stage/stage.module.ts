import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageManifestHandler } from './commands/handlers/stage-manifest.handler';
import { StageStatsHandler } from './commands/handlers/stage-stats.handler';
import { SyncHandler } from './commands/handlers/sync.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { StagesController } from './controllers/stages.controller';
import { Manifest } from '../../domain/manifest.entity';
import { Stats } from '../../domain/stats.entity';
import { UpdateStatusHandler } from './commands/handlers/update-status.handler';
import { ManifestStagedHandler } from './events/handlers/manifest.staged.handler';
import { StatsStagedHanlder } from './events/handlers/stats.staged.hanlder';
import { GetManifestHandler } from './queries/handlers/get-manifest.handler';
import { GetStatsHandler } from './queries/handlers/get-stats.handler';
import { MessagingModule } from '../../infrastructure/messging/messaging.module';
import { ConfigModule } from '../../config/config.module';
import { MessagingService } from '../../infrastructure/messging/messaging.service';
import { StageMetricHandler } from './commands/handlers/stage-metric.handler';
import { Metric } from '../../domain/metric.entity';
import { MetricStagedHandler } from './events/handlers/metric.staged.handler';
import { GetMetricHandler } from './queries/handlers/get-metric.handler';

@Module({
  imports: [
    MessagingModule,
    ConfigModule,
    CqrsModule,
    TypeOrmModule.forFeature([Manifest, Stats, Metric]),
  ],
  // @ts-ignore
  providers: [
    StageManifestHandler,
    StageStatsHandler,
    StageMetricHandler,
    SyncHandler,
    UpdateStatusHandler,
    ManifestStagedHandler,
    StatsStagedHanlder,
    MetricStagedHandler,
    GetManifestHandler,
    GetStatsHandler,
    GetMetricHandler,
    MessagingService,
  ],
  controllers: [StagesController],
})
export class StageModule {}
