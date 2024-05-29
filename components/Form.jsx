import { categories } from "@data";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";

import "@styles/Form.scss";

const Form = ({ type, mod, setMod, handleSubmit }) => {
  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setMod((prevMod) => {
      return {
        ...prevMod,
        photos: [...prevMod.photos, ...newPhotos],
      };
    });
  };

  const handleRemovePhoto = (indexToRemove) => {
    setMod((prevMod) => {
      return {
        ...prevMod,
        photos: prevMod.photos.filter((_, index) => index !== indexToRemove),
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMod((prevMod) => {
      return {
        ...prevMod,
        [name]: value,
      };
    });
  };

  return (
    <div className="form">
      <h1>{type} Your Mod</h1>
      <form onSubmit={handleSubmit}>
        <h3>Which of these categories best describes your mod?</h3>
        <div className="category-list">
          {categories?.map((item, index) => (
            <p
              key={index}
              className={`${mod.category === item ? "selected" : "All"}`}
              onClick={() => {
                setMod({ ...mod, category: item });
              }}
            >
              {item}
            </p>
          ))}
        </div>

        <h3>Add some photos of your mod</h3>
        {mod.photos.length < 1 && (
          <div className="photos">
            <input
              id="image"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label htmlFor="image" className="alone">
              <div className="icon">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )}

        {mod.photos.length > 0 && (
          <div className="photos">
            {mod?.photos?.map((photo, index) => (
              <div key={index} className="photo">
                {photo instanceof Object ? (
                  <img src={URL.createObjectURL(photo)} alt="mod" />
                ) : (
                  <img src={photo} alt="mod" />
                )}
                <button type="button" onClick={() => handleRemovePhoto(index)}>
                  <BiTrash />
                </button>
              </div>
            ))}
            <input
              id="image"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label htmlFor="image" className="together">
              <div className="icon">
                <IoIosImages />
              </div>
              <p>Upload from your device</p>
            </label>
          </div>
        )}

        <h3>What make your Mod attractive?</h3>
        <div className="description">
          <p>Title</p>
          <input
            maxLength={20}
            type="text"
            placeholder="Title"
            onChange={handleChange}
            name="title"
            value={mod.title}
            required
          />
          <p>Description</p>
          <textarea
            type="text"
            placeholder="Description"
            onChange={handleChange}
            name="description"
            value={mod.description}
            required
          />
          <p>Now, set your PRICE</p>
          <span>$</span>
          <input
            type="number"
            placeholder="Price"
            onChange={handleChange}
            name="price"
            value={mod.price}
            className="price"
            required
          />
        </div>
        <button className="submit_btn" type="submit">PUBLISH YOUR MOD</button>
      </form>
    </div>
  );
};

export default Form;
