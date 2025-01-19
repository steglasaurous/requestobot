import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';
import { typeORMAppConfig } from '../../../typeorm.config';
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli';
import path from 'node:path';

@Command({
  name: 'load-fixtures',
})
export class LoadFixtures extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    const dataSource: DataSource = new DataSource(typeORMAppConfig);

    await dataSource.initialize();

    const loader = new Loader();
    // FIXME: Need to confirm this path
    loader.load(path.resolve('apps/requestobot-server/fixtures'));
    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(dataSource, new Parser(), false);

    for (const fixture of fixturesIterator(fixtures)) {
      console.log(`Loading fixture ${fixture.name}`);
      const entity: any = await builder.build(fixture);
      await dataSource.getRepository(fixture.entity).save(entity);
    }
    console.log('Fixtures loaded');
  }
}
