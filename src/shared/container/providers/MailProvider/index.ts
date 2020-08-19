import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  // Estamos pedindo para o tsyringe nos fornecer uma instancia de um MailProvider
  // pois MailProvider provider possui também, uma instância fornecida por injeção de dependencias
  // container.resolve(EtherealMailProvider),
  providers[mailConfig.driver],
);
