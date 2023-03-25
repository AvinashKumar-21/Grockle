import React, { useEffect, useState } from "react";
import Perk from "../components/Perk";
import { AccountsNav } from "./AccountsNav";
import axios from "axios";
import { Navigate, useParams } from "react-router";
import PhotosUploader from "./PhotosUploader";

export const PlacesForm = () => {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addPhotos, setAddPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(0);
  const { id } = useParams();
  useEffect(() => {
    if (!id) return;
    else
      axios.get("/places/" + id).then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddPhotos(data.photos);
        setDescription(data.description);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPerks(data.perks);
        setPrice(data.price);
      });
  }, [id]);

  function addHeader(text) {
    return <h1 className="text-2xl mt-4">{text}</h1>;
  }
  function addDescription(text) {
    return <p className=" text-sm text-gray-500">{text}</p>;
  }
  function addTop(title, desc) {
    return (
      <div>
        {addHeader(title)}
        {addDescription(desc)}
      </div>
    );
  }
  async function addNewPlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      await axios.put("/places", {
        id,
        ...placeData,
      });
    } else {
      await axios.post("/places", placeData);
    }
    setRedirect(true);
  }
  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountsNav />
      <form onSubmit={addNewPlace}>
        {addTop(
          "Title",
          "Title for your place. Should be short and catchy as in advertisement."
        )}
        <input
          type="text"
          placeholder="Title, for example: My lovely appartment."
          value={title}
          onChange={(ev) => {
            setTitle(ev.target.value);
          }}
        />
        {addTop("Address", "Address for this place.")}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
        ></input>
        {addTop("Photos", "More = Better")}
        <PhotosUploader addedPhotos={addPhotos} onChange={setAddPhotos} />
        {addTop("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {addTop("Perks", "Select all the perks of the place.")}

        <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 justify-between">
          <Perk selected={perks} onChange={setPerks} />
        </div>
        {addTop("Extra info", "house rules,etc..")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {addTop(
          "Check in&out time",
          "add check in and out time, remember to have some time for cleaning the roon between guests."
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div className=" mt-2 -mb-2 ">
            <h2>Check in time</h2>
            <input
              type="text"
              placeholder="14:00"
              value={checkIn}
              onChange={(ev) => {
                setCheckIn(ev.target.value);
              }}
            />
          </div>
          <div className=" mt-2 -mb-2 ">
            <h2>Check out time</h2>
            <input
              type="text"
              placeholder=" 17:00"
              value={checkOut}
              onChange={(ev) => {
                setCheckOut(ev.target.value);
              }}
            />
          </div>
          <div className=" mt-2 -mb-2 ">
            <h2>Max Guests</h2>
            <input
              type="number"
              placeholder="4"
              value={maxGuests}
              onChange={(ev) => {
                setMaxGuests(ev.target.value);
              }}
            />
          </div>
          <div className=" mt-2 -mb-2 ">
            <h2>Price per night</h2>
            <input
              type="number"
              placeholder="4"
              value={price}
              onChange={(ev) => {
                setPrice(ev.target.value);
              }}
            />
          </div>
        </div>

        <div className="my-5 text-center">
          <button className="inline-flex gap-1 bg-primary text-white rounded-full px-8 py-2 justify-center">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
