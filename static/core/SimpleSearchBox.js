// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var SimpleSearchBox;
    return SimpleSearchBox = (function(_super) {
      __extends(SimpleSearchBox, _super);

      function SimpleSearchBox(options) {
        this.options = options;
        this.searchNodesSimple = __bind(this.searchNodesSimple, this);
        SimpleSearchBox.__super__.constructor.call(this);
      }

      SimpleSearchBox.prototype.init = function(instances) {
        this.graphModel = instances["GraphModel"];
        this.selection = instances["NodeSelection"];
        this.listenTo(instances["KeyListener"], "down:191", (function(_this) {
          return function(e) {
            _this.$("#searchBox").focus();
            return e.preventDefault();
          };
        })(this));
        this.render();
        $(this.el).attr('id', 'ssplug').appendTo($('#omniBox'));
        this.searchableKeys = {};
        return $.get("/get_all_node_keys", (function(_this) {
          return function(keys) {
            return _this.searchableKeys = keys;
          };
        })(this));
      };

      SimpleSearchBox.prototype.render = function() {
        var $button, $container, $searchBox;
        $container = $("<div id='visual-search-container'>").appendTo(this.$el);
        $searchBox = $('<input type="text" id="searchBox">').css("width", "235px").css("height", "25px").css("box-shadow", "2px 2px 4px #888888").css("border", "1px solid blue").appendTo($container);
        $button = $("<input type=\"button\" value=\"Go\" style='float:right' />").appendTo($container);
        $searchBox.keyup((function(_this) {
          return function(e) {
            if (e.keyCode === 13) {
              _this.searchNodesSimple($searchBox.val());
              return $searchBox.val("");
            }
          };
        })(this));
        return $button.click((function(_this) {
          return function() {
            _this.searchNodesSimple($searchBox.val());
            return $searchBox.val("");
          };
        })(this));
      };

      SimpleSearchBox.prototype.searchNodesSimple = function(searchQuery) {
        return $.post("/node_index_search", {
          checkKeys: this.searchableKeys,
          query: searchQuery
        }, (function(_this) {
          return function(nodes) {
            var modelNode, node, theNode, _i, _j, _len, _len1, _ref, _results;
            if (nodes.length < 1) {
              alert("No Results Found");
            }
            _results = [];
            for (_i = 0, _len = nodes.length; _i < _len; _i++) {
              node = nodes[_i];
              _this.graphModel.putNode(node);
              _ref = _this.graphModel.getNodes();
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                theNode = _ref[_j];
                if (theNode['_id'] === node['_id']) {
                  modelNode = theNode;
                }
              }
              _results.push(_this.selection.selectNode(modelNode));
            }
            return _results;
          };
        })(this));
      };

      return SimpleSearchBox;

    })(Backbone.View);
  });

}).call(this);
