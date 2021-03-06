(function() {
  var root;

  var BubbleChart = function(data) {
    var max_amount;
      this.create_nodes = this.create_nodes.bind(this);
      this.create_vis = this.create_vis.bind(this);
      this.start = this.start.bind(this);
      this.display_group_all = this.display_group_all.bind(this);
      this.move_towards_center = this.move_towards_center.bind(this);
      this.display_by_country = this.display_by_country.bind(this);
      this.move_towards_country = this.move_towards_country.bind(this);
      this.display_country = this.display_country.bind(this);
      this.hide_country = this.hide_country.bind(this);
      this.show_details = this.show_details.bind(this);
      this.hide_details = this.hide_details.bind(this);
      this.data = data;
      this.width = 940;
      this.height = 800;
      this.tooltip = CustomTooltip("tooltip", 240);
      this.center = {
        x: this.width / 2,
        y: this.height / 2
      };
      this.country_centers = {
        "Korea": {
          x: this.width / 3,
          y: this.height / 2
        },
        "Japan": {
          x: 2 * this.width / 3,
          y: this.height / 2
        }
      };
      this.layout_gravity = -0.01;
      this.damper = 0.1;
      this.vis = null;
      this.nodes = [];
      this.force = null;
      this.circles = null;
      max_amount = d3.max(this.data, function(d) {
        return parseInt(d.vote);
      });
      this.radius_scale = d3.scale.pow().exponent(1.5).domain([0, max_amount]).range([2, 90]);
      this.create_nodes();
      this.create_vis();
  };

  BubbleChart.prototype.create_nodes = function() {
    var that = this;
    this.data.forEach(function(d) {
      var node;
      node = {
        id: d.id,
        radius: that.radius_scale(parseInt(d.vote)),
        value: d.vote,
        name: d.name,
        org: d.organization,
        group: d.group,
        rank: d.rank,
        country: d.country,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
      return that.nodes.push(node);
    });
    return that.nodes.sort(function(a, b) {
      return b.value - a.value;
    });
  };

  BubbleChart.prototype.create_vis = function() {
    var that;
    this.vis = d3.select("#vis").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
    this.circles = this.vis.selectAll("circle").data(this.nodes, function(d) {
      return d.id;
    });

    that = this;

    var defs = this.vis.append("defs")
    var imgPattern = defs.selectAll("pattern").data(this.nodes)
      .enter().append("pattern")
      .attr("id", function(d) {
        return d.id;
      }).attr("width", 1).attr("height", 1)
      .attr("patternUnits", "objectBoundingBox")
      .append("image")
      .attr("x", 0).attr("y", 0)
      .attr("width", function(d) {
        return d.radius * 2;
      }).attr("height", function(d) {
        return d.radius * 2;
      }).attr("xlink:href", function(d) {
        return '/images/mainPictures/' + d.id + '.jpg';
      });

    this.circles.enter().append("circle").attr("r", 0).attr("stroke-width", 2).attr("stroke", function(d) {
      return '#fff';
    }).attr("id", function(d) {
      return 'bubble_' + d.id;
    }).attr('fill', function(d) {
      return 'url("#' + d.id + '")';
    }).on("mouseover", function(d, i) {
      return that.show_details(d, i, this);
    }).on("mouseout", function(d, i) {
      return that.hide_details(d, i, this);
    });
    return this.circles.transition().duration(2000).attr("r", function(d) {
      return d.radius;
    });
  };

  BubbleChart.prototype.charge = function(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  };

  BubbleChart.prototype.start = function() {
    return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
  };

  BubbleChart.prototype.display_group_all = function() {
    var that = this;
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function(e) {
      return that.circles.each(that.move_towards_center(e.alpha)).attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
    });
    this.force.start();
    return this.hide_country();
  };

  BubbleChart.prototype.move_towards_center = function(alpha) {
    var that = this;
    return function(d) {
      d.x = d.x + (that.center.x - d.x) * (that.damper + 0.02) * alpha;
      return d.y = d.y + (that.center.y - d.y) * (that.damper + 0.02) * alpha;
    };
  };

  BubbleChart.prototype.display_by_country = function() {
    var that = this;
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function(e) {
      return that.circles.each(that.move_towards_country(e.alpha)).attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
    });
    this.force.start();
    return this.display_country();
  };

  BubbleChart.prototype.move_towards_country = function(alpha) {
    var that = this;
    return function(d) {
      var target;
      target = that.country_centers[d.country];
      d.x = d.x + (target.x - d.x) * (that.damper + 0.02) * alpha * 1.1;
      return d.y = d.y + (target.y - d.y) * (that.damper + 0.02) * alpha * 1.1;
    };
  };

  BubbleChart.prototype.display_country = function() {
    var country, country_data, country_x;
    country_x = {
      "Korea": 260,
      "Japan": this.width - 190
    };
    country_data = d3.keys(country_x);
    country = this.vis.selectAll(".country").data(country_data);
    return country.enter().append("text").attr("class", "country").attr("x", function(d) {
      return country_x[d];
    }).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
      return d;
    });
  };

  BubbleChart.prototype.hide_country = function() {
    var country;
    return country = this.vis.selectAll(".country").remove();
  };

  BubbleChart.prototype.show_details = function(data, i, element) {
    var content;
    d3.select(element).attr("stroke", "#ff50a0");
    content = '<span></span><span class="value">' + data.rank + '위 ' + data.name + ' (' + data.org + ')</span><br/>';
    content += '<span class="vote"></span><span class="value"> ' + addCommas(data.value) + '표</span><br/>';
    return this.tooltip.showTooltip(content, d3.event);
  }

  BubbleChart.prototype.hide_details = function(data, i, element) {
    d3.select(element).attr("stroke", "#fff");
    return this.tooltip.hideTooltip();
  }

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  (function() {
    var chart, render_vis;
    chart = null;
    render_vis = function(csv) {
      chart = new BubbleChart(csv);
      chart.start();
      return root.display_all();
    };
    root.display_all = function() {
      return chart.display_group_all();
    };
    root.display_country = function() {
      return chart.display_by_country();
    };
    root.toggle_view = function(view_type) {
      if (view_type === 'country') {
        return root.display_country();
      } else {
        return root.display_all();
      }
    };
    return d3.json("data/trainee.json", render_vis);
  })();
}).call(this);
