import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
    Logger.log(`running in ${filePath}`);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      LIVESYNC_PORT: Joi.number().default(4777),
      STATS_RABBITMQ_HOST: Joi.string().default('amqp://localhost:5672/spot'),
      STATS_RABBITMQ_USER: Joi.string().default('guest'),
      STATS_RABBITMQ_PASS: Joi.string().default('guest'),
      STATS_RABBITMQ_QUEUE: Joi.string().default('stats_queue'),
      GLOBE_RABBITMQ_HOST: Joi.string().default('amqp://localhost:5672/spot'),
      GLOBE_RABBITMQ_USER: Joi.string().default('guest'),
      GLOBE_RABBITMQ_PASS: Joi.string().default('guest'),
      GLOBE_RABBITMQ_QUEUE: Joi.string().default('globe_queue'),
      LIVESYNC_DB_TYPE: Joi.string().default('mssql'),
      LIVESYNC_DB_HOST: Joi.string().default('localhost'),
      LIVESYNC_DB_PORT: Joi.number().default(1433),
      LIVESYNC_DB_USER: Joi.string().default('sa'),
      LIVESYNC_DB_PASS: Joi.string().default('M@un1983'),
      LIVESYNC_DB_NAME: Joi.string().default('livesync'),
      LIVESYNC_DB_SYNC: Joi.boolean().default(true),
      LIVESYNC_MONGODB_URI: Joi.string().default(
        'mongodb://localhost/dwapiStats',
      ),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get Port(): number {
    return Number(this.envConfig.LIVESYNC_PORT);
  }

  get QueueHost(): string {
    return String(this.envConfig.STATS_RABBITMQ_HOST);
  }

  get QueueUser(): string {
    return String(this.envConfig.STATS_RABBITMQ_USER);
  }

  get QueuePassword(): string {
    return String(this.envConfig.STATS_RABBITMQ_PASS);
  }

  get QueueName(): string {
    return String(this.envConfig.STATS_RABBITMQ_QUEUE);
  }

  get QueueGlobeHost(): string {
    return String(this.envConfig.GLOBE_RABBITMQ_HOST);
  }

  get QueueGlobeUser(): string {
    return String(this.envConfig.GLOBE_RABBITMQ_USER);
  }

  get QueueGlobePassword(): string {
    return String(this.envConfig.GLOBE_RABBITMQ_PASS);
  }

  get QueueGlobleName(): string {
    return String(this.envConfig.GLOBE_RABBITMQ_QUEUE);
  }

  get DatabaseType(): string {
    return String(this.envConfig.LIVESYNC_DB_TYPE);
  }
  get DatabaseHost(): string {
    return String(this.envConfig.LIVESYNC_DB_HOST);
  }
  get DatabasePort(): number {
    return Number(this.envConfig.LIVESYNC_DB_PORT);
  }
  get DatabaseUser(): string {
    return String(this.envConfig.LIVESYNC_DB_USER);
  }
  get DatabasePass(): string {
    return String(this.envConfig.LIVESYNC_DB_PASS);
  }
  get DatabaseName(): string {
    return String(this.envConfig.LIVESYNC_DB_NAME);
  }
  get DatabaseSync(): boolean {
    return Boolean(this.envConfig.LIVESYNC_DB_SYNC);
  }

  get Database(): string {
    return String(this.envConfig.LIVESYNC_MONGODB_URI);
  }

  get QueueConfig(): any {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.QueueHost],
        queue: this.QueueName,
        user: this.QueueUser,
        pass: this.QueuePassword,
        queueOptions: { durable: true },
      },
    };
  }
}