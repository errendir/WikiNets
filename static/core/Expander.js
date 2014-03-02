// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Expander;
    return Expander = (function(_super) {
      __extends(Expander, _super);

      function Expander(options) {
        this.options = options;
        this.expandSelection = __bind(this.expandSelection, this);
        Expander.__super__.constructor.call(this);
      }

      Expander.prototype.init = function(instances) {
        _.extend(this, Backbone.Events);
        this.graphView = instances['GraphView'];
        this.linkFilter = this.graphView.getLinkFilter();
        this.graphModel = instances['GraphModel'];
        this.dataProvider = instances["local/WikiNetsDataProvider"];
        this.loading = false;
        this.graphView.on("enter:node:mouseover", function(d) {
          if (!this.loading) {
            return $('#toplink-instructions').replaceWith('<span id="toplink-instructions" style="color:black; font-size:20px">Right-click to find connections.</span>');
          }
        });
        this.graphView.on("enter:node:mouseout", (function(_this) {
          return function(d) {
            if (!_this.loading) {
              return $('#toplink-instructions').replaceWith('<span id="toplink-instructions" style="color:black; font-size:20px"></span>');
            }
          };
        })(this));
        return this.graphView.on("enter:node:rightclick", (function(_this) {
          return function(d) {
            return _this.expandSelection(d);
          };
        })(this));
      };

      Expander.prototype.expandSelection = function(d) {
        this.loading = true;
        $('#toplink-instructions').replaceWith('<span id="toplink-instructions" style="color:black; font-size:20px">Loading...</span>');
        return this.dataProvider.getLinkedNodes([d], (function(_this) {
          return function(nodes) {
            _.each(nodes, function(node) {
              if (_this.dataProvider.nodeFilter(node)) {
                return _this.graphModel.putNode(node);
              }
            });
            $('#toplink-instructions').replaceWith('<span id="toplink-instructions" style="color:black; font-size:20px"></span>');
            return _this.loading = false;
          };
        })(this));
      };

      return Expander;

    })(Backbone.View);
  });

}).call(this);
