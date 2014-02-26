(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define([], function() {
    var OverlayCreate;
    return OverlayCreate = (function(_super) {

      __extends(OverlayCreate, _super);

      function OverlayCreate(options) {
        this.options = options;
        this.setupOverlay = __bind(this.setupOverlay, this);
        OverlayCreate.__super__.constructor.call(this);
      }

      OverlayCreate.prototype.init = function(instances) {
        _.extend(this, Backbone.Events);
        this.keyListener = instances['KeyListener'];
        this.graphView = instances['GraphView'];
        this.graphModel = instances['GraphModel'];
        this.dataController = instances['local/Neo4jDataController'];
        this.render();
        this.selection = instances["NodeSelection"];
        return this.selection.on("change", this.update.bind(this));
      };

      OverlayCreate.prototype.render = function() {
        var $container, $createSourceNodeButton, $sourceInput, $titleArea,
          _this = this;
        $container = $("<div id=\"notepad\">").appendTo(this.$el);
        $titleArea = $("<textarea placeholder=\"Title\" id=\"nodeTitle\" name=\"textin\" rows=\"1\" cols=\"59\"></textarea><br>").appendTo($container);
        this.$sourceWrapper = $("<div class=\"source-container\">").appendTo($container);
        $sourceInput = $("<textarea placeholder=\"Node : A node's description #key1 value1 #key2 value2\" id=\"nodeContent\" name=\"textin\" rows=\"14\" cols=\"59\"></textarea><br>").appendTo(this.$sourceWrapper);
        $createSourceNodeButton = $("<input id=\"queryform\" type=\"button\" value=\"Create Node\"><br>").appendTo(this.$sourceWrapper);
        $("#nodeContent").keypress(function(e) {
          console.log(e.keyCode);
          if (e.keyCode === 13) {
            _this.buildNode(_this.parseSyntax($sourceInput.val()));
            return $sourceInput.val("");
          }
        });
        $createSourceNodeButton.click(function() {
          _this.buildNode(_this.parseSyntax($sourceInput.val()));
          $sourceInput.val("");
          $('#overlay').hide();
          return _this.$el.hide();
        });
        return this.setupOverlay();
      };

      OverlayCreate.prototype.setupOverlay = function() {
        var $overlay,
          _this = this;
        $overlay = $("<div id=\"overlay\">").appendTo(this.graphView.$el.parent());
        this.$el.appendTo($('#overlay').parent());
        $('#overlay').hide();
        this.$el.hide();
        $overlay.click(function() {
          $('#overlay').hide();
          return _this.$el.hide();
        });
        this.$el.bind("contextmenu", function(e) {
          return false;
        });
        $overlay.bind("contextmenu", function(e) {
          return false;
        });
        return this.graphView.on("view:rightclick", function() {
          $('#overlay').show();
          return _this.$el.show();
        });
      };

      OverlayCreate.prototype.update = function(node) {
        return this.selection.getSelectedNodes();
      };

      OverlayCreate.prototype.buildNode = function(node) {
        var _this = this;
        return this.dataController.nodeAdd(node, function(datum) {
          return _this.graphModel.putNode(datum);
        });
      };

      OverlayCreate.prototype.parseSyntax = function(input) {
        var dict, match, pattern, strsplit, text;
        console.log("input", input);
        strsplit = input.split("#");
        strsplit[0] = strsplit[0].replace(/:/, " #description ");
        /* The : is shorthand for #description
        */
        text = strsplit.join("#");
        pattern = new RegExp(/#([a-zA-Z0-9]+) ([^#]+)/g);
        dict = {};
        match = {};
        while (match = pattern.exec(text)) {
          dict[match[1].trim()] = match[2].trim();
        }
        /*The first entry becomes the name
        */
        dict["name"] = text.split("#")[0].trim();
        console.log("This is the title", text.split("#")[0].trim());
        return dict;
      };

      return OverlayCreate;

    })(Backbone.View);
  });

}).call(this);
