(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Layout, PluginWrapper;
    PluginWrapper = (function(_super) {

      __extends(PluginWrapper, _super);

      function PluginWrapper() {
        PluginWrapper.__super__.constructor.apply(this, arguments);
      }

      PluginWrapper.prototype.className = 'plugin-wrapper';

      PluginWrapper.prototype.initialize = function(args) {
        this.plugin = args.plugin;
        this.pluginName = args.name;
        this.init_state = args.init_state;
        if (args.init_state != null) {
          this.collapsed = args.init_state;
        } else {
          this.collapsed = true;
        }
        return this.render();
      };

      PluginWrapper.prototype.events = {
        'click .plugin-controls .header': 'close'
      };

      PluginWrapper.prototype.close = function(e) {
        if (this.collapsed) {
          this.collapsed = false;
          return this.expand(this.$el.find('.plugin-content'));
        } else {
          this.collapsed = true;
          return this.collapse(this.$el.find('.plugin-content'));
        }
      };

      PluginWrapper.prototype.expand = function(el) {
        el.slideDown(300);
        return this.$el.removeClass('collapsed');
      };

      PluginWrapper.prototype.collapse = function(el) {
        el.slideUp(300);
        return this.$el.addClass('collapsed');
      };

      PluginWrapper.prototype.render = function() {
        this.controls = $("<div class=\"plugin-controls\">\n  <div class=\"header\">\n    <span>" + this.pluginName + "</span>\n    <div class=\"arrow\"></div>\n  </div>\n</div>");
        this.content = $("<div class=\"plugin-content\"></div>");
        this.content.append(this.plugin);
        this.$el.append(this.controls);
        return this.$el.append(this.content);
      };

      return PluginWrapper;

    })(Backbone.View);
    return Layout = (function(_super) {

      __extends(Layout, _super);

      function Layout(options) {
        this.options = options;
        Layout.__super__.constructor.call(this, this.options);
      }

      Layout.prototype.init = function() {
        this.pluginWrappers = {};
        return this.render();
      };

      Layout.prototype.render = function() {
        this.pluginContainer = $("<div class=\"plugin-container\"/>");
        this.$el.append(this.pluginContainer);
        return this;
      };

      Layout.prototype.renderPlugins = function() {
        var keys,
          _this = this;
        keys = _.keys(this.pluginWrappers).sort();
        return _.each(keys, function(key, i) {
          var pluginWrappersList;
          pluginWrappersList = _this.pluginWrappers[key];
          return _.each(pluginWrappersList, function(pluginWrapper) {
            _this.pluginContainer.append(pluginWrapper.el);
            if (!pluginWrapper.init_state) {
              return pluginWrapper.collapse(pluginWrapper.$el.find('.plugin-content'));
            }
          });
        });
      };

      Layout.prototype.addCenter = function(el) {
        return this.$el.append(el);
      };

      Layout.prototype.addPlugin = function(plugin, pluginOrder, name, defaultView) {
        var pluginWrapper;
        if (name == null) name = "Plugin";
        if (pluginOrder == null) pluginOrder = Number.MAX_VALUE;
        pluginWrapper = new PluginWrapper({
          plugin: plugin,
          name: name,
          order: pluginOrder,
          init_state: defaultView
        });
        if (_.has(this.pluginWrappers, pluginOrder)) {
          this.pluginWrappers[pluginOrder].push(pluginWrapper);
        } else {
          this.pluginWrappers[pluginOrder] = [pluginWrapper];
        }
        return this.renderPlugins();
      };

      return Layout;

    })(Backbone.View);
  });

}).call(this);
