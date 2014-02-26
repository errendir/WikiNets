
/*

This is an example extension of a DataProvider.

You should define this to be backed by your own source of data.
This uses a static graph for the sake of example, but typically
you would make ajax requests and call the callbacks once the data
has been received.

DataProvider extensions need only define two functions

- getLinks(node, nodes, callback) should call callback with
  an array, A, of links st. A[i] is the link from node to nodes[i]
  links are javascript objects and can have any attributes you like
  so long as they don't conflict with d3's attributes and they
  must have a "strength" attribute in [0,1]

- getLinkedNodes(nodes, callback) should call callback with
  an array of the union of the linked nodes of each node in nodes.
  currently, a node can have any attributesyou like so they long
  as they don't conflict with d3's attributes and they
  must have a "text" attribute.

DataProviders are integrated to always be called when a node is
added to the graph to ensure the corresponding links between
all nodes in the graph are added.
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["DataProvider"], function(DataProvider) {
    var WikiNetsDataProvider;
    return WikiNetsDataProvider = (function(_super) {

      __extends(WikiNetsDataProvider, _super);

      function WikiNetsDataProvider() {
        WikiNetsDataProvider.__super__.constructor.apply(this, arguments);
      }

      /*
      
          See above for a spec of this method.
          As a sanity check getLinks({"text": "A"}, [{"text": "B"}], f)
          should call f with [{"strength": 1.0}] as an argument.
      */

      WikiNetsDataProvider.prototype.getLinks = function(node, nodes, callback) {
        if (nodes.length > 0) {
          return $.post("/get_links", {
            'node': node,
            'nodes': nodes
          }, function(data) {
            return callback(data);
          });
        }
      };

      /*
      
          See above for a spec of this method.
          As a sanity check getLinkedNodes([{"text": "C"}], f)
          should call f with [{"text": "B"}] as an argument
      */

      WikiNetsDataProvider.prototype.getLinkedNodes = function(nodes, callback) {
        var makeDisplayable;
        makeDisplayable = function(n) {
          n['text'] = n.name;
          return n;
        };
        return $.post("/get_linked_nodes", {
          'nodes': nodes
        }, function(data) {
          var celNodes, n, _i, _len;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            n = data[_i];
            celNodes = makeDisplayable(n);
          }
          return callback(data);
        });
      };

      WikiNetsDataProvider.prototype.getEverything = function(callback) {
        return $.get('/get_nodes', callback);
      };

      return WikiNetsDataProvider;

    })(DataProvider);
  });

}).call(this);
