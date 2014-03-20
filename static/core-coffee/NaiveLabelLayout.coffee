# A simple, naive label placement algorithm
# It serves both as a simple implementation and the interface

define [], () ->
  class NaiveLabelLayout
    update: (label) ->
    place : (label) -> 
      label.attr "transform", (d) -> "translate(#{d.x},#{d.y})"