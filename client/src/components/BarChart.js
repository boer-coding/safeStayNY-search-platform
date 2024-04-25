import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data }) => { 
  return (
    <ResponsiveContainer width="80%" height="80%">
      <BarChart
        width={50}
        height={20}
        data={data} 
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="neighborhood_group" />
        <YAxis domain={[0, 70000]}/>
        <Tooltip labelFormatter={(value) => `${value}：Crime Count`} />
        <Legend />
        <Bar dataKey="crime_count" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
      </BarChart>
    </ResponsiveContainer>
  );
}


export default BarChartComponent;
