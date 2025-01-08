import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const sites = [
    {
      id: 'site-677cdebef2b430696feb1462',
      code: 'HO',
      name: 'Head Office',
    },
    {
      id: 'site-677cd97e31d228fae0a77794',
      code: 'SKL',
      name: 'Singkil Seed Production',
    },
    {
      id: 'site-677cdc6955251740ef2de44b',
      code: 'SRH',
      name: 'Sei Rampah Seed Production',
    },
  ];

  for await (const item of sites) {
    await prisma.master_sites.upsert({
      where: { code: item.code },
      update: {},
      create: {
        id: item.id,
        code: item.code,
        name: item.name,
      },
    });
  }

  const accountPositions = [
    {
      id: 'accountposition-677cdcb95dfb285987fc6426',
      code: 'ADM',
      name: 'Administrator System',
      level: 0,
    },
    {
      id: 'accountposition-677cdc5a3f7f4a6e4fcc6ded',
      code: 'PD',
      name: 'President Director',
      level: 1,
    },
    {
      id: 'accountposition-677cdcbec1b688efc759bd81',
      code: 'SRHMGR',
      name: 'Site Manager',
      level: 2,
    },
  ];

  for await (const item of accountPositions) {
    await prisma.master_account_positions.upsert({
      where: { code: item.code },
      update: {},
      create: {
        id: item.id,
        code: item.code,
        name: item.name,
        level: item.level,
      },
    });
  }

  const accounts = [
    {
      id: 'account-677cde49766851b0fd8a550c',
      code: 'ADM001',
      email: 'admin@ipss.com',
      fullname: 'Administrator',
      head_id: null,
      position_id: 'accountposition-677cdcb95dfb285987fc6426',
      site_id: 'site-677cdebef2b430696feb1462',
    },
    {
      id: 'account-677cdee700eeb4061131ff0d',
      code: 'PD01',
      email: 'pd01@ipss.com',
      fullname: 'Hendry Tan',
      head_id: null,
      position_id: 'accountposition-677cdc5a3f7f4a6e4fcc6ded',
      site_id: 'site-677cdebef2b430696feb1462',
    },
    {
      id: 'account-677cf4f342e445fcb064b60d',
      code: 'SRMGR01',
      email: 'zikri@ipss.com',
      fullname: 'Zikri Santoso',
      head_id: 'account-677cdee700eeb4061131ff0d',
      position_id: 'accountposition-677cdcbec1b688efc759bd81',
      site_id: 'site-677cdc6955251740ef2de44b',
    },
  ];

  for await (const item of accounts) {
    const hashedPassword = await bcrypt.hash('password1234', 10);

    await prisma.accounts.upsert({
      where: { email: item.email },
      update: {},
      create: {
        id: item.id,
        code: item.code,
        email: item.email,
        fullname: item.fullname,
        password: hashedPassword,
        head_id: item.head_id,
        position_id: item.position_id,
        site_id: item.site_id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
