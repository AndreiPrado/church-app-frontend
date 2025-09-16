# Church App - Versão Mobile 📱

Seu projeto React agora está configurado para funcionar como um aplicativo móvel nativo usando **Ionic Capacitor**.

## 🚀 Como Funciona

O Capacitor empacota sua aplicação React em um container nativo, permitindo que ela rode como um app real no iOS e Android, mantendo 100% do seu código atual.

## 📋 Pré-requisitos

### Para Android:
- **Android Studio** instalado
- **Java Development Kit (JDK) 11+**
- **Android SDK** configurado

### Para iOS (apenas no macOS):
- **Xcode** instalado
- **CocoaPods** instalado (`sudo gem install cocoapods`)

## 🛠️ Comandos Disponíveis

### Desenvolvimento
```bash
# Build e sincronizar com as plataformas móveis
npm run mobile:build

# Abrir projeto Android no Android Studio
npm run mobile:android

# Abrir projeto iOS no Xcode (macOS apenas)
npm run mobile:ios

# Executar diretamente no dispositivo/emulador Android
npm run mobile:run:android

# Executar diretamente no dispositivo/emulador iOS
npm run mobile:run:ios
```

### Fluxo de Desenvolvimento
1. **Desenvolva normalmente** com `npm run dev`
2. **Teste as mudanças** no navegador
3. **Build para mobile** com `npm run mobile:build`
4. **Teste no dispositivo** com `npm run mobile:android` ou `npm run mobile:ios`

## 📱 Testando o App

### Android
1. Execute `npm run mobile:android`
2. O Android Studio abrirá automaticamente
3. Conecte um dispositivo Android ou use um emulador
4. Clique em "Run" no Android Studio

### iOS (macOS apenas)
1. Execute `npm run mobile:ios`
2. O Xcode abrirá automaticamente
3. Conecte um dispositivo iOS ou use o simulador
4. Clique em "Play" no Xcode

## 🔧 Configurações

### Personalizar o App
Edite o arquivo `capacitor.config.json` para:
- Alterar nome do app (`appName`)
- Alterar ID do pacote (`appId`)
- Configurar splash screen
- Adicionar plugins nativos

### Ícones e Splash Screen
1. Coloque seus ícones em `android/app/src/main/res/` (Android)
2. Coloque seus ícones em `ios/App/App/Assets.xcassets/` (iOS)
3. Use ferramentas como [Capacitor Assets](https://github.com/ionic-team/capacitor-assets) para gerar automaticamente

## 📦 Publicação nas Lojas

### Google Play Store (Android)
1. Build de produção: `npm run build && npx cap sync android`
2. No Android Studio: Build → Generate Signed Bundle/APK
3. Upload no Google Play Console

### App Store (iOS)
1. Build de produção: `npm run build && npx cap sync ios`
2. No Xcode: Product → Archive
3. Upload via Xcode Organizer

## 🔌 Plugins Úteis

Adicione funcionalidades nativas com plugins Capacitor:

```bash
# Câmera
npm install @capacitor/camera

# Geolocalização
npm install @capacitor/geolocation

# Notificações push
npm install @capacitor/push-notifications

# Compartilhamento
npm install @capacitor/share

# Armazenamento local
npm install @capacitor/preferences
```

## 🐛 Troubleshooting

### Problemas Comuns
- **Build falha**: Certifique-se que `npm run build` funciona primeiro
- **Android Studio não abre**: Verifique se está instalado e no PATH
- **iOS não funciona**: Precisa estar no macOS com Xcode instalado

### Logs de Debug
```bash
# Ver logs do Android
npx cap run android --livereload

# Ver logs do iOS
npx cap run ios --livereload
```

## 📚 Recursos Adicionais

- [Documentação Capacitor](https://capacitorjs.com/docs)
- [Plugins Capacitor](https://capacitorjs.com/docs/plugins)
- [Guia de Deployment](https://capacitorjs.com/docs/deployment)

---

**Parabéns! 🎉** Seu projeto React agora é também um aplicativo móvel nativo!
