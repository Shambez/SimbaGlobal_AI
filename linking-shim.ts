import * as Linking from 'expo-linking';
if (typeof (Linking as any).getLinkingURL !== 'function') {
  (Linking as any).getLinkingURL = (path: string = '') => Linking.createURL(path);
}
