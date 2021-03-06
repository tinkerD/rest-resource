Polymer({
  is: 'rest-resource',

  properties: {

    /**
     * A pattern for the REST URL. Can contain colon-parameters and data bindings, for example:
     * 
     * `url="/users/:userId?q={{searchText}}"`
     * 
     * Default URLS:
     * 
     * <table>
     * <tr>
     * <th>Method</th>
     * <th>HTTP method</th>
     * <th>URL</th>
     * </tr>
     * <tr>
     * <td>index</td>
     * <td>GET</td>
     * <td>/users
     * <td> </tr>
     * <tr>
     * <td>show</td>
     * <td>GET</td>
     * <td>/users/1
     * <td> </tr>
     * <tr>
     * <td>create</td>
     * <td>POST</td>
     * <td>/users
     * <td> </tr>
     * <tr>
     * <td>update</td>
     * <td>PUT</td>
     * <td>/users
     * <td> </tr>
     * <tr>
     * <td>destroy</td>
     * <td>DELETE</td>
     * <td>/users/1
     * <td> </tr>
     * <tr>
     * <td>member foo</td>
     * <td>PUT</td>
     * <td>/users/1/foo
     * <td> </tr>
     * </table>
     * 
     */
    url: String,

    /**
     * A hash that binds URL parameters to actual values, for example:
     * 
     * `params='{{ {"userId":user.id} }}'`
     */
    params: Object,

    /**
     * Use this URL instead of the default one for "GET /resources" requests.
     */
    indexUrl: String,

    /**
     * Use this URL instead of the default one for "GET /resources/:id" requests.
     */
    showUrl: String,

    /**
     * Use this URL instead of the default one for "POST /resources" requests.
     */
    createUrl: String,

    /**
     * Use this URL instead of the default one for "PUT /resources/:id" requests.
     */
    updateUrl: String,

    /**
     * Use this URL instead of the default one for "DELETE /resources/:id" requests.
     */
    destroyUrl: String,

    /**
     * Use this URL instead of the default one for "PUT /resources/:id/action" requests.
     */
    memberUrl: String,

    /**
     * Set additional headers on the request.
     */
    headers: Object,

    /**
     * Set an authorization header with the specified token text.
     */
    token: Object
  },

  // Element Behavior

  /**
   * Is fired when a REST call is initiated.
   * 
   * @event request
   * @detail {{request: Object}}
   */

  /**
   * Is fired when a REST call returns successful response.
   * 
   * @event response
   * @detail {{request: Object, response: Object}}
   */

  /**
   * Is fired when a REST call returns failure response.
   * 
   * @event error
   * @detail {{request: Object, response: Object}}
   */

  _handleSuccess: function(request, successCallback) {
    var me = this;
    return function() {
      me.fire('response', {
        request: request,
        response: request.response
      });
      return typeof successCallback === 'function' ? successCallback(request.response, request) : void 0;
    };
  },

  _handleError: function(request, errorCallback) {
    var me = this;
    return function() {
      me.fire('error', {
        request: request,
        response: request.response
      });
      return typeof errorCallback === 'function' ? errorCallback(request.response, request) : void 0;
    };
  },

  _createRequest: function() {
    var me = this, request = document.createElement('iron-request');
    me.fire('request', {
      request: request
    });
    return request;
  },

  /**
   * The callback function to be invoked for successful response.
   * 
   * @callback successCallback
   * @param {Object}
   *          response
   * @param {Object}
   *          request
   */

  /**
   * The callback function to be invoked for failure response.
   * 
   * @callback errorCallback
   * @param {Object}
   *          response
   * @param {Object}
   *          request
   */

  /**
   * Performs a HTTP GET on the index URL and returns the response data.
   * 
   * @param {successCallback}
   *          successCallback - the callback function will be invoked with response data on successful response.
   * @param {errorCallback}
   *          errorCallback- the callback function will be invoked with response data on error response.
   */
  index: function(successCallback, errorCallback) {
    var me = this, request = me._createRequest();
    return request.send({
      url: me._prepareUrl(me.indexUrl || me.url, me.params),
      headers: me._prepareHeaders(),
      handleAs: 'json'
    }).then(me._handleSuccess(request, successCallback), me._handleError(request, errorCallback));
  },

  /**
   * Performs a HTTP GET on the show URL with the specified resource id and returns the response data.
   * 
   * @param {string}
   *          id - the id of the resource to be fetched.
   * @param {successCallback}
   *          successCallback - the callback function will be invoked with response data on successful response.
   * @param {errorCallback}
   *          errorCallback- the callback function will be invoked with response data on error response.
   */
  show: function(id, successCallback, errorCallback) {
    var me = this, request = me._createRequest();
    return request.send({
      url: me._prepareUrl(me.showUrl || me.url, me.params, id),
      headers: me._prepareHeaders(),
      handleAs: 'json'
    }).then(me._handleSuccess(request, successCallback), me._handleError(request, errorCallback));
  },

  /**
   * Performs a HTTP POST on the create URL with the specified resource data and returns the response data.
   * 
   * @param {Object}
   *          data - data for new resource to be created.
   * @param {successCallback}
   *          successCallback - the callback function will be invoked with response data on successful response.
   * @param {errorCallback}
   *          errorCallback- the callback function will be invoked with response data on error response.
   */
  create: function(data, successCallback, errorCallback) {
    var me = this, request = me._createRequest();
    return request.send({
      method: 'POST',
      url: me._prepareUrl(me.createUrl || me.url, me.params),
      headers: me._prepareHeaders(),
      body: JSON.stringify(data),
      handleAs: 'json'
    }).then(me._handleSuccess(request, successCallback), me._handleError(request, errorCallback));
  },

  /**
   * Performs a HTTP PUT on the update URL with the specified resource id and data and returns the response data.
   * 
   * @param {string}
   *          id - the id of the resource to be updated.
   * @param {Object}
   *          data - updated resource data.
   * @param {successCallback}
   *          successCallback - the callback function will be invoked with response data on successful response.
   * @param {errorCallback}
   *          errorCallback- the callback function will be invoked with response data on error response.
   */
  update: function(id, data, successCallback, errorCallback) {
    var me = this, request = me._createRequest();
    return request.send({
      method: 'PUT',
      url: me._prepareUrl(me.updateUrl || me.url, me.params, id),
      headers: me._prepareHeaders(),
      body: JSON.stringify(data),
      handleAs: 'json'
    }).then(me._handleSuccess(request, successCallback), me._handleError(request, errorCallback));
  },

  /**
   * Performs a HTTP DELETE on the destroy URL with the specified resource id and returns the response data.
   * 
   * @param {string}
   *          id - the id of the resource to be destroyed.
   * @param {successCallback}
   *          successCallback - the callback function will be invoked with response data on successful response.
   * @param {errorCallback}
   *          errorCallback- the callback function will be invoked with response data on error response.
   */
  destroy: function(id, successCallback, errorCallback) {
    var me = this, request = me._createRequest();
    return request.send({
      method: 'DELETE',
      url: me._prepareUrl(me.destroyUrl || me.url, me.params, id),
      headers: me._prepareHeaders(),
      handleAs: 'json'
    }).then(me._handleSuccess(request, successCallback), me._handleError(request, errorCallback));
  },

  /**
   * Performs a HTTP PUT on the member URL with "/action" appended to it and the specified resource id and returns the response data.
   * 
   * @param {string}
   *          id - the id of the resource on which a member action is to be performed.
   * @param {action}
   *          the url suffix for an action.
   * @param {successCallback}
   *          successCallback - the callback function will be invoked with response data on successful response.
   * @param {errorCallback}
   *          errorCallback- the callback function will be invoked with response data on error response.
   */
  memberAction: function(id, action, successCallback, errorCallback) {
    var me = this, request = me._createRequest();
    return request.send({
      method: 'PUT',
      url: me._prepareUrl(me.memberUrl || me.url, me.params, id, action),
      headers: me._prepareHeaders(),
      handleAs: 'json'
    }).then(me._handleSuccess(request, successCallback), me._handleError(request, errorCallback));
  },

  _prepareUrl: function(url, params, id, action) {
    var name, value;
    if (params === null) {
      params = {};
    }
    if (id === null) {
      id = null;
    }
    if (action === null) {
      action = null;
    }
    if (typeof params === 'string') {
      params = JSON.parse(params);
    }
    for (name in params) {
      value = params[name];
      if (typeof value === 'undefined' || value === null || '' === String(value).trim()) {
        continue;
      }
      if (-1 === url.indexOf('?')) {
        url = url + '?' + name + '=' + value;
      } else {
        url = url + '&' + name + '=' + value;
      }
    }
    url = url.replace(':id', id || '');
    url = url.replace(/\/\/+/g, '/');
    url = url.replace(/^(\w+):\//, '$1://');
    url = url.replace(/\/$/, '');
    if (action) {
      url += '/' + action;
    }
    return url;
  },

  _prepareHeaders: function() {
    var h, key, val, _ref;
    h = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    _ref = this.headers;
    for (key in _ref) {
      val = _ref[key];
      h[key] = val;
    }
    if (this.token) {
      h.Authorization = this.token;
    }
    return h;
  }
});
