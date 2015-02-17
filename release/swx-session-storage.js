/**
 * Angular-swx-session-storage - $sessionStorage service for use in your AngularJS applications.
 * @author Paul Massey, paul.massey@scriptwerx.io
 * @version v0.0.1
 * @build 0 - Tue Feb 17 2015 09:07:53 GMT+0000 (GMT)
 * @link http://www.scriptwerx.io
 * @license http://opensource.org/licenses/MIT
 */
(function(angular) {

  'use strict';

  /**
   * @ngdoc service
   * @name $sessionStorage
   *
   * @requires $cacheFactory
   *
   * @description Provides a key-value (string-object) session storage with expiry option (in minutes).
   *
   * @param {service} $cacheFactory The $cacheFactory service.
   *
   * @example
   * ```js
   * myApp.$inject = ['$sessionStorage'];
   * function myApp($sessionStorage) {
   *   // Your app code...
   * }
   *
   * angular
   *   .module('myApp', ['swxSessionStorage']);
   * ```
   *
   * @ngInject
   */
  function $sessionStorage ($cacheFactory) {

    var oneMinute = 60 * 1000,
      cache = $cacheFactory('session-cache'),
      service = this;

    /**
     * @ngdoc function
     * @name $sessionStorage.put
     * @methodOf $sessionStorage
     *
     * @description Add data to storage
     *
     * @param {string} key The key to store the data with.
     * @param {*} value The data to store.
     * [@param {number} expires] (expiry in minutes)
     */
    service.put = function(key, value) {

      var dataToStore = { data: value };

      if (arguments.length > 2 && angular.isNumber(arguments[2])) {
        dataToStore.expires = new Date().getTime() + (arguments[2] * oneMinute);
      }

      cache.put(key, dataToStore);
      return value;
    };

    /**
     * @ngdoc function
     * @name $sessionStorage.get
     * @methodOf $sessionStorage
     *
     * @description Get data from storage, will return from session cache if possible for greater performance.
     *
     * @param {String} key The key of the stored data to retrieve.
     * @returns {*} The value of the stored data or undefined.
     */
    service.get = function(key) {

      var item;

      if (cache.get(key)) {
        item = cache.get(key);
      }
      else {
        return void 0;
      }

      if (item.expires && item.expires < new Date().getTime()) {
        service.remove(key);
        return void 0;
      }

      return item.data;
    };

    /**
     * @ngdoc function
     * @name $sessionStorage.remove
     * @methodOf $sessionStorage
     *
     * @descriotion Remove data from storage.
     *
     * @param {String} key The key of the stored data to remove.
     */
    service.remove = function(key) {
      cache.remove(key);
    };

    /**
     * @ngdoc function
     * @name $sessionStorage.empty
     * @methodOf $sessionStorage
     *
     * @description Delete all data from session storage and cookie.
     */
    service.empty = function() {
      cache.removeAll();
    };
  }
  $sessionStorage.$inject = ['$cacheFactory'];

  /**
   * @ngdoc overview
   * @name Angular-swx-session-storage
   *
   * @description
   * $sessionService service for use in your AngularJS applications.
   *
   * Provides a key-value (string-object) session storage with expiry option (in minutes).
   */
  angular
    .module('swxSessionStorage', [])
    .service('$sessionStorage', $sessionStorage);

})(window.angular);