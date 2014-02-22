// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var ToolBox;
    return ToolBox = (function(_super) {
      var readTextFile,
        _this = this;

      __extends(ToolBox, _super);

      function ToolBox(options) {
        this.options = options;
        this.searchNodes = __bind(this.searchNodes, this);
        this.expandSelection = __bind(this.expandSelection, this);
        this.loadAllNodes = __bind(this.loadAllNodes, this);
        ToolBox.__super__.constructor.call(this);
      }

      ToolBox.prototype.init = function(instances) {
        this.render();
        this.graphModel = instances["GraphModel"];
        this.dataProvider = instances["local/WikiNetsDataProvider"];
        this.selection = instances["NodeSelection"];
        this.dataController = instances["local/Neo4jDataController"];
        $(this.el).attr("class", "toolboxpopout");
        $(this.el).appendTo($('#maingraph'));
        $(this.el).hide();
        this.graphView = instances["GraphView"];
        return this.listView = instances["local/ListView"];
      };

      ToolBox.prototype.render = function() {
        var $chooseSelectButton, $clearAllButton, $clearSelectedButton, $container, $deselectAllButton, $expandSelectionButton, $pinSelectedButton, $selectAllButton, $showAllButton, $showLearningButton, $showResearchButton, $showStudentLifeButton, $textImportSelection, $unpinAllButton, $unpinSelectedButton, mouseX, mouseY,
          _this = this;
        $container = $("<div id=\"show-all-container\">").appendTo(this.$el);
        $('#listviewButton').click(function() {
          $(_this.listView.el).show();
          $('#listviewButton').css("background", "url(\"images/icons/blue/list_nested_24x21.png\")");
          $(_this.graphView.el).hide();
          return $('#graphviewButton').css("background", "url(\"images/icons/gray_dark/share_24x24.png\")");
        });
        $('#graphviewButton').click(function() {
          $(_this.listView.el).hide();
          $('#listviewButton').css("background", "url(\"images/icons/gray_dark/list_nested_24x21.png\")");
          $(_this.graphView.el).show();
          return $('#graphviewButton').css("background", "url(\"images/icons/blue/share_24x24.png\")");
        });
        $('#minimapButton').click(function() {
          $('#slidersPopOut').hide();
          $('#minimapPopOut').toggle();
          return $(_this.el).hide();
        });
        $('#slidersButton').click(function() {
          $('#slidersPopOut').toggle();
          $('#minimapPopOut').hide();
          return $(_this.el).hide();
        });
        $('#moreoptionsButton').click(function() {
          $('#slidersPopOut').hide();
          $('#minimapPopOut').hide();
          return $(_this.el).toggle();
        });
        $showAllButton = $("<input type=\"button\" id=\"showAllButton\" value=\"Show All\"></input>").appendTo($container);
        $showAllButton.click(function() {
          return _this.dataProvider.getEverything(_this.loadAllNodes);
        });
        $clearAllButton = $("<input type=\"button\" id=\"clearAllButton\" value=\"Clear All\"></input>").appendTo($container);
        $clearAllButton.click(function() {
          return _this.graphModel.filterNodes(function(node) {
            return false;
          });
        });
        $expandSelectionButton = $("<input type=\"button\" id=\"expandSelectionButton\" value=\"Expand Selection\"></input>").appendTo($container);
        $expandSelectionButton.click(function() {
          return _this.expandSelection();
        });
        $selectAllButton = $("<input type=\"button\" id=\"selectAllButton\" value=\"Select All\"></input>").appendTo($container);
        $selectAllButton.click(function() {
          return _this.selection.selectAll();
        });
        $deselectAllButton = $("<input type=\"button\" id=\"deselectAllButton\" value=\"Deselect All\"></input>").appendTo($container);
        $deselectAllButton.click(function() {
          return _this.selection.deselectAll();
        });
        $clearSelectedButton = $("<input type=\"button\" id=\"clearSelectedButton\" value=\"Clear Selection\"></input>").appendTo($container);
        $clearSelectedButton.click(function() {
          return _this.selection.removeSelection();
        });
        $chooseSelectButton = $("<input type=\"button\" id=\"chooseSelectButton\" value=\"Clear Unselected\"></input>").appendTo($container);
        $chooseSelectButton.click(function() {
          return _this.selection.removeSelectionCompliment();
        });
        $unpinAllButton = $("<input type=\"button\" id=\"unpinAllButton\" value=\"Un-pin Layout\"></input>").appendTo($container);
        $unpinAllButton.click(function() {
          var node, _i, _len, _ref, _results;
          _ref = _this.graphModel.getNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.fixed = false);
          }
          return _results;
        });
        $unpinAllButton = $("<input type=\"button\" id=\"unpinAllButton\" value=\"Pin Layout\"></input>").appendTo($container);
        $unpinAllButton.click(function() {
          var node, _i, _len, _ref, _results;
          _ref = _this.graphModel.getNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.fixed = true);
          }
          return _results;
        });
        $unpinSelectedButton = $("<input type=\"button\" id=\"unpinSelectedButton\" value=\"Un-Pin Selected\"></input>").appendTo($container);
        $unpinSelectedButton.click(function() {
          var node, _i, _len, _ref, _results;
          _ref = _this.selection.getSelectedNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.fixed = false);
          }
          return _results;
        });
        $pinSelectedButton = $("<input type=\"button\" id=\"unpinSelectedButton\" value=\"Pin Selected\"></input>").appendTo($container);
        $pinSelectedButton.click(function() {
          var node, _i, _len, _ref, _results;
          _ref = _this.selection.getSelectedNodes();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.fixed = true);
          }
          return _results;
        });
        $showLearningButton = $("<input type=\"button\" id=\"showLearningButton\" value=\"Learning\"></input>").appendTo($container);
        $showLearningButton.click(function() {
          return _this.searchNodes({
            Theme: "Learning"
          });
        });
        $showStudentLifeButton = $("<input type=\"button\" id=\"showStudentLifeButton\" value=\"Student Life\"></input>").appendTo($container);
        $showStudentLifeButton.click(function() {
          return _this.searchNodes({
            Theme: "Student Life"
          });
        });
        $showResearchButton = $("<input type=\"button\" id=\"showResearchButton\" value=\"Research\"></input>").appendTo($container);
        $showResearchButton.click(function() {
          return _this.searchNodes({
            Theme: "Research"
          });
        });
        $textImportSelection = $("<br><input type=\"file\" id=\"fileinput\"/>").appendTo($container);
        $textImportSelection.change(readTextFile);
        $('#maingraph').append("<div id=\"tooltip\" class=\"tooltiphover\" style=\"display:none\"></div>");
        mouseX = 0;
        mouseY = 0;
        $(document).mousemove(function(e) {
          var heightDigits, widthDigits;
          widthDigits = $('#maingraph').css("width").length;
          heightDigits = $('#maingraph').css("height").length;
          mouseX = $('#maingraph').css("width").substring(0, widthDigits - 2) - e.pageX;
          return mouseY = $('#maingraph').css("height").substring(0, heightDigits - 2) - e.pageY;
        });
        $('#slidersButton').hover(function() {
          $("#tooltip").empty();
          $("<p style=\"font-size:10px\"><b>SLIDERS:</b> <br> <i>currently allows adjustment of spacing of the nodes</i></p>").appendTo($("#tooltip"));
          $("#tooltip").css("right", mouseX - 40);
          $("#tooltip").css("bottom", 63);
          return $("#tooltip").toggle();
        });
        $('#minimapButton').hover(function() {
          $("#tooltip").empty();
          $("<p style=\"font-size:10px\"><b>MINIMAP:</b> <br> <i>a closeup view of the most recently selected node</i></p>").appendTo($("#tooltip"));
          $("#tooltip").css("right", mouseX - 40);
          $("#tooltip").css("bottom", 63);
          return $("#tooltip").toggle();
        });
        $('#moreoptionsButton').hover(function() {
          $("#tooltip").empty();
          $("<p style=\"font-size:10px\"><b>MORE OPTIONS:</b> <br> <i>additional buttons with different functionality</i></p>").appendTo($("#tooltip"));
          $("#tooltip").css("right", mouseX - 40);
          $("#tooltip").css("bottom", 63);
          return $("#tooltip").toggle();
        });
        $textImportSelection.mouseover(function() {
          $("#tooltip").empty();
          $("<p style=\"font-size:10px\"><b>CSV Text File Import:</b> <br> <i>Convert your excel spreadsheet to CSV and import. <br> top row must be property names. <br> cells should not contain ','</i></p>").appendTo($("#tooltip"));
          $("#tooltip").css("right", mouseX - 40);
          $("#tooltip").css("bottom", mouseY + 13);
          return $("#tooltip").show();
        });
        return $textImportSelection.mouseleave(function() {
          return $("#tooltip").hide();
        });
      };

      ToolBox.prototype.loadAllNodes = function(nodes) {
        var node, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          _results.push(this.graphModel.putNode(node));
        }
        return _results;
      };

      ToolBox.prototype.expandSelection = function() {
        var _this = this;
        return this.dataProvider.getLinkedNodes(this.selection.getSelectedNodes(), function(nodes) {
          return _.each(nodes, function(node) {
            if (_this.dataProvider.nodeFilter(node)) {
              return _this.graphModel.putNode(node);
            }
          });
        });
      };

      ToolBox.prototype.searchNodes = function(searchQuery) {
        var _this = this;
        return $.post("/search_nodes", searchQuery, function(nodes) {
          var node, _i, _len, _results;
          console.log("made it here: " + searchQuery[0]);
          _results = [];
          for (_i = 0, _len = nodes.length; _i < _len; _i++) {
            node = nodes[_i];
            _this.graphModel.putNode(node);
            _results.push(_this.selection.toggleSelection(node));
          }
          return _results;
        });
      };

      readTextFile = function(evt) {
        var fReader, file;
        file = evt.target.files[0];
        if (file) {
          fReader = new FileReader();
          fReader.onload = function(textData) {
            var contents, i, individualQuery, j, properties, tempValues, totalQuery, _results;
            contents = textData.target.result.split("\n");
            properties = new Array();
            properties = contents[0].split(",");
            while (properties.length === contents[0].length + 1) {
              contents.shift();
              properties = contents[0].split(",");
            }
            totalQuery = [];
            i = 1;
            while (i < contents.length) {
              tempValues = new Array();
              tempValues = contents[i].split(",");
              if (tempValues.length !== contents[i].length + 1) {
                individualQuery = {};
                j = 0;
                while (j < properties.length) {
                  if (properties[j] !== "") {
                    properties[j] = properties[j].replace(" ", "_");
                    individualQuery[properties[j]] = tempValues[j].replace(/'/g, "\\'");
                  }
                  j++;
                }
                totalQuery.push(individualQuery);
              }
              i++;
            }
            i = 0;
            _results = [];
            while (i < totalQuery.length) {
              console.log(totalQuery[i]);
              _results.push(i++);
            }
            return _results;
          };
          fReader.readAsText(file);
        } else {
          alert("Failed to load file");
        }
      };

      return ToolBox;

    }).call(this, Backbone.View);
  });

}).call(this);
