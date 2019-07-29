export default class dimensionCache {
  constructor(fillerItem, baseIndex = null, baseAmount = null) {
    this.baseAccumIndex = baseIndex;
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
    // if there's any accumulation requests, we want to clear any that we can,
    // so we go in both directions of baseIndex, accumulating and fullfilling until we reach an
    // empty spot in the cache.
    if (Object.keys(this.accumRequests).length > 0) {
      // let n = this.highestAccumIndex || parseInt(Object.keys(this.cache)[0], 10);
      let currentHighIndex = this.highestAccumIndex || this.baseAccumIndex;
      let currentHighAccum = this.highestAccum || this.baseAccum || null;
      while (this.cache[currentHighIndex]) {
        if (this.accumRequests[currentHighIndex]) {
          this.accumRequests[currentHighIndex]({ result: currentHighAccum, estimate: false });
          delete this.accumRequests[currentHighIndex];
        }
        currentHighAccum += this.cache[currentHighIndex];
        currentHighIndex += 1;
      }
      if (this.accumRequests[currentHighIndex]) {
        this.accumRequests[currentHighIndex]({ result: currentHighAccum, estimate: false });
      }

      let currentLowIndex = this.lowestAccumindex || this.baseAccumIndex;
      let currentLowAccum = this.lowestAccum || this.baseAccum || null;
      /* example - accumRequests contains request for 30...
      *  lowestAccumIndex == 32, lowestAccum = 1002.
      *  this.cache contains 32: 24..31: 48..30: 36...
      *  (31) 1002 - 48 = 954 ... (30) 954 - 36 = 918 ...
      *  accumRequests[30]({ result: 918, estimate: false });
      */
      while (this.cache[currentLowIndex]) {
        if (this.accumRequests[currentLowIndex]) {
          this.accumRequests[currentLowIndex]({ result: currentLowAccum, estimate: false });
          delete this.accumRequests[currentLowIndex];
        }
        currentLowIndex -= 1;
        currentLowAccum -= this.cache[currentLowIndex];
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
    let n = this.baseAccumIndex;
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

  findIndex = (func) => {
    const found = Object.keys(this.cache).find(k => func(this.cache[k]));
    return found ? parseInt(found, 10) : null;
  }

  forEach = (func) => {
    return Object.keys(this.cache).forEach(k => func(this.cache[k], k));
  };

  getIndexByPosition = (position, average) => {
    let currentAccum;
    let currentIndex;
    if (position <= 0) return 0;
    if (position >= this.baseAccum) {
      currentAccum = this.highestAccum || this.baseAccum;
      currentIndex = this.highestAccumIndex || this.baseAccumIndex;
      if (position < currentAccum) {
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
    } else {
      currentAccum = this.lowestAccum || this.baseAccum;
      currentIndex = this.lowestAccumIndex || this.baseAccumIndex;
      if (position > currentAccum) {
        while (currentAccum < position) {
          currentIndex += 1;
          currentAccum += this.cache[currentIndex];
        }
      } else {
        while (currentAccum > position) {
          currentIndex -= 1;
          currentAccum -= average;
        }
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
    this.baseAccumIndex = index;
    this.baseAccum = amount;
    this.highestAccum = null;
    this.highestAccumIndex = null;
    this.lowestAccum = null;
    this.lowestAccumIndex = null;
    this.cache = {};
    this.length = 0;
  }
}
