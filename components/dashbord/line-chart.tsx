import React, { useRef } from "react";
import Chart from "chart.js/auto";
import { NextPage } from "next";

import classes from "./line-chart.module.css";

declare global {
  interface HTMLCanvasElement {
    chart?: Chart;
  }
}

interface LineChartProps {
  filter: string;
  dataX: string[];
  dataY: number[];
}

const CardLineChart: NextPage<LineChartProps> = ({ filter, dataX, dataY }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = chartRef.current;

    if (canvas) {
      if (canvas.chart) {
        canvas.chart.destroy();
      }

      const config = {
        type: "line",
        data: {
          labels: dataX,
          datasets: [
            {
              label: "ยอดขาย",
              backgroundColor: "rgb(75, 192, 192)",
              borderColor: "rgb(75, 192, 192)",
              data: dataY,
              tension: 0.1,
              fill: false,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: "Sales Charts",
            fontColor: "white",
          },
          legend: {
            labels: {
              fontColor: "white",
            },
            align: "end",
            position: "bottom",
          },
          tooltips: {
            mode: "index",
            intersect: false,
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Month",
                  fontColor: "white",
                },
                gridLines: {
                  display: false,
                  borderDash: [2],
                  borderDashOffset: [2],
                  color: "rgba(33, 37, 41, 0.3)",
                  zeroLineColor: "rgba(0, 0, 0, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Value",
                  fontColor: "white",
                },
                gridLines: {
                  borderDash: [3],
                  borderDashOffset: [3],
                  drawBorder: false,
                  color: "rgba(255, 255, 255, 0.15)",
                  zeroLineColor: "rgba(33, 37, 41, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
          },
        },
      };

      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.chart = new Chart(ctx, config);
      }
    }
  }, [filter, dataX, dataY]);
  return (
    <>
      <canvas ref={chartRef} />
      {/* <div className={classes.chartWrapper}>
        <div className={classes.chartAreaWrapper}>
          <div className={classes.chartAreaWrapper2}>
            <canvas id="chart-Test" height="300" width="1200"></canvas>
          </div>
        </div>
        <canvas id="axis-Test" height="300" width="0"></canvas>
      </div> */}
    </>
  );
};

export default CardLineChart;
