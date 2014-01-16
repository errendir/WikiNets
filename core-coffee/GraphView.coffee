# renders the graph using d3's force directed layout
define [], () ->

  class LinkFilter extends Backbone.Model
    initialize: () ->
      @set "threshold", 0.75
    filter: (links) ->
      return _.filter links, (link) =>
        return link.strength > @get("threshold")
    connectivity: (value) ->
      if value
        @set("threshold", value)
      else
        @get("threshold")

  class GraphView extends Backbone.View

    init: (instances) ->
      @model = instances["GraphModel"]
      @model.on "change", @update.bind(this)
      @render()
      instances["Layout"].addCenter @el


    initialize: (options) ->
      # filter between model and visible graph
      # use identify function if not defined
      @linkFilter = new LinkFilter(this);
      @listenTo @linkFilter, "change:threshold", @update

    render: ->
      initialWindowWidth = $(window).width()
      initialWindowHeight = $(window).height()
      @initialWindowWidth = initialWindowWidth
      @initialWindowHeight = initialWindowHeight
      @force = d3.layout.force()
        .size([initialWindowWidth, initialWindowHeight])
        .charge(-500)
        .gravity(0.2)
      @linkStrength = (link) =>
        return (link.strength - @linkFilter.get("threshold")) / (1.0 - @linkFilter.get("threshold"))
      @force.linkStrength @linkStrength
      svg = d3.select(@el).append("svg:svg").attr("pointer-events", "all")
      zoom = d3.behavior.zoom()
      @zoom = zoom

      # create arrowhead definitions
      defs = svg.append("defs")

      defs
        .append("marker")
        .attr("id", "Triangle")
        .attr("viewBox", "0 0 20 15")
        .attr("refX", "15")
        .attr("refY", "5")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("markerWidth", "20")
        .attr("markerHeight", "15")
        .attr("orient", "auto")
        .append("path")
          .attr("d", "M 0 0 L 10 5 L 0 10 z")

      defs
        .append("marker")
        .attr("id", "Triangle2")
        .attr("viewBox", "0 0 20 15")
        .attr("refX", "-5")
        .attr("refY", "5")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("markerWidth", "20")
        .attr("markerHeight", "15")
        .attr("orient", "auto")
        .append("path")
          .attr("d", "M 10 0 L 0 5 L 10 10 z")

      # outermost wrapper - this is used to capture all zoom events
      zoomCapture = svg.append("g")

      # this is in the background to capture events not on any node
      # should be added first so appended nodes appear above this
      zoomCapture.append("svg:rect")
             .attr("width", "100%")
             .attr("height", "100%")
             .style("fill-opacity", "0%")

      # Panning on Drag
      # lock infrastracture to ignore zoom changes that would
      # typically occur when dragging a node
      translateLock = false
      currentZoom = undefined
      @force.drag().on "dragstart", ->
        translateLock = true
        currentZoom = zoom.translate()
      .on "dragend", ->
        zoom.translate currentZoom
        translateLock = false

      # add event listener to actually affect UI
      # ignore zoom event if it's due to a node being dragged
      # otherwise, translate and scale according to zoom
      # disabled dragging for clicking
      
      zoomCapture.call(zoom.on("zoom", -> # ignore double click to zoom
        return  if translateLock
        workspace.attr "transform", "translate(#{d3.event.translate}) scale(#{d3.event.scale})"
      )).on("dblclick.zoom", null)

      # inner workspace which nodes and links go on
      # scaling and transforming are abstracted away from this
      workspace = zoomCapture.append("svg:g")
      @workspace = workspace

      # containers to house nodes and links
      # so that nodes always appear above links
      linkContainer = workspace.append("svg:g").classed("linkContainer", true)
      nodeContainer = workspace.append("svg:g").classed("nodeContainer", true)

      # add a trigger for rightclicks of the @el
      $(@el).bind "contextmenu", (e) -> return false #disable defaultcontextmenu
      $(@el).mousedown (e) => 
        if e.which is 3 then @trigger "view:rightclick"
        else @trigger "view:click"

      return this

    addCentering: (workspace, zoom) ->
      width = $(@el).width()
      height = $(@el).height() 

      translateParams=[0,0]
           
      @on "enter:node:shift:click", (node) ->
        x = node.x
        y = node.y
        scale = zoom.scale()
        translateParams = [(width/2 -x)/scale,(height/2-y)/scale]
        #update translate values
        zoom.translate([translateParams[0], translateParams[1]])
        workspace.transition().ease("linear").attr "transform", "translate(#{translateParams}) scale(#{scale})"
    

    #fast-forward force graph rendering to prevent bouncing http://stackoverflow.com/questions/13463053/calm-down-initial-tick-of-a-force-layout  
    forwardAlpha: (layout, alpha, max) ->
      alpha = alpha || 0
      max = max || 1000
      i = 0
      while layout.alpha() > alpha && i++ < max
        layout.tick()

    update: ->
      #Center node on shift+click
      @addCentering(@workspace, @zoom)

      #hack fixing multi-eval of Update and hence Start bug:
      #clearTimeout(@tickTimer)
      #@tickTimer=setTimeout( () => 

      nodes = @model.get("nodes")
      links = @model.get("links")
      filteredLinks = if @linkFilter then @linkFilter.filter(links) else links
      @force.nodes(nodes).links(filteredLinks).start()
      link = @linkSelection = d3.select(@el).select(".linkContainer").selectAll(".link").data(filteredLinks, @model.get("linkHash"))
      linkEnter = link.enter().append("line")
        .attr("class", "link")
        .attr 'marker-end', (link) ->
          'url(#Triangle)' if link.direction is 'forward' or link.direction is 'bidirectional'
        .attr 'marker-start', (link) ->
          'url(#Triangle2)' if link.direction is 'backward' or link.direction is 'bidirectional'
      @force.start()
      
      link.exit().remove()
      link.attr "stroke-width", (link) => 5 * (@linkStrength link)
      node = @nodeSelection = d3.select(@el).select(".nodeContainer").selectAll(".node").data(nodes, @model.get("nodeHash"))
      nodeEnter = node.enter().append("g").attr("class", "node").call(@force.drag)
      nodeEnter.append("text")
           .attr("dx", 12)
           .attr("dy", ".35em")
           .text((d) =>
            @findText(d)
          )

      nodeEnter.append("circle")
           .attr("r", 5)
           .attr("cx", 0)
           .attr("cy", 0)
      
      clickSemaphore = 0
      nodeEnter.on("click", (datum, index) =>
        #ignore drag
        return  if d3.event.defaultPrevented
        if d3.event.shiftKey then shifted = true else shifted = false
        datum.fixed = true
        clickSemaphore += 1
        savedClickSemaphore = clickSemaphore
        setTimeout (=>
          if clickSemaphore is savedClickSemaphore
            if shifted then @trigger "enter:node:shift:click", datum
            @trigger "enter:node:click", datum
            datum.fixed = false
          else
            # increment so second click isn't registered as a click
            clickSemaphore += 1
            datum.fixed = false
        ), 250)
        .on "dblclick", (datum, index) =>
          @trigger "enter:node:dblclick", datum

      @trigger "enter:node", nodeEnter
      @trigger "enter:link", linkEnter
      node.exit().remove()
      @force.on "tick", ->
        link.attr("x1", (d) ->
          d.source.x
        ).attr("y1", (d) ->
          d.source.y
        ).attr("x2", (d) ->
          d.target.x
        ).attr("y2", (d) ->
          d.target.y
        )

        node.attr "transform", (d) ->
          "translate(#{d.x},#{d.y})"


        #fast forward rendering
        #@forwardAlpha(@force,.005,2000)
        
      #, 5)

    drawXHairs: (x,y,obj) ->
      obj.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", y-10)
      .attr("y2", y+10)
      .attr("stroke-width", 2)
      .attr("stroke", "red");
      obj.append("line")
      .attr("x1", x+10)
      .attr("x2", x-10)
      .attr("y1", y)
      .attr("y2", y)
      .attr("stroke-width", 2)
      .attr("stroke", "red")

    getNodeSelection: ->
      return @nodeSelection

    getLinkSelection: ->
      return @linkSelection

    getForceLayout: ->
      return @force

    getLinkFilter: ->
      return @linkFilter

    #TODO MAKE THIS GENERIC
    findText: (node) ->
      if node.name?
        node.name
      else if node.title?
        node.title
      else
        ''
