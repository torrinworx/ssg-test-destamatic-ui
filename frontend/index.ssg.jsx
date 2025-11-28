import App from './App';
import { render } from 'destamatic-ui';

// TODO: Make render => mount, single function for both ssg and regular app stuff.
export function renderAppToString() {
  return render(App);
};
