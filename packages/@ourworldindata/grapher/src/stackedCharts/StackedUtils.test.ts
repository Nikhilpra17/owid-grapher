#! /usr/bin/env jest

import { stackSeries, withMissingValuesAsZeroes } from "./StackedUtils"

const seriesArr = [
    {
        seriesName: "Canada",
        columnSlug: "var",
        color: "red",
        points: [
            { position: 2000, time: 2000, value: 10, valueOffset: 0 },
            { position: 2002, time: 2002, value: 12, valueOffset: 0 },
        ],
    },
    {
        seriesName: "USA",
        columnSlug: "var",
        color: "red",
        points: [{ position: 2000, time: 2000, value: 2, valueOffset: 0 }],
    },
    {
        seriesName: "France",
        columnSlug: "var",
        color: "red",
        points: [
            { position: 2000, time: 2000, value: 6, valueOffset: 0 },
            { position: 2003, time: 2003, value: 4, valueOffset: 0 },
        ],
    },
]

it("can add fake points", () => {
    expect(seriesArr[1].points[1]).toEqual(undefined)
    const series = withMissingValuesAsZeroes(seriesArr)
    expect(series[1].points[1].position).toEqual(2002)
})

it("can enforce uniform spacing on the x-axis", () => {
    expect(seriesArr[1].points[1]).toEqual(undefined)
    expect(seriesArr[1].points[2]).toEqual(undefined)
    expect(seriesArr[1].points[3]).toEqual(undefined)
    const series = withMissingValuesAsZeroes(seriesArr, {
        enforceUniformSpacing: true,
    })
    expect(series[1].points[1].position).toEqual(2001)
    expect(series[1].points[2].position).toEqual(2002)
    expect(series[1].points[3].position).toEqual(2003)
})

it("can stack series", () => {
    expect(seriesArr[1].points[0].valueOffset).toEqual(0)
    const series = stackSeries(withMissingValuesAsZeroes(seriesArr))
    expect(series[1].points[0].valueOffset).toEqual(10)
})
