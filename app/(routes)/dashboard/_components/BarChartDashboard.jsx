import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import React from 'react';
function BarChartDashboard({ budgetList }) {
  return (
    <div className='border rounded-lg p-5'>
      <ResponsiveContainer width={'80%'} height={300}>
      <BarChart

        data={budgetList}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalSpends" stackId="a" fill="#4845d2" />
        <Bar dataKey="amount" stackId="a" fill="#C3C2FF" />
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartDashboard;
