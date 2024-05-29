

import { connectToDB } from "@mongodb/database";
import Install from "@models/Install";

export const getInstallsPerMonth = async () => {
    await connectToDB();
    let installs = await Install.find();


    const installsPerMonth = installs.reduce((acc, install) => {
      const monthIndex = new Date(install.date).getMonth(); // 0 for Janruary --> 11 for December
      acc[monthIndex] = (acc[monthIndex] || 0) + 1;
      // For June
      // acc[5] = (acc[5] || 0) + order.totalAmount (orders have monthIndex 5)
      return acc
    }, {})
          
    const graphData = Array.from({ length: 12}, (_, i) => {
      const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(0, i))
      // if i === 5 => month = "Jun"
      return { name: month, installs: installsPerMonth[i] || 0 }
    })  
    return graphData
};