import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Delete,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import "@styles/ModCard.scss";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ModCard = ({ mod }) => {
  /* SLIDER FOR PHOTOS */
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % mod.modPhotoPaths.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + mod.modPhotoPaths.length) %
        mod.modPhotoPaths.length
    );
  };

  const router = useRouter();

  /* DELETE WORK */
  const handleDelete = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this mod?");

    if (hasConfirmed) {
      try {
        await fetch(`api/mod/${mod._id}`, {
          method: "DELETE",
        });
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const { data: session, update } = useSession();
  const userId = session?.user?._id;

  /* ADD TO WISHLIST */
  const wishlist = session?.user?.wishlist;

  const isLiked = wishlist?.find((item) => item?._id === mod._id);

  const patchWishlist = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    const response = await fetch(`api/user/${userId}/wishlist/${mod._id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    update({ user: { wishlist: data.wishlist } }); // update session
  };
  return (
    <div
      className="mod-card"
      onClick={() => {
        router.push(`/mod-details?id=${mod._id}`);
      }}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {mod.modPhotoPaths?.map((photo, index) => (
            <div className="slide" key={index}>
              <img src={photo} alt="mod" />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info">
        <div>
          <h3>{mod.title}</h3>
          <div className="creator">
            <img src={mod.creator.profileImagePath} alt="creator" />
            <span>{mod.creator.username}</span> Downloads: <span>{mod.downloads}</span>
          </div>
        </div>
        {mod.price === 0 ? (
          <div className="install">Install</div>
        ):(
          <div className="install">{mod.price}$</div>
        )}
        
      </div>

      {userId === mod?.creator._id || session?.user.role === "admin" ? (
        <div
          className="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(); 
          }}
        >
          <Delete
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "5px",
              fontSize: "30px",
            }}
          />
        </div>
      ) : (
        <div
          className="icon"
          onClick={(e) => {
            e.stopPropagation();
            patchWishlist();
          }}
        >
          {isLiked ? (
            <Favorite
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                color: "red",
                padding: "5px",
                fontSize: "30px",
              }}
            />
          ) : (
            <FavoriteBorder
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                padding: "5px",
                fontSize: "30px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ModCard;
