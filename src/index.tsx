import { NativeModules } from 'react-native';

type QuickBase64Type = {
  multiply(a: number, b: number): Promise<number>;
};

const { QuickBase64 } = NativeModules;

export default QuickBase64 as QuickBase64Type;
