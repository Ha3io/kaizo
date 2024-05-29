"use client";

import "@styles/ModDetails.scss";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import {
  ArrowForwardIos,
  Edit,
  FavoriteBorder,
  ArrowBackIosNew,
  ShoppingCart,
  Favorite,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ModDetails = () => {
  const [loading, setLoading] = useState(true);
  const [mod, setMod] = useState({});
  

  const searchParams = useSearchParams();
  const modId = searchParams.get("id");

  /* GET MOD DETAILS */
  useEffect(() => {
    const getModDetails = async () => {
      const response = await fetch(`api/mod/${modId}`, {
        method: "GET",
      });
      const data = await response.json();
      setMod(data);
      setLoading(false);
    };

    if (modId) {
      getModDetails();
    }
  }, [modId]);

  const { data: session, update } = useSession();

  const userId = session?.user?._id;

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

  /* SHOW MORE PHOTOS */
  const [visiblePhotos, setVisiblePhotos] = useState(5);

  const loadMorePhotos = () => {
    setVisiblePhotos(mod.modPhotoPaths.length);
  };

  /* SELECT PHOTO TO SHOW */
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const handleSelectedPhoto = (index) => {
    setSelectedPhoto(index);
    setCurrentIndex(index);
  };

  const router = useRouter();

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

  const patchDownLoad = async () => { 
    mod.downloads += 1;
    const install = {
      modId: modId,
      userId: userId,
      date: new Date().getDate(),
    };
    try {
      const newModForm = new FormData();
      for (var key in install) {
        newModForm.append(key, install[key])
      }

      const response = await fetch("/api/install", {
        method: "POST",
        body: newModForm
      })
      
      const newModForm2 = new FormData();
      for (var key in mod) {
        newModForm2.append(key, mod[key])
      }
      const response2 = await fetch(`/api/mod/${modId}`, {
        method: "PATCH",
        body: newModForm2
      })
    } catch (err) {
      console.log("Update Mod failed", err.message)
    }
  };


  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="mod-details">
        <div className="title">
          <h1>{mod.title}</h1>
          {mod?.creator?._id === userId || session?.user.role === "admin" ? (
            <div
              className="save"
              onClick={() => {
                router.push(`/update-mod?id=${modId}`);
              }}
            >
              <Edit />
              <p>Edit</p>
            </div>
          ) : (
            <div className="save" onClick={patchWishlist}>
              {isLiked ? (
                <Favorite sx={{ color: "red" }} />
              ) : (
                <FavoriteBorder />
              )}
              <p>Save</p>
            </div>
          )}
        </div>

        <div className="slider-container">
          <div
            className="slider"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {mod.modPhotoPaths?.map((photo, index) => (
              <div className="slide" key={index}>
                <img src={photo} alt="mod" />
                <div className="prev-button" onClick={(e) => goToPrevSlide(e)}>
                  <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </div>
                <div className="next-button" onClick={(e) => goToNextSlide(e)}>
                  <ArrowForwardIos sx={{ fontSize: "15px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="photos">
          {mod.modPhotoPaths?.slice(0, visiblePhotos).map((photo, index) => (
            <img
              src={photo}
              alt="mod-demo"
              key={index}
              onClick={() => handleSelectedPhoto(index)}
              className={selectedPhoto === index ? "selected" : ""}
            />
          ))}

          {visiblePhotos < mod.modPhotoPaths.length && (
            <div className="show-more" onClick={loadMorePhotos}>
              <ArrowForwardIos sx={{ fontSize: "40px" }} />
              Show More
            </div>
          )}
        </div>

        <hr />

        <div className="profile">
          <img
            src={mod.creator.profileImagePath}
            alt="profile"
            onClick={() => router.push(`/shop?id=${mod.creator._id}`)}
          />
          <h3>Created by {mod.creator.username}</h3>
        </div>

        <hr />

        <h3>Total number of downloads</h3>
        <p>{mod.downloads}</p>
        <h3>About this product</h3>
        <p>{mod.description}</p>

        {mod.price === 0 ? (
          <button type="submit" onClick={patchDownLoad}>Install</button>
        ):(
          <button type="submit" onClick={patchDownLoad}>{mod.price}$</button>
        )}
      </div>
    </>
  );
};

export default ModDetails;
