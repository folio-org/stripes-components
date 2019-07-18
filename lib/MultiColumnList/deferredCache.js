export default class Cache {
  constructor(fillerItem, baseIndex = null, baseAmount = null) {
    this.baseIndex = baseIndex;
    this.baseAccum = baseAmount;
    this.highestAccum = null;
    this.highestAccumIndex = null;
    this.lowestAccum = null;
    this.lowestAccumIndex = null;
    this.fillerItem = fillerItem; // used for estimation on large, contiguous sets of non-present rows.
    this.cache = {};
    this.requests = {};
    this.accumRequests = {};
    this.length = 0;
  }

  set = (index, value) => {
    this.cache[index] = value;
    this.length += 1;
    if (this.requests[index]) {
      this.requests[index](value);
      delete this.requests[index];
    }
    if (Object.keys(this.accumRequests).length > 0) {
      // let n = this.highestAccumIndex || parseInt(Object.keys(this.cache)[0], 10);
      let n = this.highestAccumIndex || this.baseIndex;
      let accum = this.highestAccum || this.baseAccum || null;
      while (this.cache[n]) {
        if (this.accumRequests[n]) {
          this.accumRequests[n]({ result: accum, estimate: false });
          delete this.accumRequests[n];
        }
        accum += this.cache[n];
        n += 1;
      }
      if (this.accumRequests[n]) {
        this.accumRequests[n]({ result: accum, estimate: false });
      }
      n = this.lowestAccumindex || this.baseIndex;
      accum = this.lowestAccum || this.baseAccum || null;
      while (this.cache[n]) {
        if (this.accumRequests[n]) {
          this.accumRequests[n]({ result: accum, estimate:false });
          delete this.accumRequests[n];
        }
        accum -= this.cache[n];
        n -= 1;
      }
    }
  };

  // eslint... react/no-this-in-sfc triggers here since it returns null, but this is not an sfc....
  /* eslint-disable react/no-this-in-sfc  */
  request = (index, cb) => {
    if (this.cache[index] >= 0) {
      return cb ? cb(this.cache[index]) : this.cache[index];
    } else if (cb) {
      this.requests[index] = cb;
    }
    return null;
  };

  // accumulate in respect to a certain index/amount
  requestAccumulated = (index, cb) => {
    let n = this.baseIndex;
    if (index < n) {
      let currentLowAccum = this.lowestAccum || this.baseAccum;
      if (this.lowestAccum !== null) {
        n = this.lowestAccumIndex;
      }

      // backward accumulation requires all keys between index and base to be filled...
      let isLowEstimate = false;
      while (n > index) {
        n -= 1;
        if (this.cache[n]) {
          currentLowAccum -= this.cache[n];
        } else {
          currentLowAccum -= this.fillerItem;
          isLowEstimate = true;
        }
      }

      if (!isLowEstimate) {
        if (currentLowAccum < this.lowestAccum) {
          this.lowestAccum = currentLowAccum;
          this.lowestAccumIndex = index;
        }
      } else if (cb) {
        this.accumRequests[index] = cb;
      }

      return cb ? cb({ result: currentLowAccum, estimate: isLowEstimate }) : currentLowAccum;
    } else {
      let currentHighAccum = this.highestAccum || this.baseAccum;
      if (this.highestAccum !== null) {
        n = this.highestAccumIndex;
      }

      let isEstimate = false;
      while (n < index) {
        if (this.cache[n]) {
          currentHighAccum += this.cache[n];
        } else {
          currentHighAccum += this.fillerItem;
          isEstimate = true;
        }
        n += 1;
      }

      if (!isEstimate) {
        if (currentHighAccum > this.highestAccum) {
          this.highestAccum = currentHighAccum;
          this.highestAccumIndex = index;
        }
      } else if (cb) {
        this.accumRequests[index] = cb;
      }

      return cb ? cb({ result:currentHighAccum, estimate: isEstimate }) : currentHighAccum;
    }
  }

  requestAccumulatedOld = (index, cb) => {
    // let n = this.highestAccumIndex || parseInt(Object.keys(this.cache)[0], 10) || this.startIndex || 0;
    // let accum = this.highestAccum || null;

    // an non-estimate accumulation requires all keys before the index parameter to be set.
    // while (this.cache[n] && n < index) {
    //   accum += this.cache[n];
    //   n += 1;
    // }


    // if we made it to the index, call the callback or return the accumulated amount.
    // if (accum === null && n === 0) {
    //   accum = 0;
    // }

    // for cases where startIndex > 0, the amounts have to be filled in with estimates (average)
    // if (this.startIndex > 0) {
    //   accum = (this.startIndex) * this.fillerItem;
    //   n = this.startIndex;
    //   while (this.cache[n] && n < index) {
    //     accum += this.cache[n];
    //     n += 1;
    //   }

    //   return cb ? cb({ result: accum, estimate: true }) : accum;
    // }
    // if all the values up to the index parameter are not filled, subscribe until we can accumulate successfully.

    // if (cb) {
    //   this.accumRequests[index] = cb;
    //   // const res = index * this.fillerItem + ((this.highestAccumIndex * this.fillerItem) - this.highestAccum);
    //   const res = (index - this.highestAccumIndex) * this.fillerItem + this.highestAccum;
    //   return cb({ result:res, estimate: true });
    // }
    // return null;
  } /* eslint-enable */

  findIndex = (func) => {
    const found = Object.keys(this.cache).find(k => func(this.cache[k]));
    return found ? parseInt(found, 10) : null;
  }

  forEach = (func) => {
    return Object.keys(this.cache).forEach(k => func(this.cache[k], k));
  };

  getIndexByPosition = (position, average) => {
    let currentAccum = this.highestAccum;
    let currentIndex = this.highestAccumIndex;
    if (position <= 0) return 0;
    if (this.highestAccum > position) {
      while (currentAccum > position) {
        currentIndex -= 1;
        currentAccum -= this.cache[currentIndex];
      }
    } else {
      while (currentAccum < position) {
        currentIndex += 1;
        currentAccum += average;
      }
    }
    return currentIndex;
  }

  clearCache = () => {
    this.cache = this.zeroSet ? { 0: 0 } : {};
    this.startIndex = this.zeroSet ? 0 : null;
    this.length = this.zeroSet ? 1 : 0;
  };

  clearRequests = () => {
    this.requests = {};
  }

  clearRequest = (index) => {
    delete this.requests[index];
  }

  clearAccumRequest = (index) => {
    delete this.accumRequests[index];
  }

  clearAccumRequests = () => {
    this.accumRequests = {};
    this.highestAccum = null;
    this.highestAccumIndex = null;
  }

  clearAll = () => {
    this.clearRequests();
    this.clearAccumRequests();
    this.clearCache();
  };

  rebase = (index, amount) => {
    this.baseIndex = index;
    this.baseAccum = amount;
    this.highestAccum = null;
    this.highestAccumIndex = null;
    this.lowestAccum = null;
    this.lowestAccumIndex = null;
    this.cache = {};
    this.length = 0;
  }
}
