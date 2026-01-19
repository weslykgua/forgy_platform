#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const projectRoot = path.join(__dirname, '..');

console.log(`
╔═══════════════════════════════════════════╗
║        🚀 FORGY PLATFORM LAUNCHER         ║
╚═══════════════════════════════════════════╝
`);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runCommand(command, args, cwd = projectRoot, showOutput = false) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: showOutput ? 'inherit' : 'pipe',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Comando falló: ${code}`));
    });
  });
}

function checkInstalled() {
  const backendNodeModules = path.join(projectRoot, 'forgy_backend_api', 'node_modules');
  const mobileNodeModules = path.join(projectRoot, 'forgy_mobile_app', 'node_modules');
  const envFile = path.join(projectRoot, 'forgy_backend_api', '.env');
  
  return fs.existsSync(backendNodeModules) && 
         fs.existsSync(mobileNodeModules) &&
         fs.existsSync(envFile);
}

function checkDocker() {
  return new Promise((resolve) => {
    exec('docker --version', (error) => {
      if (error) {
        console.error('❌ Docker no está instalado o no está corriendo');
        console.error('💡 Instala Docker Desktop: https://www.docker.com/products/docker-desktop/');
        process.exit(1);
      }
      resolve();
    });
  });
}

function createEnvFile() {
  const envPath = path.join(projectRoot, 'forgy_backend_api', '.env');
  
  if (fs.existsSync(envPath)) {
    return;
  }
  
  const envContent = `DATABASE_URL="postgresql://forgy_user:forgy_password@localhost:5432/forgy_db?schema=public"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado');
}

async function firstTimeSetup() {
  console.log(`
🎉 PRIMERA VEZ DETECTADA - Configurando proyecto...

Esto tomará unos minutos. Paciencia... ☕
`);

  try {
    // 1. Instalar dependencias
    console.log('📦 [1/6] Instalando dependencias...');
    await runCommand('npm', ['install']);
    await runCommand('npm', ['install'], path.join(projectRoot, 'forgy_backend_api'));
    await runCommand('npm', ['install'], path.join(projectRoot, 'forgy_mobile_app'));
    console.log('✅ Dependencias instaladas\n');
    
    // 2. Crear .env
    console.log('⚙️  [2/6] Configurando variables de entorno...');
    createEnvFile();
    console.log('');
    
    // 3. Verificar Docker
    console.log('🐳 [3/6] Verificando Docker...');
    await checkDocker();
    console.log('✅ Docker disponible\n');
    
    // 4. Levantar PostgreSQL
    console.log('🗄️  [4/6] Iniciando PostgreSQL...');
    await runCommand(
      'docker',
      ['compose', 'up', 'postgres', '-d'],
      path.join(projectRoot, 'forgy_backend_api')
    );
    console.log('✅ PostgreSQL iniciado');
    console.log('⏳ Esperando 5 segundos...\n');
    await sleep(5000);
    
    // 5. Configurar Prisma
    console.log('⚙️  [5/6] Configurando Prisma ORM...');
    await runCommand(
      'npx',
      ['prisma', 'generate'],
      path.join(projectRoot, 'forgy_backend_api')
    );
    await runCommand(
      'npx',
      ['prisma', 'migrate', 'deploy'],
      path.join(projectRoot, 'forgy_backend_api')
    );
    console.log('✅ Prisma configurado\n');
    
    // 6. Migrar datos
    console.log('📊 [6/6] Migrando datos de ejemplo...');
    await runCommand(
      'npm',
      ['run', 'migrate:data'],
      path.join(projectRoot, 'forgy_backend_api'),
      true
    );
    console.log('');
    
    console.log(`
╔═══════════════════════════════════════════╗
║      ✅ CONFIGURACIÓN COMPLETADA          ║
╚═══════════════════════════════════════════╝

Iniciando aplicación...
`);
    
  } catch (error) {
    console.error('\n❌ Error en setup:', error.message);
    console.error('\n💡 Intenta ejecutar manualmente:');
    console.error('   1. npm install');
    console.error('   2. cd forgy_backend_api && npm install');
    console.error('   3. Verifica que Docker esté corriendo');
    process.exit(1);
  }
}

function startPostgres() {
  return new Promise((resolve, reject) => {
    exec('docker ps -q -f name=forgy-postgres', async (error, stdout) => {
      if (stdout.trim()) {
        console.log('✅ PostgreSQL ya está corriendo\n');
        resolve();
      } else {
        console.log('🗄️  Iniciando PostgreSQL...');
        try {
          await runCommand(
            'docker',
            ['compose', 'up', 'postgres', '-d'],
            path.join(projectRoot, 'forgy_backend_api')
          );
          console.log('✅ PostgreSQL iniciado');
          console.log('⏳ Esperando 3 segundos...\n');
          await sleep(3000);
          resolve();
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}

function checkPrisma() {
  const prismaClientPath = path.join(
    projectRoot,
    'forgy_backend_api',
    'node_modules',
    '.prisma',
    'client'
  );
  
  if (!fs.existsSync(prismaClientPath)) {
    console.log('⚙️  Generando Prisma Client...');
    return runCommand(
      'npx',
      ['prisma', 'generate'],
      path.join(projectRoot, 'forgy_backend_api')
    ).then(() => {
      console.log('✅ Prisma Client generado\n');
    });
  }
  
  console.log('✅ Prisma Client OK\n');
  return Promise.resolve();
}

function startApps() {
  console.log(`
╔═══════════════════════════════════════════╗
║         🎯 INICIANDO SERVICIOS            ║
╚═══════════════════════════════════════════╝
`);
  
  // Usar concurrently de forma compatible con Windows
  const concurrentlyPath = path.join(projectRoot, 'node_modules', '.bin', 'concurrently');
  const concurrentlyCmd = isWindows ? 'concurrently.cmd' : 'concurrently';
  
  const args = [
    '--names', 'API,MOBILE',
    '--prefix-colors', 'yellow,cyan',
    '"cd forgy_backend_api && npm run dev"',
    '"cd forgy_mobile_app && npm run dev"'
  ];
  
  const child = spawn(concurrentlyCmd, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true
  });
  
  child.on('close', (code) => {
    console.log(`\n👋 Aplicación cerrada (código: ${code})`);
    process.exit(code);
  });
  
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Deteniendo servicios...');
    child.kill('SIGINT');
    setTimeout(() => process.exit(0), 1000);
  });
}

async function main() {
  try {
    // Verificar si es primera vez
    const isFirstTime = !checkInstalled();
    
    if (isFirstTime) {
      await firstTimeSetup();
    } else {
      console.log('✅ Proyecto ya configurado\n');
    }
    
    // Verificar Docker
    await checkDocker();
    console.log('✅ Docker disponible');
    
    // Iniciar/verificar PostgreSQL
    await startPostgres();
    
    // Verificar Prisma
    await checkPrisma();
    
    // Iniciar aplicaciones
    startApps();
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Soluciones:');
    console.error('   • Verifica que Docker Desktop esté corriendo');
    console.error('   • Ejecuta: npm run reset');
    console.error('   • Ejecuta de nuevo: npm run dev');
    process.exit(1);
  }
}

main();