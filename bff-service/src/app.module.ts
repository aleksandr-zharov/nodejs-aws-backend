import {CacheModule, HttpModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';

@Module({
  imports: [ConfigModule.forRoot(), CacheModule.register({ttl : 120}), HttpModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
