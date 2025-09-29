#!/usr/bin/env node

/**
 * Script para verificar se o backend está disponível antes do build
 * Verifica o endpoint /api/health
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Função para ler variáveis de ambiente
function loadEnvVars() {
    try {
        const envPath = join(__dirname, '../.env');
        const envContent = readFileSync(envPath, 'utf8');
        const envVars = {};

        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                envVars[key.trim()] = value.trim();
            }
        });

        return envVars;
    } catch (error) {
        console.warn('⚠️  Arquivo .env não encontrado, usando variáveis padrão');
        return {};
    }
}

// Carregar variáveis de ambiente
const envVars = loadEnvVars();

// URL do backend - tenta pegar do .env ou usa padrão
const BACKEND_URL = envVars.VITE_API_URL || envVars.REACT_APP_API_URL

const HEALTH_ENDPOINT = `${BACKEND_URL}/api/health`;
const TIMEOUT = 10000; // 10 segundos

console.log('🔍 Verificando saúde do backend...');
console.log(`📡 URL: ${HEALTH_ENDPOINT}`);

async function checkBackendHealth() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

        const response = await fetch(HEALTH_ENDPOINT, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json().catch(() => ({}));
            console.log('✅ Backend está funcionando!');
            console.log(`📊 Status: ${response.status}`);

            if (data.status) {
                console.log(`🏥 Health Status: ${data.status}`);
            }

            if (data.timestamp) {
                console.log(`⏰ Timestamp: ${data.timestamp}`);
            }

            console.log('🚀 Prosseguindo com o build...\n');
            process.exit(0);
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Falha na verificação do backend!');

        if (error.name === 'AbortError') {
            console.error(`⏱️  Timeout após ${TIMEOUT / 1000} segundos`);
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.error('🔌 Não foi possível conectar ao servidor');
        } else {
            console.error(`🐛 Erro: ${error.message}`);
        }

        console.error('\n💡 Possíveis soluções:');
        console.error('   • Verifique se o backend está rodando');
        console.error('   • Confirme a URL no arquivo .env');
        console.error('   • Verifique sua conexão com a internet');
        console.error('   • Aguarde alguns minutos se o serviço estiver inicializando\n');

        // Verificar se deve falhar o build ou apenas avisar
        const shouldFailBuild = process.env.FAIL_ON_HEALTH_CHECK !== 'false';

        if (shouldFailBuild) {
            console.error('🛑 Build cancelado devido à falha na verificação de saúde');
            console.error('   Para ignorar esta verificação, defina FAIL_ON_HEALTH_CHECK=false\n');
            process.exit(1);
        } else {
            console.warn('⚠️  Continuando build apesar da falha na verificação de saúde\n');
            process.exit(0);
        }
    }
}

// Executar verificação
checkBackendHealth();
