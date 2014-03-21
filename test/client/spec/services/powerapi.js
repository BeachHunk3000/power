'use strict';

describe('Service: Powerapi', function () {

  // load the service's module
  beforeEach(module('powerApp'));

  // instantiate service
  var Powerapi;
  beforeEach(inject(function (_Powerapi_) {
    Powerapi = _Powerapi_;
  }));

  it('should do something', function () {
    expect(!!Powerapi).toBe(true);
  });

});
