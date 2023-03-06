import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { personRoutes } from './modules/person/person-routes';

const routes = [personRoutes];

@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule],
})
export class AppRouterModule {}
