var LEFT_MARGIN = 280,
    TOP_MARGIN = 50,
    CATEGORY_OFFSET = 140,

    FRACTION_WIDTH = 10,

    SHADOW_K = .1,

    SCALE_Y = 5,

    TEXT_ALL_TRAINEES = '전체 연습생',
    TEXT_CATEGORY = '구분';

var dom = {
    svg: undefined,
    categories: undefined,
    fractions: undefined,
    transitions: undefined,
    defs: undefined,
    trainees: undefined,
    header: undefined,
}

var s = {};

function setTitle(name) {
  var counter = dom.trainees.selectAll('.trainee:not(.hidden)').size();

  dom.header.select('#title').html(name === undefined ? TEXT_ALL_TRAINEES : name);
  dom.header.select('#supp').text(counter);
  //dom.header.select('#counter').text(supp === undefined ? '' : counter);
  dom.header.select('#clear').classed('hidden', name === undefined);
}

function hoverCategory(event) {
    s.fractions
        .classed('active', function(d) { return event !== undefined && d.categoryId == event.id; });
    s.transitions
        .classed('active', false);
}

function hoverFraction(fraction) {
    s.fractions
        .classed('active', function(d) { return fraction !== undefined && d.id == fraction.id; });
}

function hoverTransition(transition) {
    s.transitions
        .classed('active', function(d) { return transition !== undefined && d.id == transition.id; });

    s.fractions
        .classed('active', function (d) {
            return transition !== undefined && (d.id == transition.from || d.id == transition.to);
        });
}

function hoverTrainee(trainee) {
    s.fractions
        .classed('active', function(d) {
            return trainee !== undefined && trainee.fractionIds.indexOf(d.id) != -1;
        })
        .classed('faded', function(d) {
            if (trainee !== undefined)
                return trainee.fractionIds.indexOf(d.id) == -1;
            else
                if (noSelection)
                    return false
                else
                    return !d3.select(this).classed('selected');
            });

    s.transitions
        .classed('active', function(d) {
            if (trainee === undefined)
                return false;
            var i = trainee.fractionIds.indexOf(d.from);
            return i != -1 && trainee.fractionIds.indexOf(d.to) == i + 1;
        })
        .classed('faded', function(d) {
            if (trainee !== undefined) {
                var i = trainee.fractionIds.indexOf(d.from);
                return i == -1 || trainee.fractionIds.indexOf(d.to) != i + 1;
            }
            else
                if (noSelection)
                    return false;
                else
                    return !d3.select(this).classed('selected');
        });
}

var noSelection = true;
function clearSelection() {
    if (!noSelection) {
        noSelection = true;

        s.fractions
            .classed('selected', false)
            .classed('faded', false);
        s.transitions
            .classed('selected', false)
            .classed('faded', false);
        s.trainees.classed('hidden', false);
    }
}

function selectFraction(fraction) {
    noSelection = false;

    s.fractions
        .classed('selected', function(d) { return d.id == fraction.datum().id; })
        .classed('faded', function(d) { return d.id != fraction.datum().id; });

    s.transitions
        .classed('faded', true)
        .classed('selected', false);

    s.trainees
        .classed('hidden', function(d) { return d.fractionIds.indexOf(fraction.datum().id) == -1; });

    setTitle(
        fraction.datum()._name + ' (' + d_categories[fraction.datum().categoryId].description + ')'
    );
}

function selectTransition(transition) {
    noSelection = false;

    s.fractions
        .classed('faded', function(d) { return d.id != transition.datum().from && d.id != transition.datum().to; })
        .classed('selected', function(d) { return d.id == transition.datum().from || d.id == transition.datum().to; });

    s.transitions
        .classed('faded', function(d) { return d.id != transition.datum().id; })
        .classed('selected', function(d) { return d.id == transition.datum().id; });

    s.trainees
        .classed('hidden', function(d) {
            var i = d.fractionIds.indexOf(transition.datum().from)
            return i == -1 || d.fractionIds.indexOf(transition.datum().to) != i + 1;
        });


    var title = d_fractions[transition.datum().from].groupId == d_fractions[transition.datum().to].groupId ?
        [
          d_fractions[transition.datum().from]._name + ' (',
          d_fractions[transition.datum().from]._categoryName + ' → ',
          d_fractions[transition.datum().to]._categoryName + ')'
        ].join('') :
        [
          d_fractions[transition.datum().from]._name + ' (',
          d_fractions[transition.datum().from]._categoryName + ')' + ' → ',
          d_fractions[transition.datum().to]._name + ' (',
          d_fractions[transition.datum().to]._categoryName + ')'
        ].join('');

    setTitle(
        title,
        d_fractions[transition.datum().from]._categoryName + ' → ' + d_fractions[transition.datum().to]._categoryName
    );
}

function selectGroup(group) {
    noSelection = false;

    s.fractions
        .classed('selected', function(d) { return d.categoryId == group.datum().id; })
        .classed('faded', function(d) { return d.categoryId != group.datum().id; });

    s.transitions
        .classed('faded', true)
        .classed('selected', false);

    s.trainees
        .classed('hidden', function(d) { return d.categories[group.datum().id - 1].groupId === undefined; });

    setTitle(
      '연습생 (' + group.datum().description + ')'
    );
}

//=====================


function fractionPosition(fraction) {
    return [
        (LEFT_MARGIN + (d_categories[fraction.categoryId].id - 1) * CATEGORY_OFFSET),
        SCALE_Y * (fraction.offset + fraction.order * 3) + TOP_MARGIN
    ]
}


function drawCategories() {
    var categories = dom.categories.selectAll('.category').data(a_categories).enter();

    var groups = categories.append('g')
        .classed('category', true)
        .attr('transform', function(d) { return 'translate(' + (LEFT_MARGIN + (d.id - 1) * CATEGORY_OFFSET) + ',' + TOP_MARGIN + ')'; });

    var labels = groups.append('g')
        .classed('categoryLabel', true)
        .attr('transform', 'translate(0,-20)')
        .on('mouseover', hoverCategory)
        .on('mouseout', function(d) { hoverCategory(); })
        .on('click', function(d) {
            event.stopPropagation();
            selectGroup(d3.select(this.parentNode));
        });

    labels.append('text')
        .classed('categoryDescription', true)
        .text(function(d) { return d.description; });

    labels.append('text')
        .classed('categoryNumber', true)
        .attr('y', -15)
        .text(function(d) { return d.number; });
}

function drawTransitions() {
    var transitionsDirect = dom.transitionsDirect.selectAll('.transition').data(a_transitions_direct).enter();
    var transitionsJump = dom.transitionsJump.selectAll('.transition').data(a_transitions_jump).enter();

    var transitionsHover = dom.transitionsHover.selectAll('.transition').data(a_transitions_jump.concat(a_transitions_direct)).enter();

    var grads = dom.defs.selectAll('linearGradient')
        .data(a_transitions_direct.concat(a_transitions_jump), function(d) { return d.from + '-' + d.to })
        .enter()
            .append('linearGradient')
            .attr('id', function(d) { return 'g' + d.from + '-' + d.to; })
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 1)
            .attr('y2', 0);

    grads.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', function(d) { return d_fractions[d.from]._color; });

    grads.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', function(d) { return d_fractions[d.to]._color; });

    function drawHelper(transitions, forHover) {
        var groups = transitions.append('g')
            .classed('transition', true);

        if (forHover !== undefined)
            groups
                .on('mouseover', hoverTransition)
                .on('mouseout', function(d) { hoverTransition(); })
                .on('click', function(d) {
                    event.stopPropagation();
                    selectTransition(d3.select(this));
                });

        var lines1 = groups.filter(function(d) {
            return d_fractions[d.from]._position[1] + d.leftOffset * SCALE_Y == d_fractions[d.to]._position[1] + d.rightOffset * SCALE_Y;
        })

        lines1.append('rect')
            .attr('x', function(d) { return d_fractions[d.from]._position[0] + FRACTION_WIDTH / 2; })
            .attr('y', function(d) { return d_fractions[d.from]._position[1] + d.leftOffset * SCALE_Y; })
            .attr('width', function(d) { return d_fractions[d.to]._position[0] - d_fractions[d.from]._position[0] - FRACTION_WIDTH; })
            .attr('height', function(d) { return d.number * SCALE_Y; })
            .attr('stroke', 'none')
            .attr('fill', function(d) {
                if (forHover === undefined)
                    return 'url(#g' + d.from + '-' + d.to + ')';
                else
                    return 'rgba(0, 0, 0, 0)';
            });

        var lines2 = groups.filter(function(d) {
            return d_fractions[d.from]._position[1] + d.leftOffset != d_fractions[d.to]._position[1] + d.rightOffset;
        })

        lines2.append('path')
            .attr('d', function(d) {
                var f1 = d_fractions[d.from],
                    f2 = d_fractions[d.to];
                var result = [
                  'M',
                  ' ' + (f1._position[0] + FRACTION_WIDTH / 2),
                  ' ' + (f1._position[1] + (d.leftOffset + d.number / 2) * SCALE_Y),
                  ' C',
                  ' ' + ((f1._position[0] + f2._position[0]) / 2),
                  ' ' + (f1._position[1] + (d.leftOffset + d.number / 2) * SCALE_Y),
                  ', ' + ((f1._position[0] + f2._position[0]) / 2),
                  ' ' + (f2._position[1] + (d.rightOffset + d.number / 2) * SCALE_Y),
                  ', ' + (f2._position[0] - FRACTION_WIDTH / 2),
                  ' ' + (f2._position[1] + (d.rightOffset + d.number / 2) * SCALE_Y)
                ].join('');

                return result;
            })
            .attr('fill', 'none')
            .attr('stroke', function(d) {
                if (forHover === undefined)
                    return 'url(#g' + d.from + '-' + d.to + ')';
                else
                    return 'rgba(0, 0, 0, 0)';
            })
            .attr('stroke-width', function(d) {
                if (forHover === undefined || d.number > 5)
                    return d.number * SCALE_Y;
                else
                    return 6;
            });
    }

    drawHelper(transitionsDirect);
    drawHelper(transitionsJump);
    drawHelper(transitionsHover, true);

    s.transitions = dom.drawArea.selectAll('.transition');
}

function drawFractions() {
    var fractions = dom.fractions.selectAll('.fraction').data(a_fractions).enter();
    var fractionsHover = dom.fractionsHover.selectAll('.fraction').data(a_fractions).enter();

    var groups = fractions.append('g')
        .classed('fraction', true)
        .attr('transform', function(d) {
            d._position = fractionPosition(d);
            d._color = d_groups[d.groupId].color;
            d._name = d_groups[d.groupId].name;
            d._categoryName = d_categories[d.categoryId].description;
            return 'translate(' + d._position[0] + ',' + d._position[1] + ')';
        });

    var hoverGroups = fractionsHover.append('g')
        .classed('fraction', true)
        .attr('transform', function(d) {
            return 'translate(' + d._position[0] + ',' + d._position[1] + ')';
        })
        .on('mouseover', hoverFraction)
        .on('mouseout', function() { hoverFraction(); })
        .on('click', function() {
            event.stopPropagation();
            selectFraction(d3.select(this));
        });

    groups.append('rect')
        .attr('x', -FRACTION_WIDTH / 2)
        .attr('y', 0)
        .attr('width', FRACTION_WIDTH)
        .attr('height', function(d) { return d.size * SCALE_Y; })
        .attr('fill', function(d) { return d._color; });

    hoverGroups.append('rect')
        .attr('x', -FRACTION_WIDTH / 2)
        .attr('y', function(d) {
            if (d.size < 5)
                return -(5 - d.size) / 2 * SCALE_Y;
            else
                return 0;
        })
        .attr('width', FRACTION_WIDTH)
        .attr('height', function(d) {
            if (d.size < 5)
                return 5 * SCALE_Y;
            else
                return d.size * SCALE_Y;
        })
        .attr('fill', 'rgba(0, 0, 0, 0)');


    var labels = groups.append('g')
        .classed('fractionLabel', true)
        .attr('transform', function(d) {
            var y = 0;
            var x = d.categoryId == 7 ? -13 : 7;
            var toShift = {
                5713: 10,
                5714: 10,
                5707: 10,
                5729: 10,
                5739: 10,
                7000: 20,
                5726: 15,
                5733: 15,
                7004: -12
            }

            if (toShift[d.id] !== undefined) y = toShift[d.id]

            return 'translate(' + x +', ' + (y + 2) + ')';
        })
        .attr('text-anchor', function(d) {
            return d.categoryId == 7 ? 'end' : 'start';
        });

    labels.append('rect')
        .attr('y', 0)
        .attr('height', 16);

    labels.append('text')
        .text(function(d) { return d._name; })
        .attr('x', 3)
        .attr('y', 12);

    labels.each(function(d) {
        var bbox = d3.select(this).select('text').node().getBBox();
        d3.select(this).select('rect').attr('x', bbox.x -3 );
        d3.select(this).select('rect').attr('width', bbox.width + 6);
    })

    s.fractions = dom.fractions.selectAll('.fraction');
}

function addTrainees() {
    var trainees = dom.trainees.selectAll('.trainee').data(a_trainees).enter().append('div');

    trainees
        .classed('trainee', true)
        .attr('title', function(d) { return d.name; })
        .on('mouseover', function(d) { hoverTrainee(d); })
        .on('mouseout', function(d) { hoverTrainee(); })
        .on('click', function(d) { event.stopPropagation(); })
        .append('div')
            .classed('traineeName', true)
            .text(function(d) {
                return d.name;
            });

    var group = trainees
        .append('div')
        .classed('traineeGroups', true)
        .selectAll('traineeGroup').data(function(d) { return d.categories; }).enter();

    group.append('div')
        .classed('traineeGroup', true)
        .classed('empty', function(d) { return d.groupId === undefined; })
        .style('background-color', function(d) {
            if (d.groupId !== undefined) {
              return d_groups[d.groupId].color;
            }
            else
                return 'none';
        })

    s.trainees = dom.trainees.selectAll('.trainee');
}

function scrollEvents() {
    d3.select(document).on('scroll', function() {
        dom.header.classed('scroll', document.body.scrollTop > 0);
    });
}

function draw() {
    if (window.innerHeight < 575 + 85 + 25) {
        SCALE_Y = ((575 - TOP_MARGIN - (575 + 85 + 25 - window.innerHeight)) / (575 - TOP_MARGIN)) * 4;
    }

    // if (window.innerWidth < 1000 + 210 + 20) {
        // CATEGORY_OFFSET = (1000 - (1000 + 210 + 20 - window.innerWidth) - 2 * LEFT_MARGIN) / 6;
    // }

    dom.svg = d3.select('#diagram svg');
    dom.categories = dom.svg.select('.categories');
    dom.fractions = dom.svg.select('.fractions');
    dom.transitionsDirect = dom.svg.select('.transitions .direct');
    dom.transitionsJump = dom.svg.select('.transitions .jump');
    dom.defs = dom.svg.select('defs');
    dom.trainees = d3.select('.trainees');
    dom.header = d3.select('#listHeader');
    dom.transitionsHover = d3.select('.hoverTransitions');
    dom.fractionsHover = d3.select('.hoverFractions');
    dom.drawArea = d3.select('svg .drawings');

    drawCategories();
    drawFractions();
    drawTransitions();
    addTrainees();

    setTitle();

    scrollEvents();

    d3.select(window).on('click', function() {
        clearSelection();
        setTitle();
    });
}