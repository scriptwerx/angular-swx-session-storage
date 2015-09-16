describe('$localStorage', function() {

  'use strict';

  var suite = this,
    cache = {};

  // Mock caching service
  suite.mockCachingService = {
    get: function (key) {
      return cache[key];
    },
    put: function (key, value) {
      cache[key] = value;
    },
    remove: function (key) {
      delete cache[key];
    },
    removeAll: function () {
      cache = {};
    },
    destroy: function() {
      cache = {};
    }
  };

  // Mock $cacheFactory
  suite.mockCacheFactory = function() {
    return suite.mockCachingService;
  };

  beforeEach(function() {

    module('swxSessionStorage');

    module(function($provide) {
      $provide.value('$cacheFactory', suite.mockCacheFactory);
    });

    inject(function($injector) {
      suite.service = $injector.get('$sessionStorage');
    });
  });

  describe('default values and methods', function() {

    it('should expose the following methods', function() {
      expect(suite.service.put).toBeFunction();
      expect(suite.service.get).toBeFunction();
      expect(suite.service.remove).toBeFunction();
      expect(suite.service.empty).toBeFunction();
    });

  });

  describe('prefix method', function() {

    beforeEach(function() {
      spyOn(suite.mockCachingService, 'destroy').and.callThrough();
      cache = {};
    });

    afterEach(function() {
      cache = {};
    });

    it('should set the prefix and destroy the existing cache', function() {
      suite.service.put('some_key', 'some_value');
      expect(suite.service.get('some_key')).toBe('some_value');

      suite.service.prefix('new_prefix');
      expect(suite.service.get('some_key')).toBe(void 0);

      expect(suite.mockCachingService.destroy).toHaveBeenCalled();
    });
  });

  describe('put method', function() {

    beforeEach(function() {
      spyOn(suite.mockCachingService, 'put').and.callThrough();
      cache = {};
    });

    afterEach(function() {
      cache = {};
    });

    it('should add to storage and return the value', function() {
      expect(suite.service.put('some_key', 'some_value')).toBe('some_value');
      expect(suite.mockCachingService.put).toHaveBeenCalledWith('some_key', { data: 'some_value' });
    });

    it('should add to storage with expiry of 10 minutes', function() {
      suite.service.put('some_key', 'some_value', 10);
      expect(cache['some_key'].data).toBe('some_value');
      expect(cache['some_key'].expires).toBeNumber();
    });
  });

  describe('get method', function() {

    beforeEach(function() {
      spyOn(suite.mockCachingService, 'get').and.callThrough();
      spyOn(suite.mockCachingService, 'remove').and.callThrough();
      cache = {};
    });

    afterEach(function() {
      cache = {};
    });

    it('should return the stored value from session cache', function() {

      suite.service.put('some_key', 'some_value');

      expect(suite.service.get('some_key')).toBe('some_value');
      expect(suite.mockCachingService.get).toHaveBeenCalledWith('some_key');
    });

    it('should return a false Boolean stored value from session cache correctly', function() {

      suite.service.put('some_key', false);

      expect(suite.service.get('some_key')).toBeDefined();
      expect(suite.service.get('some_key')).toBeFalse();
      expect(suite.mockCachingService.get).toHaveBeenCalledWith('some_key');
    });

    it('should retrieve item with expiry session cache if still valid', function() {
      suite.service.put('some_key', 'some_value', 1);
      expect(suite.service.get('some_key')).toBe('some_value');
    });

    it('should remove item with expiry from session cache if expired and return undefined', function() {
      suite.service.put('some_key', 'some_value', -1);
      expect(suite.service.get('some_key')).toBe(void 0);
      expect(suite.mockCachingService.remove).toHaveBeenCalledWith('some_key');
    });
  });

  describe('remove method', function() {

    beforeEach(function() {
      spyOn(suite.mockCachingService, 'remove').and.callThrough();
      cache = {};
    });

    afterEach(function() {
      cache = {};
    });

    it('should remove the stored value from session cache', function() {
      suite.service.put('some_key', 'some_value');
      expect(suite.service.get('some_key')).toBe('some_value');

      suite.service.remove('some_key');
      expect(suite.service.get('some_key')).toBe(void 0);

      expect(suite.mockCachingService.remove).toHaveBeenCalledWith('some_key');
    });
  });

  describe('empty method', function() {

    beforeEach(function() {
      spyOn(suite.mockCachingService, 'remove').and.callThrough();
    });

    it('should empty all stored values', function() {
      suite.service.put('some_key', 'some_value');
      expect(suite.service.get('some_key')).toBe('some_value');

      suite.service.empty();
      expect(suite.service.get('some_key')).toBe(void 0);
    });
  });

});