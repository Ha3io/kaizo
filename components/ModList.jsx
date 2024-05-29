import "@styles/ModList.scss"
import ModCard from "./ModCard"

const ModList = ({ data}) => {
  console.log("Data:", data);
  return (
    <div className="mod-list">
      {data.map((mod) => (
        <ModCard
          key={mod._id}
          mod={mod}
        />
      ))}
    </div>
  )
}

export default ModList