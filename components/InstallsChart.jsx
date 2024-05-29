"use client"

import { useRef,  useEffect } from "react";
import { Chart } from "chart.js/auto";

const InstallsChart = ({data}) => {
    const installsData = data.map(item => item.installs);
    const chartRef = useRef(null)
    useEffect(() => {
        if(chartRef.current){
            if(chartRef.current.chart){
                chartRef.current.chart.destroy()
            }

            const context = chartRef.current.getContext("2d");

            const newChart = new Chart(context, {
                type: "line",
                data:{
                    labels:["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
                    datasets:[
                        {
                            label:"Installs",
                            data:installsData,
                            backgroundColor: "yellow",
                            borderColor: "blue",
                            borderWidth:1,

                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            type: "category"
                        },
                        y:{
                            beginAtZero:true
                        }
                    }
                }
            });
            
            chartRef.current.chart = newChart
        }
    }, [])

    return (
        <div style={{position: "relative", width: "100vw", height: "60vh"}}>
            <canvas ref={chartRef}/>
        </div>
    )
}

export default InstallsChart