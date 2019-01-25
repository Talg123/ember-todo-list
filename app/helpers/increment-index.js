import { helper } from '@ember/component/helper';

export function incrementIndex(params/*, hash*/) {
  return parseInt(params)+1;
}

export default helper(incrementIndex);
