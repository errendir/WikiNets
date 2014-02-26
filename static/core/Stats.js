(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define([], function() {
    var StatsView;
    return StatsView = (function(_super) {

      __extends(StatsView, _super);

      function StatsView(options) {
        this.options = options;
        StatsView.__super__.constructor.call(this);
      }

      StatsView.prototype.init = function(instances) {
        this.render();
        this.graphModel = instances["GraphModel"];
        this.listenTo(this.graphModel, "change", this.update);
        return instances["Layout"].addPlugin(this.el, this.options.pluginOrder, 'Stats');
      };

      StatsView.prototype.render = function() {
        var container;
        container = $("<div />").addClass("graph-stats-container").appendTo(this.$el);
        this.$table = $("<table border=\"0\"/>").appendTo(container);
        $("<tr><td class=\"graph-stat-label\">Nodes: </td><td id=\"graph-stat-num-nodes\" class=\"graph-stat\">0</td></tr>").appendTo(this.$table);
        $("<tr><td class=\"graph-stat-label\">Links: </td><td id=\"graph-stat-num-links\" class=\"graph-stat\">0</td></tr>").appendTo(this.$table);
        return this;
      };

      StatsView.prototype.update = function() {
        this.$("#graph-stat-num-nodes").text(this.graphModel.getNodes().length);
        return this.$("#graph-stat-num-links").text(this.graphModel.getLinks().length);
      };

      StatsView.prototype.addStat = function(label) {
        var $label, $row, $stat;
        $label = $("<td class=\"graph-stat-label\">" + label + ": </td>");
        $stat = $("<td class=\"graph-stat\"></td>)");
        $row = $("<tr />").append($label).append($stat);
        this.$table.append($row);
        return function(newVal) {
          return $stat.text(newVal);
        };
      };

      return StatsView;

    })(Backbone.View);
  });

}).call(this);
