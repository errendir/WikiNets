# More advanced force map based implementation of the label placing

define [], () ->
  class ForceLabelLayout
    constructor: ->
      @force = d3.layout.force()
        .charge(-100)
        .linkDistance(0)
        .linkStrength(8)
        #.gravity(0.2)
    update: (label) ->
      anchors = [];
      links = [];
      
      label.data(_.clone(label.data()))
      label.each (datum, i) ->
        # Holder for the original position of the node
        datum["nodecopy"] =
          "weight" : 1
          "fixed" : true
        
        # A second variable for the position of the label
        datum["label"] =
          "weight" : 1

        anchors.push (datum["nodecopy"])  # Anchor
        anchors.push (datum["label"])  # Label
        links.push
          source : 2*i,
          target : 2*i + 1,
          weight : 1
        return
      
      label.style("text-anchor", "middle")
      @force.nodes(anchors).links(links)
  
    place: (label) ->
      #Restart the simulation from the new positions of the nodes
      label.each (datum, i) ->
        datum["nodecopy"]["x"] = datum["x"]
        datum["nodecopy"]["px"] = datum["px"]
        datum["nodecopy"]["y"] = datum["y"]
        datum["nodecopy"]["py"] = datum["py"]

      @force.start()
      @force.on "tick", =>
        label.attr "transform", (d) -> "translate(#{d.label.x},#{d.label.y})"
      