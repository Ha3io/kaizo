import Navbar from "@components/Navbar";
import { getInstallsPerMonth } from "@app/api/action/action";
import InstallsChart from "@components/InstallsChart";
import "@styles/DashBoard.scss";

export default async function DashBoard() {
    const graphData = await getInstallsPerMonth();
    return (
        <>
            <Navbar />
            <h1 className="title-list">DashBoard</h1>
            <InstallsChart data={graphData}/>
        </>
    );
}

