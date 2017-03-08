/*
 * Copyright (C) 2017 Elvis Teixeira
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var plot = {
    line: function(args) {
        if ( ! args.data)
            throw Error('No data provided!');
        // Let's guess the schema of the data
        if (args.data.constructor === Array) {
            // TODO
        } else if (args.data.x && args.data.y) {
            // we re given two arrays x and y, that is easy
            args.data = this.xyToPoints(args.data.x, args.data.y);
        }
        // define the line
        let chart = this.createChart(args);
        let valueLine = d3.line()
            .x(function(d) { return chart.x1Scale(d[0]); })
            .y(function(d) { return chart.y1Scale(d[1]); });
        // Create line plot
        let lineGraph = chart.svg.append("path")
            .data([args.data])
            .attr("class", "line")
            .attr("stroke", args.stroke)
            .attr("stroke-width", args.strokeWidth.toString() + 'px')
            .attr("fill", args.fill || 'none')
            .attr("d", valueLine);
    },
    xyToPoints: function(x, y) {
        let points = [];
        let nPts = Math.min(x.length, y.length);
        for (let i=0; i<nPts; ++i) {
            points.push([x[i], y[i]]);
        }
        return points;
    },
    createChart: function(args) {
        let chart = {
            bounds: {
                xMin: d3.min(args.data, function(d) { return d[0]; }),
                xMax: d3.max(args.data, function(d) { return d[0]; }),
                yMin: d3.min(args.data, function(d) { return d[1]; }),
                yMax: d3.max(args.data, function(d) { return d[1]; })
            },
            svg: d3.select(args.htmlElement).append("svg")
        };
        this.addDefaults(chart, args);
        this.createAxis(chart, args);
        return chart;
    },
    addDefaults: function(chart, args) {
        // REQUIRED properties of args:
        if ( ! args.htmlElement || ! args.data)
            throw Error('Arguments required: htmlElement and data');
        // - data
        let defaults = {
            vertPadding: 40,
            horPadding: 55,
            width: 600,
            height: 350,
            background: '#F6F6F6',
            stroke: "blue",
            strokeWidth: 1.0,
            fill: null
        };
        for (let prop in defaults) {
            if ( ! args.hasOwnProperty(prop)) {
                args[prop] = defaults[prop];
            }
        }
    },
    createAxis: function(chart, args) {
        // give a 'size' to the plot
        chart.svg.attr("width", args.width)
                 .attr("height", args.height);
        // Create X scale and axis
        chart.x1Scale = d3.scaleLinear()
            .domain([chart.bounds.xMin, chart.bounds.xMax])
            .range([args.horPadding, args.width - args.horPadding]);
        chart.x1Axis = d3.axisBottom()
            .scale(chart.x1Scale)
            .ticks(Math.floor(args.width / 60.0) - 1);
        chart.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (args.height - args.vertPadding) + ")")
            .call(chart.x1Axis);
        // Create Y scale and axis
        chart.y1Scale = d3.scaleLinear()
            .domain([chart.bounds.yMin, chart.bounds.yMax])
            .range([args.height - args.vertPadding, args.vertPadding]);
        chart.y1Axis = d3.axisLeft()
            .scale(chart.y1Scale)
            .ticks(Math.floor(args.height / 50.0) - 1);
        chart.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + args.horPadding + ",0)")
            .call(chart.y1Axis);
        /*
        chart.x2Scale = d3.scaleLinear()
            .domain([chart.bounds.xMin, chart.bounds.xMax])
            .range([args.horPadding, args.width - args.horPadding]);
        chart.x2Axis = d3.axisBottom()
            .scale(chart.x2Scale)
            .ticks(Math.floor(args.width / 60.0) - 1);
        chart.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + args.vertPadding + ")")
            .call(chart.x2Axis);
        chart.y2Scale = d3.scaleLinear()
            .domain([chart.bounds.yMin, chart.bounds.yMax])
            .range([args.height - args.vertPadding, args.vertPadding]);
        chart.y2Axis = d3.axisRight()
            .scale(chart.y2Scale)
            .ticks(Math.floor(args.height / 50.0) - 1);
        chart.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (args.width - args.horPadding) + ",0)")
            .call(chart.y2Axis);
        */
    }
}
