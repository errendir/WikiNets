# More advanced force map based implementation of the label placing

define [], () ->
  class DoubleForceLabelLayout
    constructor: ->
      @step = 20
      @linkdistance = (link) -> link.distance
      @force = d3.layout.force()
        .charge(-100)
        .linkStrength(7)
        .gravity(0)
        .linkDistance(@linkdistance)
        #.chargeDistance(20)
    update: (label) ->
      anchors = [];
      links = [];
      
      step = @step
      i = 0;
      label.data(_.clone(label.data()))
      label.each (datum) ->
        # Get the length of the text
        width = this.getBBox().width;
        
        # Holder for the original position of the node
        datum["nodecopy"] =
          "weight" : 1
          "fixed" : true
        anchors.push (datum["nodecopy"])  # Anchor for the main node
        
        # A second variable for the position of the label
        start = 0
        datum["labels"] = []
        while step*start < (width + step)
          datum["labels"].push
            "x" : datum["x"] + step*start,
            "y" : datum["y"],
            "px" : datum["px"] + step*start,
            "py" : datum["py"],
            "weight" : 1
          anchors.push (datum["labels"][start])    # Label piece
          d3.select(this).selectAll(".lab#{start}sep").remove()
          #d3.select(this).append("circle").attr("r", 1).classed("lab#{start}sep", true);
          start += 1

        #Construct links
        links.push
          source : i,
          target : i + 1,
          weight : 1,
          distance : 0

        start = 1
        while step*start < (width + step)
          links.push
            source : i + start,
            target : i + start+1,
            weight : 1,
            distance : step
          start += 1

        i += start + 1
        return
      
      #label.style("text-anchor", "middle")
      @force.nodes(anchors).links(links)
  
    place: (label) ->
      #Restart the simulation from the new positions of the nodes
      label.each (datum, i) ->
        datum["nodecopy"]["x"]  = datum["x"]
        datum["nodecopy"]["px"] = datum["px"]
        datum["nodecopy"]["y"]  = datum["y"]
        datum["nodecopy"]["py"] = datum["py"]

      # Closure!
      step = @step  
      
      @force.start()
      @force.on "tick", =>
        label.attr "transform", (d) ->
          # Constrain on y-axis (we only want text to be horizontal)
          sumy = 0
          for lab, i in d.labels
            sumy += d.labels[0].y
            lab.x = d.labels[0].x + i*step
          for lab, i in d.labels
            lab.y = (sumy / d.labels.length)
          
          # Calculate the position and rotation
          dx = (d.labels[d.labels.length-1].x - d.labels[0].x)
          dy = (d.labels[d.labels.length-1].y - d.labels[0].y)
          angle = Math.atan(dy/dx) * (360/(2*Math.PI));
          
          # Debug
          width = this.getBBox().width
          start = 0
          for lab, i in d.labels
            cx = lab.x - d["labels"][0].x
            cy = lab.y - d["labels"][0].y
            d3.select(this).select(".lab#{i}sep").attr("cx",  cx).attr("cy",  cy);
            start += 1
          
          "translate(#{d.labels[0].x},#{d.labels[0].y}) rotate(#{angle}) "
        
      