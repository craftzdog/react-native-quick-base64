import { TurboModuleRegistry, type TurboModule } from 'react-native'

export interface Spec extends TurboModule {
  base64FromArrayBuffer(buf: Object, urlSafe: boolean): string
  base64ToArrayBuffer(b64: string, removeLinebreaks: boolean): Object
}

export default TurboModuleRegistry.getEnforcing<Spec>('QuickBase64')
